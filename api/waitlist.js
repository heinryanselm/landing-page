import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('groupmeal');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const count = await db.collection('waitlist').countDocuments();
      res.status(200).json({ count });
    } catch (error) {
      console.error('Error getting waitlist count:', error);
      res.status(500).json({ error: 'Failed to get count' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { email } = req.body;

      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Valid email address is required' 
        });
      }

      const { db } = await connectToDatabase();

      // Check if email already exists
      const existingUser = await db.collection('waitlist').findOne({ 
        email: email.toLowerCase() 
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'This email is already on the waitlist' 
        });
      }

      // Add email to waitlist
      await db.collection('waitlist').insertOne({
        email: email.toLowerCase(),
        joinedAt: new Date(),
        source: 'landing_page'
      });

      // Get current waitlist count
      const count = await db.collection('waitlist').countDocuments();

      res.status(200).json({ 
        success: true, 
        message: 'Successfully joined the waitlist!',
        count: count
      });

    } catch (error) {
      console.error('Error adding email to waitlist:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Something went wrong. Please try again.' 
      });
    }
    return;
  }

  // Method not allowed
  res.status(405).json({ error: 'Method not allowed' });
}