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
