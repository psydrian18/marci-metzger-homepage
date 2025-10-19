document.addEventListener("DOMContentLoaded", function() {
  // Smooth scroll for nav links
  document.querySelectorAll('.nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });

  // Fade-in on scroll
  const elements = document.querySelectorAll('.section');
  const appearOptions = { threshold: 0.2 };
  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  elements.forEach(el => appearOnScroll.observe(el));

  // Header background change on scroll
  window.addEventListener("scroll", function() {
    const header = document.querySelector(".header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Initialize Swiper Gallery
  const swiper = new Swiper(".gallerySwiper", {
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      init: function() { updateGalleryBackground(this); },
      slideChange: function() { updateGalleryBackground(this); }
    }
  });

  // Function to update gallery background
  function updateGalleryBackground(swiper) {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const img = activeSlide.querySelector("img");
    const bg = document.querySelector(".gallery-bg");
    if (img && bg) {
      bg.style.backgroundImage = `url(${img.src})`;
    }
  }
});

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// Chatbot
const chatIcon = document.getElementById("chat-icon");
const chatBox = document.getElementById("chatbot");
const chatBody = document.getElementById("chatbot-body");
const chatInput = document.getElementById("chatbot-input");

// Toggle chat box visibility
chatIcon.addEventListener("click", () => {
  chatBox.style.display = (chatBox.style.display === "flex") ? "none" : "flex";
});

// Possible questions/responses
const responses = [
  { keywords: ["hello", "hi"], reply: "Hello! How can I help you today?" },
  { keywords: ["bye", "goodbye"], reply: "Goodbye! Have a great day!" }, // <-- added
  { keywords: ["price", "cost", "how much"], reply: "Our prices depend on the property. Contact us for details!" },
  { keywords: ["visit", "tour", "see"], reply: "You can schedule a visit via phone or email." },
  { keywords: ["hours", "time", "open"], reply: "Our office is open Monday to Friday, 9 AM to 6 PM." },
  { keywords: ["location", "address", "where"], reply: "We are located at 3190 HW-160, Suite F, Pahrump, NV 89048." },
  { keywords: ["contact", "email", "phone"], reply: "You can contact us at (206) 919-6886 or marci@example.com." },
  { keywords: ["services", "help", "assist"], reply: "We help you buy or sell homes with personalized professional service!" }
];

// Bad words list
const badWords = [
  "fuck", "shit", "bitch", "bastard", "asshole", "dick", "piss",
  "cunt", "damn", "crap", "douche", "bollocks", "arse", "fag",
  "slut", "whore", "idiot", "stupid", "dumb", "moron", "jackass",
  "nigga", "nigger", "retard", "cock", "twat", "bugger", "wanker"
];
const badResponse = "Please use respectful language. Let's keep this conversation friendly.";

// Function to send bot message
function sendBotMessage(msg) {
  chatBody.innerHTML += `<div><strong>Bot:</strong> ${msg}</div>`;
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Function to send user message
function sendUserMessage(msg) {
  chatBody.innerHTML += `<div><strong>You:</strong> ${msg}</div>`;
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Function to handle message
function handleMessage(msg) {
  let botMsg = "I can't answer that question."; // default reply

  if (badWords.some(word => msg.toLowerCase().includes(word))) {
    botMsg = badResponse;
  } else {
    for (let i = 0; i < responses.length; i++) {
      if (responses[i].keywords.some(keyword => msg.toLowerCase().includes(keyword))) {
        botMsg = responses[i].reply;
        break;
      }
    }
  }

  sendBotMessage(botMsg);
}

// Listen for Enter key
chatInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;
    sendUserMessage(userMsg);
    handleMessage(userMsg);
    chatInput.value = "";
  }
});

// Suggested question container
const suggestedContainer = document.createElement("div");
suggestedContainer.classList.add("suggested-questions");
chatBody.appendChild(suggestedContainer);

// Only create the "hello" button
const helloResponse = responses[0]; // hi/hello
const helloQuestion = helloResponse.keywords[0];
const helloBtn = document.createElement("button");
helloBtn.classList.add("suggested-btn");
helloBtn.style.margin = "0.3rem"; // spacing
helloBtn.innerText = `Ask: ${helloQuestion}`;
suggestedContainer.appendChild(helloBtn);

// Click event for "hello" button
helloBtn.addEventListener("click", () => {
  sendUserMessage(helloQuestion);
  handleMessage(helloQuestion);
});
