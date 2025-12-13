/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🎮 TUTORIAL SKIP MODULE [FIXED]
 * ═══════════════════════════════════════════════════════════════════════
 * ✅ FIXED: All functions now accept logger parameter
 * Auto-skip tutorial and intro sequences
 */

const { findAndClick, imageExists } = require("./detection.js");
const { randomSleep, randomTap } = require("./humanization.js");

/**
 * Auto-skip tutorial and intro sequences
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 * @param {Function} shouldStop - Function to check if bot should stop
 */
function runTutorialSkip(config, log, updateLastAction, shouldStop) {
  if (!config.tutorialSkip) return;

  log.info("🎓 Running tutorial skip...");
  let attempts = 0;
  const maxAttempts = 30; // Max attempts before giving up

  while (attempts < maxAttempts && !shouldStop()) {
    // Try clicking start button
    if (findAndClick("btn_start.png", 2000, config, log, updateLastAction)) {
      log.success("Clicked START button");
      randomSleep(2000);
      attempts = 0; // Reset on success
      continue;
    }

    // Try clicking skip button
    if (findAndClick("btn_skip.png", 2000, config, log, updateLastAction)) {
      log.success("Clicked SKIP button");
      randomSleep(1500);
      attempts = 0;
      continue;
    }

    // Try clicking confirm/ok buttons
    if (
      findAndClick("btn_confirm.png", 2000, config, log, updateLastAction) ||
      findAndClick("btn_ok.png", 2000, config, log, updateLastAction)
    ) {
      log.success("Clicked CONFIRM/OK button");
      randomSleep(1500);
      attempts = 0;
      continue;
    }

    // Spam tap center screen (common tutorial progression)
    const centerX = device.width / 2;
    const centerY = device.height / 2;
    randomTap(centerX, centerY, config, log, updateLastAction);

    attempts++;
    randomSleep(1000);

    // Check if tutorial is complete (no more skip buttons)
    if (
      attempts > 10 &&
      !imageExists("btn_skip.png", config, log) &&
      !imageExists("btn_start.png", config, log)
    ) {
      log.success("Tutorial skip complete!");
      break;
    }
  }

  log.info("Tutorial skip phase ended");
}

module.exports = {
  runTutorialSkip,
};
