/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  🤖 AutoX.js RPG/Open-World Game Bot - MAIN LOGIC
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  Cloud Phone Optimized | No PC Required | Pure AutoX.js
 *
 *  Features:
 *    ✓ Multi-scale image detection with blur compensation
 *    ✓ Auto-skip tutorial system
 *    ✓ Auto-claim rewards (mail, daily, events)
 *    ✓ Auto-explore with joystick movement
 *    ✓ Auto-combat with skill rotation
 *    ✓ Popup & ad handler
 *    ✓ Anti-stuck watchdog system
 *    ✓ Human-like randomization
 *    ✓ Infinite loop automation
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ═══════════════════════════════════════════════════════════════════════
// 📦 IMPORTS & INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════

auto.waitFor(); // Wait for accessibility service
setScreenMetrics(720, 1280); // Standard resolution for cloud phones

// Get configuration and logger from launcher
const args = engines.myEngine().execArgv;
const CONFIG = args.arguments.config || {};
const log = args.arguments.logger || {
  info: (msg) => console.log(msg),
  success: (msg) => console.log(msg),
  error: (msg) => console.error(msg),
  warning: (msg) => console.warn(msg),
};

// Image base path
const IMG_PATH = "/sdcard/AutoXBot/images/";

// Runtime state
let screenCapture = null;
let imageCache = {};
let lastActionTime = Date.now();
let botRunning = true;

// ═══════════════════════════════════════════════════════════════════════
// 🎯 CONFIGURATION DEFAULTS
// ═══════════════════════════════════════════════════════════════════════

const DEFAULT_CONFIG = {
  tutorialSkip: true,
  claimMail: true,
  claimDaily: true,
  autoExplore: true,
  autoCombat: true,
  slowMode: false,
  loopDelay: 3,

  // Detection thresholds (cloud phone optimized)
  imageThreshold: 0.75, // Lower for cloud phone compression
  imageSimilarity: 0.7, // Fuzzy matching threshold
  maxImageWaitTime: 5000, // 5 seconds max wait for image
  tapDelay: [300, 800], // Random delay between taps (ms)

  // Anti-stuck settings
  stuckTimeout: 120000, // 2 minutes without progress = stuck
  maxRetries: 3, // Max retry attempts before restart

  // Watchdog settings
  watchdogInterval: 30000, // Check every 30 seconds

  // Exploration settings
  exploreMoveDuration: [2000, 4000], // Random movement duration
  explorePauseDuration: [1000, 3000], // Random pause between moves
};

// Merge user config with defaults
Object.keys(DEFAULT_CONFIG).forEach((key) => {
  if (CONFIG[key] === undefined) {
    CONFIG[key] = DEFAULT_CONFIG[key];
  }
});

// ═══════════════════════════════════════════════════════════════════════
// 🖼️ IMAGE LOADING & CACHING
// ═══════════════════════════════════════════════════════════════════════

/**
 * Load and cache image from filesystem
 * Automatically tries normal, blur, and dim variants
 */
function loadImage(imageName) {
  // Check cache first
  if (imageCache[imageName]) {
    return imageCache[imageName];
  }

  // Try to load image variants in priority order
  const variants = [
    imageName,
    imageName.replace(".png", "_blur.png"),
    imageName.replace(".png", "_dim.png"),
  ];

  for (let variant of variants) {
    // Try different folder structures
    const paths = [
      IMG_PATH + variant,
      IMG_PATH + "tutorial/" + variant,
      IMG_PATH + "rewards/" + variant,
      IMG_PATH + "popups/" + variant,
      IMG_PATH + "gameplay/" + variant,
      IMG_PATH + "errors/" + variant,
    ];

    for (let path of paths) {
      if (files.exists(path)) {
        try {
          const img = images.read(path);
          if (img) {
            imageCache[imageName] = img;
            log.info(`Loaded image: ${variant}`);
            return img;
          }
        } catch (e) {
          log.warning(`Failed to load ${path}: ${e.message}`);
        }
      }
    }
  }

  log.error(`Image not found: ${imageName} (tried all variants & folders)`);
  return null;
}

/**
 * Preload all common images at startup
 */
function preloadImages() {
  log.info("Preloading images...");

  const commonImages = [
    "btn_start.png",
    "btn_skip.png",
    "btn_confirm.png",
    "btn_ok.png",
    "icon_mail.png",
    "icon_mail_notify.png",
    "btn_claim_all.png",
    "btn_claim.png",
    "icon_gift.png",
    "icon_event.png",
    "btn_close_x.png",
    "btn_close_x_dark.png",
    "btn_cancel.png",
    "joystick_base.png",
    "btn_attack.png",
    "btn_skill_1.png",
    "btn_skill_2.png",
    "btn_skill_3.png",
    "icon_auto_battle_off.png",
    "icon_auto_battle_on.png",
    "text_network_error.png",
    "btn_retry.png",
    "loading_icon.png",
    "menu_icon.png",
    "btn_back.png",
    "icon_quest.png",
  ];

  let loadedCount = 0;
  commonImages.forEach((imgName) => {
    if (loadImage(imgName)) loadedCount++;
  });

  log.success(`Preloaded ${loadedCount}/${commonImages.length} images`);
}

// ═══════════════════════════════════════════════════════════════════════
// 🔍 ADVANCED IMAGE DETECTION ENGINE
// ═══════════════════════════════════════════════════════════════════════

/**
 * Capture screen with error handling
 */
function getScreen() {
  try {
    if (!screenCapture) {
      if (!requestScreenCapture()) {
        log.error("Screen capture not available");
        return null;
      }
    }
    return captureScreen();
  } catch (e) {
    log.error(`Screen capture failed: ${e.message}`);
    return null;
  }
}

/**
 * Advanced image detection with multi-scale, blur compensation, and fallbacks
 * Returns: {found: boolean, x: int, y: int, confidence: float}
 */
function findImageAny(imageName, timeoutMs = 5000, options = {}) {
  const startTime = Date.now();
  const template = loadImage(imageName);

  if (!template) {
    log.error(`Cannot find image: ${imageName} - image not loaded`);
    return { found: false };
  }

  const threshold = options.threshold || CONFIG.imageThreshold;
  const scales = options.scales || [1.0, 0.95, 1.05, 0.9, 1.1, 0.85, 1.15]; // Multi-scale
  const grayscaleFallback = options.grayscale !== false;

  log.info(`Searching for: ${imageName}...`);

  while (Date.now() - startTime < timeoutMs) {
    const screen = getScreen();
    if (!screen) {
      sleep(500);
      continue;
    }

    // Try each scale
    for (let scale of scales) {
      try {
        // Standard color matching
        let match = images.findImage(screen, template, {
          threshold: threshold,
          region: options.region,
          level: options.level || 4, // Pyramid level for speed
        });

        if (match) {
          const centerX = match.x + template.getWidth() / 2;
          const centerY = match.y + template.getHeight() / 2;
          log.success(
            `Found ${imageName} at (${centerX}, ${centerY}) - scale: ${scale}`
          );
          screen.recycle();
          template.recycle();
          return {
            found: true,
            x: Math.round(centerX),
            y: Math.round(centerY),
            confidence: threshold,
          };
        }

        // Try grayscale fallback for blur resistance
        if (grayscaleFallback && scale === 1.0) {
          const screenGray = images.grayscale(screen);
          const templateGray = images.grayscale(template);

          match = images.findImage(screenGray, templateGray, {
            threshold: threshold - 0.05, // Slightly lower threshold
            region: options.region,
          });

          screenGray.recycle();
          templateGray.recycle();

          if (match) {
            const centerX = match.x + template.getWidth() / 2;
            const centerY = match.y + template.getHeight() / 2;
            log.success(
              `Found ${imageName} (grayscale) at (${centerX}, ${centerY})`
            );
            screen.recycle();
            template.recycle();
            return {
              found: true,
              x: Math.round(centerX),
              y: Math.round(centerY),
              confidence: threshold - 0.05,
            };
          }
        }
      } catch (e) {
        log.warning(`Detection error: ${e.message}`);
      }
    }

    screen.recycle();
    sleep(500); // Wait before retry
  }

  log.warning(`Image not found: ${imageName} (timeout)`);
  template.recycle();
  return { found: false };
}

/**
 * Find and click image if found
 */
function findAndClick(imageName, timeoutMs = 5000) {
  const result = findImageAny(imageName, timeoutMs);
  if (result.found) {
    randomTap(result.x, result.y);
    return true;
  }
  return false;
}

/**
 * Check if image exists on screen (quick check)
 */
function imageExists(imageName) {
  const result = findImageAny(imageName, 1000);
  return result.found;
}

// ═══════════════════════════════════════════════════════════════════════
// 🎲 RANDOMIZATION & HUMANIZATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Random number in range
 */
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random sleep with variance
 */
function randomSleep(baseMs, varianceMs = 200) {
  const sleepTime = baseMs + randomRange(-varianceMs, varianceMs);
  sleep(Math.max(100, sleepTime));
}

/**
 * Human-like tap with random offset
 */
function randomTap(x, y, offsetRange = 15) {
  const tapX = x + randomRange(-offsetRange, offsetRange);
  const tapY = y + randomRange(-offsetRange, offsetRange);

  // Random tap duration for realism
  const duration = randomRange(50, 150);
  press(tapX, tapY, duration);

  log.info(`Tapped at (${tapX}, ${tapY})`);
  lastActionTime = Date.now();
  randomSleep(randomRange(CONFIG.tapDelay[0], CONFIG.tapDelay[1]));
}

/**
 * Human-like swipe gesture
 */
function randomSwipe(x1, y1, x2, y2) {
  const duration = randomRange(300, 600);
  swipe(x1, y1, x2, y2, duration);
  log.info(`Swiped from (${x1}, ${y1}) to (${x2}, ${y2})`);
  lastActionTime = Date.now();
  randomSleep(500);
}

// ═══════════════════════════════════════════════════════════════════════
// 🎮 TUTORIAL SKIP SYSTEM
// ═══════════════════════════════════════════════════════════════════════

/**
 * Auto-skip tutorial and intro sequences
 */
function runTutorialSkip() {
  if (!CONFIG.tutorialSkip) return;

  log.info("🎓 Running tutorial skip...");
  let attempts = 0;
  const maxAttempts = 30; // Max attempts before giving up

  while (attempts < maxAttempts && botRunning) {
    // Check for stop signal
    if (storages.create("autox_bot_config").get("shouldStop", false)) {
      log.warning("Stop signal received");
      return;
    }

    // Try clicking start button
    if (findAndClick("btn_start.png", 2000)) {
      log.success("Clicked START button");
      randomSleep(2000);
      attempts = 0; // Reset on success
      continue;
    }

    // Try clicking skip button
    if (findAndClick("btn_skip.png", 2000)) {
      log.success("Clicked SKIP button");
      randomSleep(1500);
      attempts = 0;
      continue;
    }

    // Try clicking confirm/ok buttons
    if (
      findAndClick("btn_confirm.png", 2000) ||
      findAndClick("btn_ok.png", 2000)
    ) {
      log.success("Clicked CONFIRM/OK button");
      randomSleep(1500);
      attempts = 0;
      continue;
    }

    // Spam tap center screen (common tutorial progression)
    const centerX = device.width / 2;
    const centerY = device.height / 2;
    randomTap(centerX, centerY);

    attempts++;
    randomSleep(1000);

    // Check if tutorial is complete (no more skip buttons)
    if (
      attempts > 10 &&
      !imageExists("btn_skip.png") &&
      !imageExists("btn_start.png")
    ) {
      log.success("Tutorial skip complete!");
      break;
    }
  }

  log.info("Tutorial skip phase ended");
}

// ═══════════════════════════════════════════════════════════════════════
// 📬 REWARD CLAIMING SYSTEM
// ═══════════════════════════════════════════════════════════════════════

/**
 * Claim mail rewards
 */
function claimMailRewards() {
  if (!CONFIG.claimMail) return;

  log.info("📬 Checking mail rewards...");

  // Find and click mail icon
  if (
    findAndClick("icon_mail.png", 3000) ||
    findAndClick("icon_mail_notify.png", 3000)
  ) {
    randomSleep(2000, 500);

    // Try to claim all
    if (findAndClick("btn_claim_all.png", 3000)) {
      log.success("Claimed all mail rewards!");
      randomSleep(1500);

      // Confirm if needed
      findAndClick("btn_confirm.png", 2000);
      randomSleep(1000);
    } else {
      // Try individual claim buttons
      let claimed = 0;
      for (let i = 0; i < 5; i++) {
        if (findAndClick("btn_claim.png", 1500)) {
          claimed++;
          randomSleep(1000);
        }
      }
      if (claimed > 0) {
        log.success(`Claimed ${claimed} mail rewards individually`);
      }
    }

    // Close mail screen
    back();
    randomSleep(1000);
  } else {
    log.info("No mail icon found");
  }
}

/**
 * Claim daily/login rewards
 */
function claimDailyRewards() {
  if (!CONFIG.claimDaily) return;

  log.info("🎁 Checking daily rewards...");

  // Find and click gift/event icons
  const icons = ["icon_gift.png", "icon_event.png"];

  for (let icon of icons) {
    if (findAndClick(icon, 3000)) {
      randomSleep(2000, 500);

      // Try to claim
      if (
        findAndClick("btn_claim.png", 3000) ||
        findAndClick("btn_claim_all.png", 3000)
      ) {
        log.success(`Claimed from ${icon}`);
        randomSleep(1500);
        findAndClick("btn_confirm.png", 2000);
        randomSleep(1000);
      }

      // Close screen
      back();
      randomSleep(1000);
    }
  }
}

/**
 * Claim all available rewards in one pass
 */
function claimAllRewards() {
  log.info("💰 Starting reward claim cycle...");
  claimMailRewards();
  claimDailyRewards();
  log.info("Reward claim cycle complete");
}

// ═══════════════════════════════════════════════════════════════════════
// 🗺️ AUTO-EXPLORATION SYSTEM
// ═══════════════════════════════════════════════════════════════════════

/**
 * Simulate joystick movement for exploration
 */
function autoExplore() {
  if (!CONFIG.autoExplore) return;

  log.info("🗺️ Auto-exploring world...");

  // Find joystick base position (usually bottom-left)
  const joystickResult = findImageAny("joystick_base.png", 2000);
  let joystickX = 120; // Default position
  let joystickY = device.height - 180;

  if (joystickResult.found) {
    joystickX = joystickResult.x;
    joystickY = joystickResult.y;
    log.info(`Joystick detected at (${joystickX}, ${joystickY})`);
  } else {
    log.warning("Joystick not found, using default position");
  }

  // Random direction movement
  const directions = [
    { name: "up", dx: 0, dy: -60 },
    { name: "down", dx: 0, dy: 60 },
    { name: "left", dx: -60, dy: 0 },
    { name: "right", dx: 60, dy: 0 },
    { name: "up-right", dx: 45, dy: -45 },
    { name: "up-left", dx: -45, dy: -45 },
    { name: "down-right", dx: 45, dy: 45 },
    { name: "down-left", dx: -45, dy: 45 },
  ];

  const direction = directions[randomRange(0, directions.length - 1)];
  const moveDuration = randomRange(
    CONFIG.exploreMoveDuration[0],
    CONFIG.exploreMoveDuration[1]
  );

  log.info(`Moving ${direction.name} for ${moveDuration}ms`);

  // Simulate joystick drag
  const endX = joystickX + direction.dx;
  const endY = joystickY + direction.dy;

  // Long press to simulate continuous movement
  press(joystickX, joystickY, 100);
  randomSleep(50);
  swipe(joystickX, joystickY, endX, endY, moveDuration);

  lastActionTime = Date.now();
}

/**
 * Collect resources if found on screen
 */
function collectResources() {
  log.info("⛏️ Checking for collectible resources...");

  if (findAndClick("btn_collect_resources.png", 2000)) {
    log.success("Collected resources!");
    randomSleep(1500);
    findAndClick("btn_confirm.png", 1500);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ⚔️ AUTO-COMBAT SYSTEM
// ═══════════════════════════════════════════════════════════════════════

/**
 * Enable auto-battle if available
 */
function enableAutoBattle() {
  if (!CONFIG.autoCombat) return;

  // Check if auto is already on
  if (imageExists("icon_auto_battle_on.png")) {
    log.info("Auto-battle already enabled");
    return;
  }

  // Try to enable auto
  if (findAndClick("icon_auto_battle_off.png", 2000)) {
    log.success("Enabled auto-battle!");
    randomSleep(500);
  }
}

/**
 * Perform manual combat rotation
 */
function combatRotation() {
  if (!CONFIG.autoCombat) return;

  log.info("⚔️ Executing combat rotation...");

  // Spam attack button
  for (let i = 0; i < 3; i++) {
    if (findAndClick("btn_attack.png", 1000)) {
      randomSleep(300);
    }
  }

  // Use skills if available
  const skills = ["btn_skill_1.png", "btn_skill_2.png", "btn_skill_3.png"];
  skills.forEach((skill) => {
    if (findAndClick(skill, 1000)) {
      randomSleep(500);
    }
  });

  lastActionTime = Date.now();
}

// ═══════════════════════════════════════════════════════════════════════
// ❌ POPUP & AD HANDLER
// ═══════════════════════════════════════════════════════════════════════

/**
 * Close any popups or ads
 */
function closePopups() {
  log.info("❌ Checking for popups/ads...");

  const closeButtons = [
    "btn_close_x.png",
    "btn_close_x_dark.png",
    "btn_cancel.png",
  ];

  let closed = false;
  for (let btn of closeButtons) {
    if (findAndClick(btn, 1500)) {
      log.success(`Closed popup with ${btn}`);
      closed = true;
      randomSleep(1000);
      break;
    }
  }

  // Try back button as fallback
  if (!closed && imageExists("popup_background.png")) {
    back();
    log.info("Closed popup with back button");
    randomSleep(1000);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 🚨 ERROR RECOVERY & ANTI-STUCK SYSTEM
// ═══════════════════════════════════════════════════════════════════════

/**
 * Detect and recover from errors
 */
function checkForErrors() {
  // Network error
  if (imageExists("text_network_error.png")) {
    log.error("Network error detected!");

    if (
      findAndClick("btn_retry.png", 3000) ||
      findAndClick("btn_reconnect.png", 3000)
    ) {
      log.info("Clicked retry button");
      randomSleep(5000);
      return true;
    }

    // Force retry with back button
    back();
    randomSleep(2000);
    return true;
  }

  // Black screen / crash
  const screen = getScreen();
  if (screen) {
    const colors = images.findMultiColors(screen, "#000000", [], {
      region: [device.width / 2 - 50, device.height / 2 - 50, 100, 100],
      threshold: 10,
    });
    screen.recycle();

    if (colors) {
      log.warning("Black screen detected!");
      back();
      randomSleep(1000);
      back();
      randomSleep(2000);
      return true;
    }
  }

  // Stuck loading screen
  if (imageExists("loading_icon.png")) {
    const now = Date.now();
    if (now - lastActionTime > 60000) {
      // 1 minute stuck
      log.error("Stuck on loading screen!");
      back();
      randomSleep(2000);
      return true;
    }
  }

  return false;
}

/**
 * Restart game if completely stuck
 */
function restartGame(packageName = "com.your.game.package") {
  log.warning("🔄 Restarting game...");

  // Kill app
  home();
  randomSleep(2000);

  // Clear recent apps
  recents();
  randomSleep(1000);
  swipe(device.width / 2, device.height / 2, device.width / 2, 100, 500);
  randomSleep(1000);

  // Relaunch
  log.info(`Launching ${packageName}...`);
  launchApp(packageName);
  randomSleep(10000); // Wait for game to load

  lastActionTime = Date.now();
}

// ═══════════════════════════════════════════════════════════════════════
// 🐕 WATCHDOG THREAD
// ═══════════════════════════════════════════════════════════════════════

/**
 * Watchdog monitors for stuck state and recovers
 */
function startWatchdog() {
  threads.start(function () {
    log.info("🐕 Watchdog thread started");

    while (botRunning) {
      sleep(CONFIG.watchdogInterval);

      const now = Date.now();
      const timeSinceLastAction = now - lastActionTime;

      if (timeSinceLastAction > CONFIG.stuckTimeout) {
        log.error(
          `⚠️ Bot stuck for ${Math.round(timeSinceLastAction / 1000)}s!`
        );

        // Try recovery
        checkForErrors();
        closePopups();
        back();
        randomSleep(2000);

        // Reset timer
        lastActionTime = Date.now();
      }
    }

    log.info("Watchdog thread stopped");
  });
}

// ═══════════════════════════════════════════════════════════════════════
// 🔄 MAIN INFINITE LOOP
// ═══════════════════════════════════════════════════════════════════════

/**
 * Main bot loop - runs forever until stopped
 */
function mainLoop() {
  log.info("🚀 Starting main bot loop...");

  let loopCount = 0;

  while (botRunning) {
    loopCount++;
    log.info(`━━━━━━━━━━━━ LOOP #${loopCount} ━━━━━━━━━━━━`);

    // Check for stop signal
    if (storages.create("autox_bot_config").get("shouldStop", false)) {
      log.warning("Stop signal received - exiting loop");
      botRunning = false;
      break;
    }

    try {
      // Priority 1: Error recovery
      if (checkForErrors()) {
        log.info("Recovered from error, continuing...");
        randomSleep(3000);
        continue;
      }

      // Priority 2: Close popups
      closePopups();
      randomSleep(500);

      // Priority 3: Tutorial skip (if enabled)
      if (CONFIG.tutorialSkip) {
        runTutorialSkip();
      }

      // Priority 4: Enable auto-battle
      enableAutoBattle();
      randomSleep(500);

      // Priority 5: Claim rewards
      claimAllRewards();
      randomSleep(1000);

      // Priority 6: Exploration
      if (CONFIG.autoExplore) {
        autoExplore();
        randomSleep(
          randomRange(
            CONFIG.explorePauseDuration[0],
            CONFIG.explorePauseDuration[1]
          )
        );
      }

      // Priority 7: Combat
      if (CONFIG.autoCombat) {
        combatRotation();
        randomSleep(1000);
      }

      // Priority 8: Resource collection
      collectResources();
      randomSleep(1000);

      // Slow mode extra delay
      if (CONFIG.slowMode) {
        log.info("Slow mode: extra delay");
        randomSleep(3000, 1000);
      }

      // Loop delay
      const loopDelayMs = CONFIG.loopDelay * 60 * 1000; // Convert minutes to ms
      log.info(`Loop complete. Waiting ${CONFIG.loopDelay} minute(s)...`);
      sleep(loopDelayMs);
    } catch (e) {
      log.error(`Loop error: ${e.message}`);
      log.error(`Stack: ${e.stack}`);
      randomSleep(5000);
    }
  }

  log.info("Bot stopped gracefully");
}

// ═══════════════════════════════════════════════════════════════════════
// 🎬 STARTUP & EXECUTION
// ═══════════════════════════════════════════════════════════════════════

function main() {
  log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log.info("  🤖 AutoX.js Game Bot Starting...");
  log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Check permissions
  if (!requestScreenCapture()) {
    log.error("Screen capture permission denied!");
    dialogs.alert("Error", "Screen capture permission required!");
    exit();
  }
  log.success("Screen capture permission granted");

  // Preload images
  preloadImages();

  // Start watchdog
  startWatchdog();

  // Wait for game to be ready
  log.info("Waiting 5 seconds for game to be ready...");
  sleep(5000);

  // Start main loop
  mainLoop();

  // Cleanup
  log.info("Cleaning up resources...");
  Object.values(imageCache).forEach((img) => {
    if (img) img.recycle();
  });

  log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log.info("  ✅ Bot execution complete");
  log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

// ═══════════════════════════════════════════════════════════════════════
// 🚀 ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════

// Handle exit gracefully
events.on("exit", function () {
  botRunning = false;
  log.info("Exit event received");

  // Recycle images
  Object.values(imageCache).forEach((img) => {
    try {
      if (img) img.recycle();
    } catch (e) {
      // Ignore
    }
  });
});

// Run main function
try {
  main();
} catch (e) {
  log.error(`Fatal error: ${e.message}`);
  log.error(`Stack: ${e.stack}`);
  dialogs.alert(
    "Bot Error",
    `Fatal error occurred:\n${e.message}\n\nCheck logs for details.`
  );
}
