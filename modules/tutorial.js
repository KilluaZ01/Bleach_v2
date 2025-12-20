/**
 * =========================================================================
 * TUTORIAL SKIP MODULE [FIXED]
 * =========================================================================
 * FIXED: All functions now accept logger parameter
 * Auto-skip tutorial and intro sequences
 */

var detection = require("./detection");
var findImageAndClick = detection.findImageAndClick;
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
  var maxAttempts = 15; // Max attempts before giving up

  while (attempts < maxAttempts && !shouldStop()) {
    // Try clicking skip button
    if (imageExists("skip_button.png", log)) {
      toast("Skip button detected");
      if (findImageAndClick("skip_button.png", log)) {
        log.success("Clicked SKIP button");
        randomSleep(1500);
        click(870, 533);
        randomSleep(2500);
        continue;
      }
    }

    attempts++;
    randomSleep(1000);

    // Check if tutorial is complete (no more skip buttons)
    if (attempts > 3 && !imageExists("skip_button.png", log)) {
      log.success("Tutorial skip complete!");
      break;
    }
  }

  log.info("Tutorial skip phase ended");
  updateLastAction();
}

function handleDimmedTutorial(config, log, updateLastAction, shouldStop) {
  var img = captureScreen();
  if (!img) return false;

  if (!isScreenDimmed(img)) {
    img.recycle();
    return false;
  }

  // Try highlight detection
  var target = images.findColor(img, "#ffffff", {
    threshold: 40,
  });

  if (target) {
    click(target.x, target.y);
    img.recycle();
    return true;
  }
}

module.exports = {
  runTutorialSkip: runTutorialSkip,
  handleDimmedTutorial: handleDimmedTutorial,
};
