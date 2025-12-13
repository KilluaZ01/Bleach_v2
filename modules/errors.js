/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🚨 ERROR RECOVERY MODULE [FIXED]
 * ═══════════════════════════════════════════════════════════════════════
 * ✅ FIXED: All functions now accept logger parameter
 * Detect and recover from errors, crashes, and stuck states
 */

const { getScreen } = require("./detection.js");
const { imageExists, findAndClick } = require("./detection.js");
const { randomSleep } = require("./humanization.js");

/**
 * Detect and recover from errors
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 * @param {Number} lastActionTime - Timestamp of last action
 * @returns {Boolean} True if error was detected and handled
 */
function checkForErrors(config, log, updateLastAction, lastActionTime) {
  // Network error
  if (imageExists("text_network_error.png", config, log)) {
    log.error("Network error detected!");

    if (
      findAndClick("btn_retry.png", 3000, config, log, updateLastAction) ||
      findAndClick("btn_reconnect.png", 3000, config, log, updateLastAction)
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
  const screen = getScreen(log);
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
  if (imageExists("loading_icon.png", config, log)) {
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
 * @param {String} packageName - Game package name
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function restartGame(packageName, log, updateLastAction) {
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

  updateLastAction();
}

module.exports = {
  checkForErrors,
  restartGame,
};
