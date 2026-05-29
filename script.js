const CONFIG = {
  celebrant: {
    name: "Nour",
    title: "Dancing Queen",
    quote: "Young and Sweet, Only 17",
    message: "You're invited to celebrate with Nour ✨",
  },
  event: {
    venue: "LOKALI",
    dateLabel: "Saturday, May 30, 2026",
    dateISO: "2026-05-30T18:00:00+03:00",
    timeLabel: "6:00 PM",
    mapLink: "https://maps.app.goo.gl/MAsUccxskrp1zAhv6?g_st=atm",
    mapEmbed:
      "https://www.google.com/maps?q=LOKALI&output=embed",
  },
  music: {
    title: "Dancing Queen",
    artist: "ABBA",
    link: "https://www.youtube.com/watch?v=xFrGuyw1V8s",
    youtubeVideoId: "xFrGuyw1V8s",
    startVolume: 35,
  },
  colors: {
    navy: "#081b2e",
    teal: "#3aa7b3",
    tealLight: "#6fd5df",
    silver: "#d8dde4",
    silverGlow: "#f2f5f8",
    white: "#ffffff",
  },
  animations: {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    introScreenDuration: 1700,
    secretScreenDuration: 1150,
  },
  countdown: {
    enabled: true,
    targetISO: "2026-05-30T18:00:00+03:00",
  },
  sections: {
    hero: { show: true },
    countdown: { show: true },
    photo: { show: true },
    dressCode: { show: true },
    details: { show: true },
    location: { show: true },
    wishes: { show: true },
    surprise: { show: true },
    cake: { show: true },
  },
  photo: {
    show: true,
    src: "./birthday-girl-teal.png",
    alt: "Elegant teal birthday portrait",
  },
  wishes: {
    show: true,
    storageKey: "nour-birthday-wishes",
    defaultEntries: [
      {
        emoji: "💙",
        name: "Sarah",
        message: "I can't wait to celebrate with you. Wishing you the loveliest birthday.",
      },
      {
        emoji: "✨",
        name: "Mariam",
        message: "So excited for your special night. Stay the amazing Dancing Queen you are.",
      },
    ],
  },
};

const state = {
  candleOut: false,
  playerReady: false,
  musicPlaying: false,
  introStarted: false,
  revealObserver: null,
  previewMode: new URLSearchParams(window.location.search).get("preview"),
};

const elements = {
  body: document.body,
  gate: document.getElementById("experience-gate"),
  gestureLayer: document.getElementById("gesture-layer"),
  instruction: document.getElementById("stage-instruction"),
  gateEnter: document.getElementById("gate-enter"),
  stageBrand: document.getElementById("stage-brand"),
  flameHitbox: document.getElementById("flame-hitbox"),
  flameWrap: document.getElementById("flame-wrap"),
  smokeOne: document.querySelector(".smoke-one"),
  smokeTwo: document.querySelector(".smoke-two"),
  glitterLayer: document.getElementById("glitter-layer"),
  intro: document.getElementById("cinematic-intro"),
  introSlides: [...document.querySelectorAll(".intro-slide")],
  siteShell: document.getElementById("site-shell"),
  musicToggle: document.getElementById("music-toggle"),
  musicPlayer: document.getElementById("music-player"),
  musicClose: document.getElementById("music-close"),
  playPause: document.getElementById("play-pause"),
  volumeRange: document.getElementById("volume-range"),
  musicLink: document.getElementById("music-link"),
  heroSparkles: document.getElementById("hero-sparkles"),
  heroEyebrow: document.getElementById("hero-eyebrow"),
  heroTitle: document.getElementById("hero-title"),
  heroQuote: document.getElementById("hero-quote"),
  heroWish: document.getElementById("hero-wish"),
  countdown: {
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  },
  detailsGrid: document.getElementById("details-grid"),
  portraitImage: document.getElementById("portrait-image"),
  mapFrame: document.getElementById("map-frame"),
  openMaps: document.getElementById("open-maps"),
  navigateLink: document.getElementById("navigate-link"),
  wishForm: document.getElementById("wish-form"),
  wishName: document.getElementById("wish-name"),
  wishMessage: document.getElementById("wish-message"),
  wishError: document.getElementById("wish-error"),
  wishesFeed: document.getElementById("wishes-feed"),
  secretButton: document.getElementById("secret-button"),
  secretOverlay: document.getElementById("secret-overlay"),
  secretLines: [...document.querySelectorAll(".secret-line")],
  secretClose: document.getElementById("secret-close"),
  cakeStage: document.getElementById("cake-stage"),
  footerCopy: document.getElementById("footer-copy"),
};

let player;
let wishEntries = [];
let pointerActive = false;

applyConfig();
boot();

function boot() {
  elements.body.classList.add("no-scroll");
  setupCandleInteraction();
  setupMusicUi();
  populateDetails();
  setupMap();
  setupCountdown();
  setupSections();
  setupWishes();
  setupSecret();
  setupCakeCelebration();
  setupRevealObserver();
  buildHeroSparkles();
  applyPreviewMode();
}

function applyConfig() {
  document.title = `${CONFIG.celebrant.name}'s 17th Birthday Invitation`;
  elements.stageBrand.textContent = `${CONFIG.celebrant.name}'s Private Invitation`;
  elements.heroEyebrow.textContent = `You're Invited to ${CONFIG.celebrant.name}'s 17th Birthday`;
  elements.heroTitle.textContent = CONFIG.celebrant.title;
  elements.heroQuote.textContent = CONFIG.celebrant.quote;
  elements.heroWish.textContent = CONFIG.celebrant.message;
  elements.footerCopy.textContent = `${CONFIG.celebrant.title} • ${CONFIG.celebrant.name} • 17`;
  elements.musicLink.href = CONFIG.music.link;
  elements.volumeRange.value = String(CONFIG.music.startVolume);
  elements.portraitImage.src = CONFIG.photo.src;
  elements.portraitImage.alt = CONFIG.photo.alt;
  elements.instruction.textContent = window.matchMedia("(pointer: coarse)").matches
    ? "Swipe across the candle to open Nour's invitation"
    : "Drag through the flame to open Nour's invitation";
}

function setupSections() {
  const sectionMap = {
    hero: document.getElementById("hero"),
    countdown: document.getElementById("countdown-section"),
    photo: document.getElementById("photo-section"),
    dressCode: document.getElementById("dress-code-section"),
    details: document.getElementById("details"),
    location: document.getElementById("location-section"),
    wishes: document.getElementById("wishes-section"),
    surprise: document.getElementById("surprise-section"),
    cake: document.getElementById("cake-section"),
  };

  Object.entries(sectionMap).forEach(([key, node]) => {
    if (!node) return;
    const shouldShow = CONFIG.sections[key]?.show ?? true;
    node.classList.toggle("hidden", !shouldShow);
  });

  document.getElementById("photo-section").classList.toggle("hidden", !CONFIG.photo.show);
  document.getElementById("wishes-section").classList.toggle("hidden", !CONFIG.wishes.show);
}

function populateDetails() {
  const cards = [
    {
      icon: "✦",
      label: "Venue",
      title: CONFIG.event.venue,
      copy: "A refined setting chosen for a beautiful evening together.",
    },
    {
      icon: "◷",
      label: "Date",
      title: CONFIG.event.dateLabel,
      copy: "Saturday evening at 6:00 PM",
    },
    {
      icon: "☾",
      label: "Time",
      title: CONFIG.event.timeLabel,
      copy: "Arrive for the cinematic reveal at golden hour.",
    },
  ];

  elements.detailsGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="detail-card" data-reveal>
          <span class="detail-icon">${card.icon}</span>
          <p class="detail-label">${card.label}</p>
          <h3>${card.title}</h3>
          <p>${card.copy}</p>
        </article>
      `,
    )
    .join("");

  document
    .querySelectorAll(".glass-card, .countdown-card, .portrait-frame, .detail-card, .section-heading, .cake-stage")
    .forEach((node) => node.setAttribute("data-reveal", ""));
}

function setupMap() {
  elements.mapFrame.src = CONFIG.event.mapEmbed;
  elements.openMaps.href = CONFIG.event.mapLink;
  elements.navigateLink.href = CONFIG.event.mapLink;
}

function setupCountdown() {
  if (!CONFIG.countdown.enabled) {
    document.getElementById("countdown-section").classList.add("hidden");
    return;
  }

  const target = new Date(CONFIG.countdown.targetISO).getTime();

  const update = () => {
    const diff = Math.max(0, target - Date.now());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    elements.countdown.hours.textContent = pad(hours);
    elements.countdown.minutes.textContent = pad(minutes);
    elements.countdown.seconds.textContent = pad(seconds);
  };

  update();
  window.setInterval(update, 1000);
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function setupCandleInteraction() {
  elements.gateEnter.addEventListener("click", extinguishCandle);

  const pointerMove = (event) => {
    if (!pointerActive || state.candleOut) return;
    const point = getPoint(event);
    leaveTrail(point.x, point.y);
    const hitbox = elements.flameHitbox.getBoundingClientRect();
    const inside =
      point.x >= hitbox.left &&
      point.x <= hitbox.right &&
      point.y >= hitbox.top &&
      point.y <= hitbox.bottom;

    if (inside) {
      extinguishCandle();
    }
  };

  const start = (event) => {
    pointerActive = true;
    const point = getPoint(event);
    leaveTrail(point.x, point.y);
  };

  const end = () => {
    pointerActive = false;
  };

  window.addEventListener("pointerdown", start, { passive: true });
  window.addEventListener("pointermove", pointerMove, { passive: true });
  window.addEventListener("pointerup", end, { passive: true });
  window.addEventListener("pointercancel", end, { passive: true });
}

function applyPreviewMode() {
  if (state.previewMode !== "invite") return;
  state.candleOut = true;
  state.introStarted = true;
  elements.gate.classList.add("hidden");
  elements.intro.classList.add("hidden");
  elements.siteShell.classList.remove("hidden");
  elements.musicToggle.classList.remove("hidden");
  elements.musicPlayer.classList.add("hidden");
  elements.body.classList.remove("no-scroll");
}

function getPoint(event) {
  if (event.touches?.[0]) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

function leaveTrail(x, y) {
  const trail = document.createElement("span");
  trail.className = "gesture-trail";
  trail.style.left = `${x - 9}px`;
  trail.style.top = `${y - 9}px`;
  elements.gestureLayer.appendChild(trail);
  window.setTimeout(() => trail.remove(), 650);
}

function extinguishCandle() {
  if (state.candleOut) return;
  state.candleOut = true;
  elements.instruction.textContent = "Nour's invitation is opening...";
  elements.flameWrap.classList.add("out");
  elements.smokeOne.classList.add("visible");
  elements.smokeTwo.classList.add("visible");
  burstGlitter(window.innerWidth / 2, window.innerHeight * 0.32, 30);
  if (navigator.vibrate) navigator.vibrate(80);
  startMusic();
  beginIntro();
}

function beginIntro() {
  if (state.introStarted) return;
  state.introStarted = true;
  elements.gate.classList.add("is-finished");
  elements.intro.classList.remove("hidden");
  elements.intro.setAttribute("aria-hidden", "false");

  let activeIndex = 0;
  const step = () => {
    elements.introSlides.forEach((slide, index) => {
      slide.classList.toggle("active", index === activeIndex);
    });
    activeIndex += 1;
    if (activeIndex < elements.introSlides.length) {
      window.setTimeout(step, CONFIG.animations.introScreenDuration);
      return;
    }

    window.setTimeout(() => {
      elements.intro.classList.add("hidden");
      elements.siteShell.classList.remove("hidden");
      elements.musicToggle.classList.remove("hidden");
      elements.musicPlayer.classList.add("hidden");
      elements.body.classList.remove("no-scroll");
      document.getElementById("hero").scrollIntoView({ behavior: "smooth", block: "start" });
    }, CONFIG.animations.introScreenDuration);
  };

  step();
}

function setupMusicUi() {
  elements.musicToggle.addEventListener("click", () => {
    elements.musicPlayer.classList.toggle("hidden");
  });

  elements.musicClose.addEventListener("click", () => {
    elements.musicPlayer.classList.add("hidden");
  });

  elements.playPause.addEventListener("click", toggleMusicPlayback);
  elements.volumeRange.addEventListener("input", () => {
    if (player?.setVolume) {
      player.setVolume(Number(elements.volumeRange.value));
    }
  });
}

function startMusic() {
  if (!window.YT || !window.YT.Player) {
    window.setTimeout(startMusic, 500);
    return;
  }

  if (!player) {
    player = new window.YT.Player("youtube-shell", {
      height: "0",
      width: "0",
      videoId: CONFIG.music.youtubeVideoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
      },
      events: {
        onReady: (event) => {
          state.playerReady = true;
          event.target.setVolume(CONFIG.music.startVolume);
          event.target.playVideo();
          state.musicPlaying = true;
          updateMusicButton();
        },
        onStateChange: (event) => {
          state.musicPlaying = event.data === window.YT.PlayerState.PLAYING;
          updateMusicButton();
        },
      },
    });
    return;
  }

  if (state.playerReady) {
    player.playVideo();
    state.musicPlaying = true;
    updateMusicButton();
  }
}

function toggleMusicPlayback() {
  if (!player || !state.playerReady) return;
  if (state.musicPlaying) {
    player.pauseVideo();
    state.musicPlaying = false;
  } else {
    player.playVideo();
    state.musicPlaying = true;
  }
  updateMusicButton();
}

function updateMusicButton() {
  elements.playPause.textContent = state.musicPlaying ? "Pause" : "Play";
}

function setupWishes() {
  if (!CONFIG.wishes.show) return;

  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG.wishes.storageKey) || "[]");
    wishEntries = Array.isArray(saved) && saved.length ? saved : CONFIG.wishes.defaultEntries;
  } catch {
    wishEntries = CONFIG.wishes.defaultEntries;
  }

  renderWishes();

  elements.wishForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = elements.wishName.value.trim();
    const message = elements.wishMessage.value.trim();

    if (name.length < 2) {
      setWishError("Please enter a name with at least 2 characters.");
      return;
    }

    if (message.length < 8) {
      setWishError("Please write a slightly longer birthday wish.");
      return;
    }

    const entry = {
      emoji: pickWishEmoji(message),
      name,
      message,
    };

    wishEntries = [entry, ...wishEntries];
    persistWishes();
    renderWishes();
    elements.wishForm.reset();
    setWishError("");
    burstGlitter(window.innerWidth * 0.5, window.innerHeight * 0.72, 18);
  });
}

function renderWishes() {
  elements.wishesFeed.innerHTML = wishEntries
    .map(
      (entry) => `
        <article class="wish-card">
          <strong>${entry.emoji} ${escapeHtml(entry.name)}</strong>
          <p>"${escapeHtml(entry.message)}"</p>
        </article>
      `,
    )
    .join("");
}

function persistWishes() {
  localStorage.setItem(CONFIG.wishes.storageKey, JSON.stringify(wishEntries));
}

function setWishError(message) {
  elements.wishError.textContent = message;
}

function pickWishEmoji(message) {
  const lower = message.toLowerCase();
  if (lower.includes("love")) return "💫";
  if (lower.includes("queen")) return "👑";
  if (lower.includes("amazing")) return "✨";
  return "💙";
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char];
  });
}

function setupSecret() {
  elements.secretButton.addEventListener("click", openSecretOverlay);
  elements.secretClose.addEventListener("click", closeSecretOverlay);
  elements.secretOverlay.addEventListener("click", (event) => {
    if (event.target === elements.secretOverlay || event.target.classList.contains("secret-backdrop")) {
      closeSecretOverlay();
    }
  });
}

function openSecretOverlay() {
  elements.secretOverlay.classList.remove("hidden");
  elements.secretOverlay.setAttribute("aria-hidden", "false");
  elements.body.classList.add("no-scroll");
  burstGlitter(window.innerWidth * 0.5, window.innerHeight * 0.5, 24);

  let index = 0;
  const cycle = () => {
    elements.secretLines.forEach((line, lineIndex) => {
      line.classList.toggle("active", lineIndex === index);
    });
    burstGlitter(window.innerWidth * 0.5, window.innerHeight * 0.48, 12);
    index += 1;
    if (index < elements.secretLines.length) {
      window.setTimeout(cycle, CONFIG.animations.secretScreenDuration);
    }
  };

  cycle();
}

function closeSecretOverlay() {
  elements.secretOverlay.classList.add("hidden");
  elements.secretOverlay.setAttribute("aria-hidden", "true");
  elements.secretLines.forEach((line, index) => line.classList.toggle("active", index === 0));
  elements.body.classList.remove("no-scroll");
}

function setupCakeCelebration() {
  const trigger = () => {
    burstGlitter(window.innerWidth * 0.5, elements.cakeStage.getBoundingClientRect().top + 80, 30);
    spawnCakeIcons();
  };

  elements.cakeStage.addEventListener("click", trigger);
  elements.cakeStage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      trigger();
    }
  });
}

function spawnCakeIcons() {
  const icons = ["💙", "✨", "⭐", "🤍", "🎉"];
  for (let index = 0; index < 18; index += 1) {
    const icon = document.createElement("span");
    icon.className = "floaty";
    icon.textContent = icons[index % icons.length];
    icon.style.left = `${42 + Math.random() * 16}%`;
    icon.style.top = `${38 + Math.random() * 8}%`;
    icon.style.setProperty("--tx", `${-160 + Math.random() * 320}px`);
    icon.style.setProperty("--ty", `${-180 - Math.random() * 120}px`);
    icon.style.setProperty("--rot", `${-45 + Math.random() * 90}deg`);
    elements.cakeStage.querySelector(".cake-sparkles").appendChild(icon);
    window.setTimeout(() => icon.remove(), 2000);
  }
}

function burstGlitter(originX, originY, amount) {
  for (let index = 0; index < amount; index += 1) {
    const glitter = document.createElement("span");
    glitter.className = "glitter";
    glitter.style.left = `${originX}px`;
    glitter.style.top = `${originY}px`;
    glitter.style.setProperty("--x", `${-120 + Math.random() * 240}px`);
    glitter.style.setProperty("--y", `${-90 + Math.random() * 180}px`);
    glitter.style.animationDelay = `${Math.random() * 0.1}s`;
    elements.glitterLayer.appendChild(glitter);
    window.setTimeout(() => glitter.remove(), 1900);
  }
}

function buildHeroSparkles() {
  for (let index = 0; index < 24; index += 1) {
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.left = `${Math.random() * 100}%`;
    spark.style.top = `${10 + Math.random() * 80}%`;
    spark.style.width = `${2 + Math.random() * 5}px`;
    spark.style.height = spark.style.width;
    spark.style.animationDuration = `${5 + Math.random() * 6}s`;
    spark.style.animationDelay = `${Math.random() * 4}s`;
    elements.heroSparkles.appendChild(spark);
  }
}

function setupRevealObserver() {
  if (CONFIG.animations.reducedMotion) {
    document.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("visible"));
    return;
  }

  state.revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          state.revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );

  document.querySelectorAll("[data-reveal]").forEach((node) => {
    state.revealObserver.observe(node);
  });
}

window.onYouTubeIframeAPIReady = () => {
  if (state.candleOut) {
    startMusic();
  }
};
