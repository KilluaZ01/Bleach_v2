/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🎯 CONFIGURATION MODULE
 * ═══════════════════════════════════════════════════════════════════════
 * Handles all bot configuration, constants, and user settings
 */

// Image base path
const IMG_PATH = "/sdcard/AutoXBot/images/";

// Default configuration values
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

/**
 * Initialize configuration by merging user config with defaults
 */
function initConfig(userConfig) {
  const config = {};

  Object.keys(DEFAULT_CONFIG).forEach((key) => {
    if (userConfig[key] === undefined) {
      config[key] = DEFAULT_CONFIG[key];
    } else {
      config[key] = userConfig[key];
    }
  });

  return config;
}

module.exports = {
  IMG_PATH,
  DEFAULT_CONFIG,
  initConfig,
};
