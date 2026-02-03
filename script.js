const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const questionContainer = document.getElementById("questionContainer");
const celebration = document.getElementById("celebration");
const buttonContainer = document.querySelector(".button-container");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");

let isMusicPlaying = false;
let continuousAnimationsRunning = false;
let animationIntervals = [];
let noClickCount = 0;
let canMove = true;
let moveTimeout = null;

const responses = [
  "Wrong answer. Think again 💭",
  "Wrong again. Choose the correct answer 🥺",
  "No, babe! Think again 💖",
];

// Set initial volume
bgMusic.volume = 0.7;

// Initialize No button position below Yes button
function initNoButtonPosition() {
  const yesRect = yesBtn.getBoundingClientRect();
  const btnWidth = noBtn.offsetWidth;

  // Position below the Yes button, centered
  const leftPos = yesRect.left + yesRect.width / 2 - btnWidth / 2;
  const topPos = yesRect.bottom + 30; // 30px gap below Yes button

  noBtn.style.left = `${leftPos}px`;
  noBtn.style.top = `${topPos}px`;
}

// Call on load and resize
window.addEventListener("load", initNoButtonPosition);
window.addEventListener("resize", initNoButtonPosition);

// Track mouse movement for button interactions
document.addEventListener("mousemove", (e) => {
  // Get button positions
  const yesRect = yesBtn.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  // Calculate center points
  const yesCenterX = yesRect.left + yesRect.width / 2;
  const yesCenterY = yesRect.top + yesRect.height / 2;
  const noCenterX = noRect.left + noRect.width / 2;
  const noCenterY = noRect.top + noRect.height / 2;

  // Calculate distances
  const yesDistance = Math.sqrt(
    Math.pow(e.clientX - yesCenterX, 2) +
      Math.pow(e.clientY - yesCenterY, 2),
  );
  const noDistance = Math.sqrt(
    Math.pow(e.clientX - noCenterX, 2) +
      Math.pow(e.clientY - noCenterY, 2),
  );

  // Yes button enlarges when cursor is close
  const yesThreshold = 150;
  if (yesDistance < yesThreshold) {
    const scale = 1 + ((yesThreshold - yesDistance) / yesThreshold) * 0.5;
    yesBtn.style.transform = `scale(${Math.min(scale, 1.5)})`;
  } else {
    yesBtn.style.transform = "scale(1)";
  }

  // No button runs away when cursor is close (reduced threshold for easier testing)
  const noThreshold = 50;
  if (noDistance < noThreshold && canMove) {
    canMove = false;
    moveTimeout = setTimeout(() => {
      moveNoButton();
      canMove = true;
    }, 1000);
  }
});

function moveNoButton() {
  const containerRect = buttonContainer.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;

  // Generate random position within viewport
  let newLeft = Math.random() * (viewportWidth - btnWidth - 40) + 20;
  let newTop = Math.random() * (viewportHeight - btnHeight - 40) + 20;

  // Ensure it's not too close to yes button
  const yesRect = yesBtn.getBoundingClientRect();
  const yesCenterX = yesRect.left + yesRect.width / 2;
  const yesCenterY = yesRect.top + yesRect.height / 2;

  const distance = Math.sqrt(
    Math.pow(newLeft + btnWidth / 2 - yesCenterX, 2) +
      Math.pow(newTop + btnHeight / 2 - yesCenterY, 2),
  );

  // If too close to yes button, move to a far position
  if (distance < 180) {
    if (newLeft < yesCenterX) {
      newLeft = Math.max(20, yesCenterX - 300);
    } else {
      newLeft = Math.min(viewportWidth - btnWidth - 20, yesCenterX + 200);
    }
  }

  // Use fixed positioning
  noBtn.style.position = "fixed";
  noBtn.style.left = `${newLeft}px`;
  noBtn.style.top = `${newTop}px`;
  noBtn.style.right = "auto";
  noBtn.style.transform = "none";
}

// Music toggle handler
musicToggle.addEventListener("click", () => {
  if (isMusicPlaying) {
    bgMusic.pause();
    musicToggle.textContent = "🎵";
    musicToggle.classList.remove("playing");
    isMusicPlaying = false;
  } else {
    bgMusic
      .play()
      .then(() => {
        musicToggle.textContent = "🎶";
        musicToggle.classList.add("playing");
        isMusicPlaying = true;
      })
      .catch((error) => {
        console.log("Music play failed:", error);
        alert("Please allow audio to play for the full experience! 🎵");
      });
  }
});

// Yes button click handler
yesBtn.addEventListener("click", () => {
  // Start music if not playing
  if (!isMusicPlaying) {
    bgMusic
      .play()
      .then(() => {
        musicToggle.textContent = "🎶";
        musicToggle.classList.add("playing");
        isMusicPlaying = true;
      })
      .catch((error) => {
        console.log("Music play failed:", error);
      });
  }

  // Hide question
  questionContainer.classList.add("hidden");

  // Show celebration
  celebration.classList.remove("hidden");

  // Create floating hearts
  createHearts();

  // Create confetti
  createConfetti();

  // Create particle burst
  createParticleBurst();

  // Create sparkles
  createSparkles();

  // Start continuous animations
  if (!continuousAnimationsRunning) {
    startContinuousAnimations();
  }
});

function createHearts() {
  const colors = ["❤️", "💕", "💖", "💗", "💓", "💝"];

  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.textContent =
        colors[Math.floor(Math.random() * colors.length)];
      heart.style.left = Math.random() * window.innerWidth + "px";
      heart.style.bottom = "-50px";
      heart.style.animationDelay = Math.random() * 0.5 + "s";
      heart.style.fontSize = Math.random() * 2 + 1 + "rem";
      document.body.appendChild(heart);

      // Remove after animation
      setTimeout(() => heart.remove(), 3000);
    }, i * 100);
  }
}

function createConfetti() {
  const colors = [
    "#f093fb",
    "#f5576c",
    "#4facfe",
    "#00f2fe",
    "#ffd89b",
    "#19d4ca",
  ];

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * window.innerWidth + "px";
      confetti.style.top = "-10px";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.3 + "s";
      document.body.appendChild(confetti);

      // Remove after animation
      setTimeout(() => confetti.remove(), 3000);
    }, i * 50);
  }
}

// Show response bubble near No button
function showResponseBubble() {
  // Create new bubble
  const bubble = document.createElement("div");
  bubble.className = "response-bubble";
  bubble.textContent = responses[noClickCount % responses.length];

  // Position bubble above the No button
  const noRect = noBtn.getBoundingClientRect();
  bubble.style.left = noRect.left + noRect.width / 2 + "px";
  bubble.style.top = noRect.top - 150 + "px";
  bubble.style.transform = "translateX(-50%) scale(0.3) translateY(20px)";

  document.body.appendChild(bubble);

  // Trigger animation
  setTimeout(() => {
    bubble.classList.add("show");
  }, 10);

  // Each bubble has its own independent timer
  setTimeout(() => {
    bubble.classList.remove("show");
    bubble.classList.add("hide");
    setTimeout(() => {
      if (bubble.parentNode) {
        bubble.remove();
      }
    }, 600);
  }, 2500);

  noClickCount++;
}

// Prevent No button from being clicked (just for fun)
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  showResponseBubble();
  moveNoButton();
});

function createParticleBurst() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const colors = [
    "#ff6b9d",
    "#feca57",
    "#48dbfb",
    "#ff9ff3",
    "#54a0ff",
    "#ee5a6f",
  ];

  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const particle = document.createElement("div");
      particle.className = "particle";

      const size = Math.random() * 15 + 5;
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = centerX + "px";
      particle.style.top = centerY + "px";

      const angle = (Math.PI * 2 * i) / 40;
      const velocity = Math.random() * 200 + 100;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      particle.style.setProperty("--tx", tx + "px");
      particle.style.setProperty("--ty", ty + "px");

      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 4000);
    }, i * 20);
  }
}

function createSparkles() {
  const sparkleChars = ["✨", "⭐", "🌟", "💫", "⚡"];

  for (let i = 0; i < 25; i++) {
    setTimeout(() => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.textContent =
        sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
      sparkle.style.left = Math.random() * window.innerWidth + "px";
      sparkle.style.top =
        window.innerHeight * 0.3 +
        Math.random() * window.innerHeight * 0.4 +
        "px";
      sparkle.style.fontSize = Math.random() * 1.5 + 0.5 + "rem";

      document.body.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 2000);
    }, i * 80);
  }
}

function startContinuousAnimations() {
  continuousAnimationsRunning = true;

  // Continuous floating hearts - every 1 second
  const heartInterval = setInterval(() => {
    if (!continuousAnimationsRunning) {
      clearInterval(heartInterval);
      return;
    }
    createContinuousHeart();
  }, 1000);
  animationIntervals.push(heartInterval);

  // Falling petals - every 1.5 seconds
  const petalInterval = setInterval(() => {
    if (!continuousAnimationsRunning) {
      clearInterval(petalInterval);
      return;
    }
    createPetal();
  }, 1500);
  animationIntervals.push(petalInterval);

  // Twinkling stars - every 2 seconds
  const starInterval = setInterval(() => {
    if (!continuousAnimationsRunning) {
      clearInterval(starInterval);
      return;
    }
    createTwinkleStar();
  }, 2000);
  animationIntervals.push(starInterval);
}

function createContinuousHeart() {
  const hearts = ["💕", "💖", "💗", "💓", "💝", "❤️", "💞"];
  const heart = document.createElement("div");
  heart.className = "continuous-heart";
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

  // Start from random position at bottom
  const startX = Math.random() * window.innerWidth;
  heart.style.left = startX + "px";
  heart.style.bottom = "-50px";

  // Random drift amount
  const drift = (Math.random() - 0.5) * 200;
  heart.style.setProperty("--drift", drift + "px");

  // Random size
  heart.style.fontSize = Math.random() * 1.5 + 1 + "rem";

  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 8000);
}

function createPetal() {
  const petals = ["🌸", "🌺", "🌹", "💮"];
  const petal = document.createElement("div");
  petal.className = "petal";
  petal.textContent = petals[Math.floor(Math.random() * petals.length)];

  // Start from random position at top
  const startX = Math.random() * window.innerWidth;
  petal.style.left = startX + "px";
  petal.style.top = "-50px";

  // Random sway amount
  const sway = (Math.random() - 0.5) * 300;
  petal.style.setProperty("--sway", sway + "px");

  // Random size
  petal.style.fontSize = Math.random() * 1 + 0.8 + "rem";

  document.body.appendChild(petal);

  setTimeout(() => petal.remove(), 10000);
}

function createTwinkleStar() {
  const stars = ["✨", "⭐", "🌟", "💫"];
  const star = document.createElement("div");
  star.className = "twinkle-star";
  star.textContent = stars[Math.floor(Math.random() * stars.length)];

  // Random position anywhere on screen
  star.style.left = Math.random() * window.innerWidth + "px";
  star.style.top = Math.random() * window.innerHeight + "px";

  // Random size
  star.style.fontSize = Math.random() * 1.5 + 0.5 + "rem";

  document.body.appendChild(star);

  setTimeout(() => star.remove(), 2000);
}

// Reuse AudioContext for better performance
let sharedAudioContext = null;
let isExplosionActive = false;
let lastExplosionTime = 0;
const EXPLOSION_COOLDOWN = 800; // milliseconds between explosions

// Rapid click tracking
let rapidClickCount = 0;
let rapidClickTimer = null;
let clickCounterElement = null;
let clickTimerElement = null;
let isMegaComboActive = false; // Block tracking during mega combo
const RAPID_CLICK_THRESHOLD = 10; // clicks needed
const RAPID_CLICK_TIME = 3000; // 3 seconds

function getAudioContext() {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
  }
  return sharedAudioContext;
}

// Function to play firework sound
function playFireworkSound() {
  const audioContext = getAudioContext();

  // Launch sound
  const launchOscillator = audioContext.createOscillator();
  const launchGain = audioContext.createGain();
  launchOscillator.connect(launchGain);
  launchGain.connect(audioContext.destination);
  launchOscillator.frequency.setValueAtTime(200, audioContext.currentTime);
  launchOscillator.frequency.exponentialRampToValueAtTime(
    600,
    audioContext.currentTime + 0.3,
  );
  launchGain.gain.setValueAtTime(0.3, audioContext.currentTime);
  launchGain.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.3,
  );
  launchOscillator.start(audioContext.currentTime);
  launchOscillator.stop(audioContext.currentTime + 0.3);

  // Explosion sound
  setTimeout(() => {
    // Create white noise for explosion
    const bufferSize = audioContext.sampleRate * 0.5;
    const buffer = audioContext.createBuffer(
      1,
      bufferSize,
      audioContext.sampleRate,
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 1000;

    const noiseGain = audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.4, audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5,
    );

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);

    noise.start(audioContext.currentTime);
    noise.stop(audioContext.currentTime + 0.5);

    // Add sparkle sounds
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const sparkleOsc = audioContext.createOscillator();
        const sparkleGain = audioContext.createGain();
        sparkleOsc.connect(sparkleGain);
        sparkleGain.connect(audioContext.destination);
        sparkleOsc.frequency.setValueAtTime(
          1500 + Math.random() * 1000,
          audioContext.currentTime,
        );
        sparkleGain.gain.setValueAtTime(0.15, audioContext.currentTime);
        sparkleGain.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.2,
        );
        sparkleOsc.start(audioContext.currentTime);
        sparkleOsc.stop(audioContext.currentTime + 0.2);
      }, i * 50);
    }
  }, 250);
}

// Interactive heart explosion on celebration page
function createHeartExplosion(x, y) {
  // Throttle explosions to prevent performance issues
  const now = Date.now();
  if (isExplosionActive || now - lastExplosionTime < EXPLOSION_COOLDOWN) {
    return;
  }

  isExplosionActive = true;
  lastExplosionTime = now;

  // Reset flag after animation completes
  setTimeout(() => {
    isExplosionActive = false;
  }, EXPLOSION_COOLDOWN);

  // Play firework sound
  playFireworkSound();

  const emojis = [
    "😻",
    "😺",
    "🐱",
    "💕",
    "💖",
    "💗",
    "💓",
    "💝",
    "❤️",
    "💞",
    "💘",
    "🌸",
    "🌺",
    "🌹",
    "🌷",
    "💮",
    "🌼",
    "✨",
    "⭐",
    "🌟",
    "💫",
  ];

  // Create main explosion burst (50 emojis in a circle) - optimized!
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const emoji = document.createElement("div");
      emoji.className = "explosion-emoji";
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const size = Math.random() * 2.5 + 1.5;
      emoji.style.fontSize = size + "rem";
      emoji.style.left = x + "px";
      emoji.style.top = y + "px";

      // Calculate direction (full circle)
      const angle = (Math.PI * 2 * i) / 50 + (Math.random() - 0.5) * 0.3;
      const velocity = Math.random() * 300 + 250;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      emoji.style.setProperty("--tx", tx + "px");
      emoji.style.setProperty("--ty", ty + "px");

      document.body.appendChild(emoji);

      setTimeout(() => emoji.remove(), 2500);
    }, i * 10);
  }

  // Add sparkle burst - optimized!
  for (let i = 0; i < 25; i++) {
    setTimeout(() => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.textContent = ["✨", "⭐", "🌟", "💫"][
        Math.floor(Math.random() * 4)
      ];
      sparkle.style.left = x + (Math.random() - 0.5) * 200 + "px";
      sparkle.style.top = y + (Math.random() - 0.5) * 200 + "px";
      sparkle.style.fontSize = Math.random() * 2 + 1 + "rem";

      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 2000);
    }, i * 25);
  }

  // Add secondary explosions for bigger firework effect
  setTimeout(() => {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const emoji = document.createElement("div");
        emoji.className = "explosion-emoji";
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        emoji.style.fontSize = Math.random() * 2 + 1 + "rem";
        emoji.style.left = x + (Math.random() - 0.5) * 250 + "px";
        emoji.style.top = y + (Math.random() - 0.5) * 250 + "px";

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 250 + 120;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        emoji.style.setProperty("--tx", tx + "px");
        emoji.style.setProperty("--ty", ty + "px");

        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 2000);
      }, i * 18);
    }
  }, 250);

  // Add third wave for extra firework effect
  setTimeout(() => {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const emoji = document.createElement("div");
        emoji.className = "explosion-emoji";
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        emoji.style.fontSize = Math.random() * 1.8 + 1.2 + "rem";
        emoji.style.left = x + (Math.random() - 0.5) * 300 + "px";
        emoji.style.top = y + (Math.random() - 0.5) * 300 + "px";

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 200 + 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        emoji.style.setProperty("--tx", tx + "px");
        emoji.style.setProperty("--ty", ty + "px");

        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 2000);
      }, i * 20);
    }
  }, 500);
}

// Function to create/update click counter display
function updateClickCounter() {
  if (!clickCounterElement) {
    clickCounterElement = document.createElement("div");
    clickCounterElement.className = "rapid-click-counter";
    document.body.appendChild(clickCounterElement);
  }
  clickCounterElement.textContent = `${rapidClickCount}/${RAPID_CLICK_THRESHOLD}`;
  clickCounterElement.classList.add("show");
}

// Function to create/update timer display
function updateClickTimer(secondsLeft) {
  if (!clickTimerElement) {
    clickTimerElement = document.createElement("div");
    clickTimerElement.className = "rapid-click-timer";
    document.body.appendChild(clickTimerElement);
  }
  clickTimerElement.textContent = `${secondsLeft.toFixed(1)}s`;
  clickTimerElement.classList.add("show");
}

// Function to hide rapid click UI
function hideRapidClickUI() {
  if (clickCounterElement) {
    clickCounterElement.classList.remove("show");
  }
  if (clickTimerElement) {
    clickTimerElement.classList.remove("show");
  }
}

// Function to reset rapid click tracking
function resetRapidClicks() {
  rapidClickCount = 0;
  if (rapidClickTimer) {
    clearInterval(rapidClickTimer);
    rapidClickTimer = null;
  }
  hideRapidClickUI();
}

// Optimized mega explosion with fewer elements
function createMegaExplosion(x, y) {
  // Block new combo tracking during animation
  isMegaComboActive = true;

  const emojis = [
    "😻",
    "😺",
    "🐱",
    "💕",
    "💖",
    "💗",
    "💓",
    "💝",
    "❤️",
    "💞",
    "💘",
    "🌸",
    "🌺",
    "🌹",
    "🌷",
    "💮",
    "🌼",
    "✨",
    "⭐",
    "🌟",
    "💫",
  ];

  // Play enhanced sound
  playFireworkSound();
  setTimeout(() => playFireworkSound(), 150);
  setTimeout(() => playFireworkSound(), 300);

  // Create large central burst (60 emojis total - manageable)
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const emoji = document.createElement("div");
      emoji.className = "mega-explosion-emoji";
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const size = Math.random() * 3 + 2; // Larger emojis
      emoji.style.fontSize = size + "rem";
      emoji.style.left = x + "px";
      emoji.style.top = y + "px";

      const angle = (Math.PI * 2 * i) / 60 + (Math.random() - 0.5) * 0.4;
      const velocity = Math.random() * 500 + 350; // Faster
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      emoji.style.setProperty("--tx", tx + "px");
      emoji.style.setProperty("--ty", ty + "px");

      document.body.appendChild(emoji);
      setTimeout(() => emoji.remove(), 3000);
    }, i * 8);
  }

  // Add mega text announcement
  const megaText = document.createElement("div");
  megaText.className = "mega-text";
  megaText.textContent = "MY LOVE FOR YOU IS HUGE! 💕";
  megaText.style.left = x + "px";
  megaText.style.top = y - 100 + "px";
  document.body.appendChild(megaText);
  setTimeout(() => megaText.remove(), 2500);

  // Unblock combo tracking after animation completes (2.5s)
  setTimeout(() => {
    isMegaComboActive = false;
  }, 2500);
}

// Add click handler to celebration heart
document.addEventListener("DOMContentLoaded", () => {
  // Find both heart images in celebration section
  const celebrationHearts = document.querySelectorAll(
    "#celebration .heart-image",
  );

  celebrationHearts.forEach((heart) => {
    heart.style.cursor = "pointer";
    heart.addEventListener("click", (e) => {
      // Add bounce and glow animation
      heart.classList.add("heart-clicked");

      // Remove class after animation completes
      setTimeout(() => {
        heart.classList.remove("heart-clicked");
      }, 600);

      const rect = heart.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Block all clicks during mega combo animation
      if (isMegaComboActive) {
        return; // Ignore all clicks during mega combo
      }

      // Track rapid clicks
      rapidClickCount++;
      updateClickCounter();

      // Start timer on first click
      if (rapidClickCount === 1) {
        let timeLeft = RAPID_CLICK_TIME;
        const startTime = Date.now();

        rapidClickTimer = setInterval(() => {
          const elapsed = Date.now() - startTime;
          timeLeft = RAPID_CLICK_TIME - elapsed;

          if (timeLeft <= 0) {
            resetRapidClicks();
          } else {
            updateClickTimer(timeLeft / 1000);
          }
        }, 50); // Update every 50ms for smooth countdown
      }

      // Check if threshold reached
      if (rapidClickCount >= RAPID_CLICK_THRESHOLD) {
        // MEGA EXPLOSION!
        createMegaExplosion(x, y);
        resetRapidClicks();
        return; // Don't create normal explosion
      }

      // Normal explosion
      createHeartExplosion(x, y);
    });
  });
});

// Stop continuous animations when music is paused
bgMusic.addEventListener("pause", () => {
  continuousAnimationsRunning = false;
  animationIntervals.forEach((interval) => clearInterval(interval));
  animationIntervals = [];
});

// Resume continuous animations when music plays (if celebration is shown)
bgMusic.addEventListener("play", () => {
  if (
    !celebration.classList.contains("hidden") &&
    !continuousAnimationsRunning
  ) {
    startContinuousAnimations();
  }
});
