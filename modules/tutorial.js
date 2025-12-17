/**
 * =========================================================================
 * TUTORIAL SKIP MODULE [FIXED]
 * =========================================================================
 * FIXED: All functions now accept logger parameter
 * Auto-skip tutorial and intro sequences
 */

var detection = require("./detection");
var findAndClick = detection.findImageAndClick;
var imageExists = detection.imageExists;
var humanization = require("./humanization");
var randomSleep = humanization.randomSleep;
var randomTap = humanization.randomTap;

/**
 * Auto-skip tutorial and intro sequences
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 * @param {Function} shouldStop - Function to check if bot should stop
 */
function runTutorialSkip(config, log, updateLastAction, shouldStop) {
  if (!config.tutorialSkip) return;

  log.info("Running tutorial skip...");
  var attempts = 0;
  var maxAttempts = 30; // Max attempts before giving up

  while (attempts < maxAttempts && !shouldStop()) {
    // Try clicking skip button
    if (findAndClick("skip_button.png", 2000, config, log, updateLastAction)) {
      log.success("Clicked SKIP button");
      randomSleep(1500);
      attempts = 0;
      continue;
    }

    // Try clicking confirm/ok buttons
    if (findAndClick("skip_confirm.png", 2000, config, log, updateLastAction)) {
      log.success("Clicked CONFIRM/OK button");
      randomSleep(1500);
      attempts = 0;
      continue;
    }

    // Spam tap center screen (common tutorial progression)
    var centerX = device.width / 2;
    var centerY = device.height / 2;
    randomTap(centerX, centerY, config, log, updateLastAction);

    attempts++;
    randomSleep(1000);

    // Check if tutorial is complete (no more skip buttons)
    if (attempts > 10 && !imageExists("skip_button.png", config, log)) {
      log.success("Tutorial skip complete!");
      break;
    }
  }

  log.info("Tutorial skip phase ended");
}

module.exports = {
  runTutorialSkip: runTutorialSkip,
};
