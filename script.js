// groupmeal Landing Page JavaScript

// DOM Elements
const waitlistForm = document.getElementById("waitlistForm");
const successModal = document.getElementById("successModal");
const primaryCTA = document.getElementById("primaryCTA");
const joinWaitlistBtn = document.getElementById("joinWaitlistBtn");

// Waitlist counter - simulated for demo
let waitlistCount = 127;

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  initializeAnimations();
  setupEventListeners();
  setupScrollEffects();
  initializeFeatureInteractions();
  initializeMagneticCursor();
  initializeFloatingFoodInteractions();
  initializeHeroMicroInteractions();
  initializeMobileDemo();
});

// Setup event listeners
function setupEventListeners() {
  // Waitlist form submission
  if (waitlistForm) {
    waitlistForm.addEventListener("submit", handleWaitlistSubmission);
  }

  // CTA buttons
  if (primaryCTA) {
    primaryCTA.addEventListener("click", scrollToWaitlist);
  }

  if (joinWaitlistBtn) {
    joinWaitlistBtn.addEventListener("click", scrollToWaitlist);
  }

  // Navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", handleNavigation);
  });

  // Feature cards
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("mouseenter", handleFeatureHover);
    card.addEventListener("mouseleave", handleFeatureLeave);
  });

  // Demo video button
  const watchDemoBtn = document.querySelector(".btn-secondary");
  if (watchDemoBtn) {
    watchDemoBtn.addEventListener("click", showDemoModal);
  }
}

// Handle waitlist form submission
async function handleWaitlistSubmission(e) {
  e.preventDefault();

  const emailInput = e.target.querySelector(".email-input");
  const email = emailInput.value.trim();

  if (!isValidEmail(email)) {
    showNotification("Please enter a valid email address", "error");
    return;
  }

  // Disable form during submission
  const submitBtn = e.target.querySelector(".submit-btn");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = "<span>Joining...</span>";
  submitBtn.disabled = true;

  try {
    // Submit to real API
    const result = await submitToWaitlist(email);

    // Update waitlist count with real data
    if (result.count) {
      waitlistCount = result.count;
      updateWaitlistCount();
    }

    // Show success modal
    showSuccessModal();

    // Reset form
    emailInput.value = "";

    // Track conversion (in real app, send to analytics)
    trackWaitlistSignup(email);
  } catch (error) {
    showNotification(error.message || "Something went wrong. Please try again.", "error");
  } finally {
    // Re-enable form
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

// Real API call for waitlist signup
async function submitToWaitlist(email) {
  const response = await fetch('/api/waitlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to join waitlist');
  }

  return response.json();
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show success modal
function showSuccessModal() {
  if (successModal) {
    successModal.classList.add("active");

    // Auto-close after 5 seconds
    setTimeout(() => {
      closeModal();
    }, 5000);
  }
}

// Close modal
function closeModal() {
  if (successModal) {
    successModal.classList.remove("active");
  }
}

// Update waitlist count display
function updateWaitlistCount() {
  const countElements = document.querySelectorAll(".proof-text strong");
  countElements.forEach((element) => {
    element.textContent = "food lovers";
  });

  const avatarCount = document.querySelector(".avatar-count");
  if (avatarCount) {
    avatarCount.textContent = `+`;
  }
}

// Scroll to waitlist section
function scrollToWaitlist() {
  const waitlistSection = document.querySelector(".waitlist-section");
  if (waitlistSection) {
    waitlistSection.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Focus on email input after scroll
    setTimeout(() => {
      const emailInput = document.querySelector(".email-input");
      if (emailInput) {
        emailInput.focus();
      }
    }, 800);
  }
}

// Handle navigation clicks
function handleNavigation(e) {
  e.preventDefault();
  const text = e.target.textContent.toLowerCase();

  switch (text) {
    case "how it works":
      scrollToSection(".magic-moments");
      break;
    case "features":
      scrollToSection(".features-preview");
      break;
    default:
      break;
  }
}

// Scroll to specific section
function scrollToSection(selector) {
  const section = document.querySelector(selector);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Handle feature card interactions
function handleFeatureHover(e) {
  const card = e.currentTarget;
  const feature = card.dataset.feature;

  // Add enhanced hover effect
  card.style.transform = "translateY(-12px) scale(1.02)";
  card.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

  // Trigger related animations based on feature type
  switch (feature) {
    case "group":
      animateGroupFeature(card);
      break;
    case "vote":
      animateVoteFeature(card);
      break;
    case "payments":
      animatePaymentFeature(card);
      break;
    case "recurring":
      animateRecurringFeature(card);
      break;
  }
}

function handleFeatureLeave(e) {
  const card = e.currentTarget;
  card.style.transform = "";
  card.style.transition = "all 0.3s ease";
}

// Feature-specific animations
function animateGroupFeature(card) {
  const icon = card.querySelector(".feature-icon");
  icon.style.animation = "pulse 1s ease-in-out infinite";
}

function animateVoteFeature(card) {
  const icon = card.querySelector(".feature-icon");
  icon.style.animation = "bounce 0.8s ease-in-out infinite";
}

function animatePaymentFeature(card) {
  const icon = card.querySelector(".feature-icon");
  icon.style.animation = "swing 1s ease-in-out infinite";
}

function animateRecurringFeature(card) {
  const icon = card.querySelector(".feature-icon");
  icon.style.animation = "rotate 2s linear infinite";
}

// Setup scroll effects
function setupScrollEffects() {
  // Parallax effect for hero background
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector(".hero-background");

    if (heroBackground) {
      heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    // Update navigation background
    updateNavBackground(scrolled);

    // Trigger animations for elements in viewport
    triggerScrollAnimations();
  });
}

// Update navigation background based on scroll
function updateNavBackground(scrolled) {
  const nav = document.querySelector(".nav");
  if (nav) {
    if (scrolled > 50) {
      nav.style.background = "rgba(255, 248, 244, 0.98)";
      nav.style.backdropFilter = "blur(25px)";
      nav.style.boxShadow = "0 1px 20px rgba(35, 49, 32, 0.08)";
    } else {
      nav.style.background = "rgba(255, 248, 244, 0.95)";
      nav.style.backdropFilter = "blur(20px)";
      nav.style.boxShadow = "none";
    }
  }
}

// Intersection Observer for scroll animations
function triggerScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll(".feature-card, .moment-card").forEach((el) => {
    observer.observe(el);
  });
}

// Initialize entrance animations
function initializeAnimations() {
  // Hero elements entrance
  animateHeroEntrance();

  // Phone mockup animation
  animatePhoneMockup();

  // Floating food items
  initializeFloatingFoodItems();
}

function animateHeroEntrance() {
  const elements = [
    ".hero-badge",
    ".hero-title",
    ".hero-subtitle",
    ".hero-demo",
    ".hero-actions",
    ".social-proof",
  ];

  elements.forEach((selector, index) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      element.style.transition = "all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)";

      setTimeout(() => {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, index * 200 + 300);
    }
  });
}

function animatePhoneMockup() {
  const phones = document.querySelectorAll(".phone-mockup");
  phones.forEach((phone, index) => {
    // Initial state
    phone.style.opacity = "0";
    phone.style.transition = "all 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

    // Set initial transforms based on phone position
    if (phone.classList.contains("phone-left")) {
      phone.style.transform =
        "scale(0.6) rotateY(45deg) translateX(-50px) translateY(50px)";
    } else if (phone.classList.contains("phone-right")) {
      phone.style.transform =
        "scale(0.6) rotateY(-45deg) translateX(50px) translateY(50px)";
    } else {
      phone.style.transform = "scale(0.6) translateY(50px)";
    }

    setTimeout(() => {
      phone.style.opacity = "1";
      // Animate to final positions
      if (phone.classList.contains("phone-left")) {
        phone.style.transform =
          "scale(1.0) rotateY(25deg) translateX(0px) translateY(0px)";
      } else if (phone.classList.contains("phone-right")) {
        phone.style.transform =
          "scale(1.0) rotateY(-25deg) translateX(0px) translateY(0px)";
      } else {
        phone.style.transform = "scale(1.0) translateX(0px) translateY(0px)";
      }
    }, 800 + index * 200);
  });
}

function initializeFloatingFoodItems() {
  const foodItems = document.querySelectorAll(".floating-food-item");

  foodItems.forEach((item, index) => {
    // Random initial positions and animations
    const randomDelay = Math.random() * 2;
    const randomDuration = 6 + Math.random() * 4;

    item.style.animationDelay = `${randomDelay}s`;
    item.style.animationDuration = `${randomDuration}s`;

    // Add parallax effect
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const speed = 0.1 + index * 0.05;
      item.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

// Feature interactions
function initializeFeatureInteractions() {
  // Add click interactions for feature cards
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("click", () => {
      const feature = card.dataset.feature;
      showFeatureDetail(feature);
    });
  });
}

function showFeatureDetail(feature) {
  // In a real app, this would show a detailed view or demo
  const details = {
    group:
      "Create shared dining sessions where friends can order together from the same restaurant.",
    vote: "Let your group vote on restaurants democratically with smart tie-breaking.",
    payments:
      "Split bills automatically with individual payments, group tabs, or single payer options.",
    recurring:
      "Set up automated weekly team lunches or monthly dinner gatherings.",
  };

  showNotification(details[feature] || "Feature coming soon!", "info");
}

// Show demo modal (placeholder)
function showDemoModal() {
  showNotification(
    "Demo video coming soon! Join the waitlist to be notified.",
    "info"
  );
  setTimeout(scrollToWaitlist, 1000);
}

// Notification system
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto-remove
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 4000);
}

function getNotificationIcon(type) {
  const icons = {
    success: "✓",
    error: "⚠",
    info: "ℹ",
    warning: "⚡",
  };
  return icons[type] || "ℹ";
}

function getNotificationColor(type) {
  const colors = {
    success: "#84AF41",
    error: "#DC2626",
    info: "#1B4A21",
    warning: "#F59E0B",
  };
  return colors[type] || "#1B4A21";
}

// Analytics tracking (placeholder)
function trackWaitlistSignup(email) {
  // In a real app, send to analytics service
  console.log("Waitlist signup tracked:", email);

  // Google Analytics example:
  // gtag('event', 'signup', {
  //     event_category: 'waitlist',
  //     event_label: 'landing_page'
  // });
}

// Add custom CSS animations
const customStyles = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes swing {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(5deg); }
        75% { transform: rotate(-5deg); }
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-icon {
        font-size: 1.25rem;
    }
`;

// Inject custom styles
const styleSheet = document.createElement("style");
styleSheet.textContent = customStyles;
document.head.appendChild(styleSheet);

// Handle modal clicks
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    closeModal();
  }
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Apply throttling to scroll events
window.addEventListener(
  "scroll",
  throttle(() => {
    const scrolled = window.pageYOffset;
    updateNavBackground(scrolled);
  }, 16)
); // ~60fps

// Preload critical resources
function preloadResources() {
  // Preload any critical images or fonts
  const links = [
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
  ];

  links.forEach((href) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = href;
    document.head.appendChild(link);
  });
}

// Initialize preloading
preloadResources();

// Magnetic Cursor Effect
function initializeMagneticCursor() {
  const cursor = document.createElement("div");
  cursor.className = "magnetic-cursor";
  document.body.appendChild(cursor);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    const diffX = mouseX - cursorX;
    const diffY = mouseY - cursorY;

    cursorX += diffX * 0.1;
    cursorY += diffY * 0.1;

    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Show cursor on hero section
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    heroSection.addEventListener("mouseenter", () => {
      cursor.classList.add("active");
    });

    heroSection.addEventListener("mouseleave", () => {
      cursor.classList.remove("active");
    });
  }
}

// Floating Food Interactions
function initializeFloatingFoodInteractions() {
  const foodItems = document.querySelectorAll(".floating-food-item");

  foodItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      // Create explosion effect
      createFoodExplosion(item);

      // Spawn new food item after delay
      setTimeout(() => {
        respawnFoodItem(item);
      }, 2000);
    });

    // Add magnetic effect near cursor
    item.addEventListener("mouseenter", () => {
      item.style.transform = "scale(1.3) rotate(15deg)";
      item.style.opacity = "0.4";
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
      item.style.opacity = "0.1";
    });
  });
}

function createFoodExplosion(foodItem) {
  const rect = foodItem.getBoundingClientRect();
  const particles = 6;

  for (let i = 0; i < particles; i++) {
    const particle = document.createElement("div");
    particle.textContent = "✨";
    particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: 1rem;
            pointer-events: none;
            z-index: 1000;
            animation: explode${i} 1s ease-out forwards;
        `;

    document.body.appendChild(particle);

    // Create unique explosion animation
    const keyframes = `
            @keyframes explode${i} {
                0% { 
                    transform: translate(0, 0) scale(1); 
                    opacity: 1; 
                }
                100% { 
                    transform: translate(${(Math.random() - 0.5) * 200}px, ${
      (Math.random() - 0.5) * 200
    }px) scale(0); 
                    opacity: 0; 
                }
            }
        `;

    const style = document.createElement("style");
    style.textContent = keyframes;
    document.head.appendChild(style);

    setTimeout(() => {
      document.body.removeChild(particle);
      document.head.removeChild(style);
    }, 1000);
  }

  foodItem.style.opacity = "0";
  foodItem.style.transform = "scale(0)";
}

function respawnFoodItem(foodItem) {
  foodItem.style.transition = "all 0.5s ease";
  foodItem.style.opacity = "0.1";
  foodItem.style.transform = "scale(1)";

  setTimeout(() => {
    foodItem.style.transition = "";
  }, 500);
}

// Hero Microinteractions
function initializeHeroMicroInteractions() {
  // Simple title hover effect without breaking HTML structure
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    heroTitle.addEventListener("mouseenter", () => {
      heroTitle.style.transform = "scale(1.02)";
      heroTitle.style.transition = "transform 0.3s ease";
    });

    heroTitle.addEventListener("mouseleave", () => {
      heroTitle.style.transform = "scale(1)";
    });

    // Add special hover effect to the title-highlight span
    const titleHighlight = heroTitle.querySelector(".title-highlight");
    if (titleHighlight) {
      titleHighlight.addEventListener("mouseenter", () => {
        titleHighlight.style.animation = "titleShimmer 2s ease-in-out";
      });

      titleHighlight.addEventListener("animationend", () => {
        titleHighlight.style.animation = "";
      });
    }
  }

  // Phone mockup interactions for all three phones
  const phoneMockups = document.querySelectorAll(".phone-mockup");
  phoneMockups.forEach((phone, index) => {
    let glowInterval;

    phone.addEventListener("mouseenter", () => {
      glowInterval = setInterval(() => {
        phone.style.boxShadow = `
                    0 35px 80px rgba(35, 49, 32, 0.5),
                    0 0 0 ${Math.random() * 10 + 5}px rgba(132, 175, 65, 0.1)
                `;
      }, 200);
    });

    phone.addEventListener("mouseleave", () => {
      clearInterval(glowInterval);
      phone.style.boxShadow = "";
    });

    // Screen content updates based on phone type
    const demoContent = phone.querySelector(".app-demo");
    if (demoContent) {
      phone.addEventListener("click", () => {
        if (phone.classList.contains("phone-left")) {
          animateCreateSessionContent(demoContent);
        } else if (phone.classList.contains("phone-center")) {
          animateVotingContent(demoContent);
        } else if (phone.classList.contains("phone-right")) {
          animatePaymentContent(demoContent);
        }
      });
    }
  });

  // Avatar stack interactions
  const avatars = document.querySelectorAll(".avatar");
  avatars.forEach((avatar, index) => {
    avatar.addEventListener("click", () => {
      // Wave effect through all avatars
      avatars.forEach((otherAvatar, otherIndex) => {
        setTimeout(() => {
          otherAvatar.style.animation = "avatarPop 0.6s ease";
        }, Math.abs(index - otherIndex) * 100);
      });
    });
  });

  // Badge click interaction
  const heroBadge = document.querySelector(".hero-badge");
  if (heroBadge) {
    heroBadge.addEventListener("click", () => {
      heroBadge.style.animation = "badgeSpin 1s ease";
      setTimeout(() => {
        heroBadge.style.animation = "";
      }, 1000);
    });
  }
}

// Create Session Phone Animation
function animateCreateSessionContent(content) {
  content.style.transform = "scale(0.95)";
  content.style.opacity = "0.8";

  setTimeout(() => {
    content.style.transform = "scale(1)";
    content.style.opacity = "1";

    // Animate friend avatars joining
    const friendAvatars = content.querySelectorAll(".friend-avatar");
    friendAvatars.forEach((avatar, index) => {
      setTimeout(() => {
        avatar.style.animation = "avatarPop 0.6s ease";
      }, index * 100);
    });

    // Animate add friend button
    const addFriend = content.querySelector(".add-friend");
    if (addFriend) {
      addFriend.style.animation = "pulse 1s ease-in-out infinite";
      setTimeout(() => {
        addFriend.style.animation = "";
      }, 2000);
    }
  }, 200);
}

// Voting Phone Animation
function animateVotingContent(content) {
  content.style.transform = "scale(0.95)";
  content.style.opacity = "0.8";

  setTimeout(() => {
    content.style.transform = "scale(1)";
    content.style.opacity = "1";

    // Update vote count
    const voteCount = content.querySelector(".vote-count");
    if (voteCount) {
      const currentCount = parseInt(voteCount.textContent);
      voteCount.textContent = currentCount + 1 + " votes";
    }

    // Animate restaurant cards
    const restaurantCards = content.querySelectorAll(".restaurant-card");
    restaurantCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = "pulse 0.6s ease";
      }, index * 200);
    });
  }, 200);
}

// Payment Phone Animation
function animatePaymentContent(content) {
  content.style.transform = "scale(0.95)";
  content.style.opacity = "0.8";

  setTimeout(() => {
    content.style.transform = "scale(1)";
    content.style.opacity = "1";

    // Animate payment status changes
    const pendingStatuses = content.querySelectorAll(".payment-status.pending");
    if (pendingStatuses.length > 0) {
      const randomPending =
        pendingStatuses[Math.floor(Math.random() * pendingStatuses.length)];
      setTimeout(() => {
        randomPending.textContent = "Paid";
        randomPending.classList.remove("pending");
        randomPending.classList.add("paid");
        randomPending.style.animation = "successPop 0.6s ease";
      }, 500);
    }

    // Animate split items
    const splitItems = content.querySelectorAll(".split-item");
    splitItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.animation = "fadeInUp 0.6s ease";
      }, index * 100);
    });
  }, 200);
}

// Add custom CSS animations for microinteractions
const microInteractionStyles = `
    @keyframes wordBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes avatarPop {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    @keyframes badgeSpin {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
    }
    
    .hero-word {
        display: inline-block;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .hero-word:hover {
        text-shadow: 0 0 20px rgba(132, 175, 65, 0.5);
    }
`;

// Inject microinteraction styles
const microStyleSheet = document.createElement("style");
microStyleSheet.textContent = microInteractionStyles;
document.head.appendChild(microStyleSheet);

// Add loading state management
window.addEventListener("load", () => {
  document.body.classList.add("loaded");

  // Trigger entrance animations after page load
  setTimeout(initializeAnimations, 200);
});

// Error handling for the entire page
window.addEventListener("error", (e) => {
  console.error("Page error:", e.error);
  // In production, send to error reporting service
});

// Add service worker for performance (in production)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // navigator.serviceWorker.register('/sw.js')
    //     .then(registration => console.log('SW registered'))
    //     .catch(error => console.log('SW registration failed'));
  });
}

// Mobile Demo Food Solar System
function initializeMobileDemo() {
  const foodPlanets = document.querySelectorAll('.food-planet');
  const foodPopup = document.getElementById('foodPopup');
  const popupClose = document.querySelector('.popup-close');

  // Food data for different cuisines
  const foodData = {
    pizza: {
      name: "Italian Pizza",
      description: "Authentic wood-fired pizzas with fresh mozzarella and basil",
      emoji: "🍕"
    },
    sushi: {
      name: "Japanese Sushi",
      description: "Fresh sashimi and rolls made by expert sushi chefs",
      emoji: "🍣"
    },
    burger: {
      name: "American Burger",
      description: "Juicy beef patties with all the classic fixings",
      emoji: "🍔"
    },
    taco: {
      name: "Mexican Tacos",
      description: "Authentic street tacos with fresh salsas and spices",
      emoji: "🌮"
    },
    pasta: {
      name: "Italian Pasta",
      description: "Handmade pasta with traditional Italian sauces",
      emoji: "🍝"
    },
    ramen: {
      name: "Japanese Ramen",
      description: "Rich, savory broths with fresh noodles and toppings",
      emoji: "🍜"
    }
  };

  // Add click handlers to food planets
  foodPlanets.forEach(planet => {
    planet.addEventListener('click', (e) => {
      e.stopPropagation();
      const foodType = planet.dataset.food;
      const foodInfo = foodData[foodType];

      if (foodInfo) {
        // Update popup content
        document.querySelector('.popup-emoji').textContent = foodInfo.emoji;
        document.querySelector('.popup-name').textContent = foodInfo.name;
        document.querySelector('.popup-description').textContent = foodInfo.description;

        // Show popup
        foodPopup.classList.add('active');

        // Add particle effect
        createFoodParticles(planet, foodInfo.emoji);
      }
    });

    // Add hover sound effect (visual feedback)
    planet.addEventListener('mouseenter', () => {
      planet.style.animation = 'none';
      planet.style.transform = 'scale(1.2) rotate(10deg)';
    });

    planet.addEventListener('mouseleave', () => {
      planet.style.animation = 'planetFloat 3s ease-in-out infinite';
      planet.style.transform = '';
    });
  });

  // Close popup handlers
  if (popupClose) {
    popupClose.addEventListener('click', closePopup);
  }

  document.addEventListener('click', (e) => {
    if (e.target === foodPopup) {
      closePopup();
    }
  });

  function closePopup() {
    foodPopup.classList.remove('active');
  }

  // Create particle effect when clicking planets
  function createFoodParticles(planet, emoji) {
    const rect = planet.getBoundingClientRect();
    const particles = 5;

    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.textContent = emoji;
      particle.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        font-size: 1.2rem;
        pointer-events: none;
        z-index: 1000;
        animation: planetParticle${i} 1.5s ease-out forwards;
      `;

      document.body.appendChild(particle);

      // Create unique particle animation
      const keyframes = `
        @keyframes planetParticle${i} {
          0% { 
            transform: translate(0, 0) scale(1); 
            opacity: 1; 
          }
          100% { 
            transform: translate(${(Math.random() - 0.5) * 150}px, ${(Math.random() - 0.5) * 150}px) scale(0); 
            opacity: 0; 
          }
        }
      `;

      const style = document.createElement('style');
      style.textContent = keyframes;
      document.head.appendChild(style);

      setTimeout(() => {
        document.body.removeChild(particle);
        document.head.removeChild(style);
      }, 1500);
    }
  }

  // Add entrance animation for the solar system
  const solarSystem = document.querySelector('.food-solar-system');
  if (solarSystem) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate planets appearing
          foodPlanets.forEach((planet, index) => {
            setTimeout(() => {
              planet.style.opacity = '1';
              planet.style.transform = 'scale(1)';
            }, index * 200);
          });
        }
      });
    }, { threshold: 0.3 });

    // Set initial state
    foodPlanets.forEach(planet => {
      planet.style.opacity = '0';
      planet.style.transform = 'scale(0)';
      planet.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });

    observer.observe(solarSystem);
  }

  // Add keyboard support for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && foodPopup.classList.contains('active')) {
      closePopup();
    }
  });
}
