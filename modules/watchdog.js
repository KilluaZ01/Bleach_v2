/**
 * =========================================================================
 * WATCHDOG MODULE [FIXED]
 * =========================================================================
 * FIXED: All functions now accept logger parameter
 * Monitors bot for stuck state and auto-recovers
 */

var errors = require("./errors.js");
var checkForErrors = errors.checkForErrors;
var popups = require("./popups.js");
var closePopups = popups.closePopups;
var humanization = require("./humanization.js");
var randomSleep = humanization.randomSleep;

/**
 * Watchdog monitors for stuck state and recovers
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} getLastActionTime - Function to get last action timestamp
 * @param {Function} updateLastAction - Callback to update last action time
 * @param {Function} isBotRunning - Function to check if bot is still running
 */
function startWatchdog(
  config,
  log,
  getLastActionTime,
  updateLastAction,
  isBotRunning
) {
  threads.start(function () {
    log.info("Watchdog thread started");

    while (isBotRunning()) {
      sleep(config.watchdogInterval);

      var now = Date.now();
      var timeSinceLastAction = now - getLastActionTime();

      if (timeSinceLastAction > config.stuckTimeout) {
        log.error(
          "Bot stuck for " + Math.round(timeSinceLastAction / 1000) + "s!"
        );

        // Try recovery
        checkForErrors(config, log, updateLastAction, getLastActionTime());
        closePopups(config, log, updateLastAction);
        back();
        randomSleep(2000);

        // Reset timer
        updateLastAction();
      }
    }

    log.info("Watchdog thread stopped");
  });
}

module.exports = {
  startWatchdog: startWatchdog,
};
