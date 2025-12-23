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

function findMarkerByColor(roi, color, log) {
  var img = captureScreen();
  if (!img) return null;

  // ROI (same as Python example)
  var x1 = roi[0],
    y1 = roi[1],
    x2 = roi[2],
    y2 = roi[3];

  var threshold = 10;
  var point = images.findColor(img, color, {
    region: [x1, y1, x2 - x1, y2 - y1],
    threshold: threshold,
  });

  img.recycle();

  if (point) {
    log.info("Marker found at (" + point.x + ", " + point.y + ")");
    return { x: point.x, y: point.y };
  }

  log.warning("Marker not found");
  return null;
}

function handleNextBattle(config, log, updateLastAction) {
  if (
    imageExists("battle_icon.png", log) &&
    findMarkerByColor([900, 575, 950, 580], "#d5d5d4", log)
  ) {
    log.info("Next battle detected, clicking...");
    click(1205, 642);
    randomSleep(6000);
    click(660, 460);
    randomSleep(5000);
    click(1052, 673);
    randomSleep(6000);
    click(1130, 670);
    randomSleep(28000);
  }

  updateLastAction();
}

function handleCharPrompt(config, log, updateLastAction) {
  if (imageExists("char_prompt.png", log)) {
    while (true) {
      if (imageExists("skip_button.png", log)) {
        toast("Skip Button Found! Stopping Clicks...");
        break;
      }
      click(640, 500);
      randomSleep(500);
    }
  }
  updateLastAction();
}

function handleChatPrompts(config, log, updateLastAction) {
  if (imageExists("chat_prompt.png", log)) {
    click(798, 363);
    randomSleep(4000);
    click(1180, 52);
    randomSleep(4000);
    click(798, 363);
    randomSleep(7000);
    swipe(645, 290, 645, 320, 2800);
    randomSleep(4000);
    click(600, 1);
    randomSleep(3000);
    swipe(645, 290, 645, 320, 2600);
    randomSleep(4000);
    click(600, 1);
    randomSleep(4000);
    for (var i = 0; i < 5; i++) {
      swipe_macro(adb_address, 645, 290, 645, 320, 1800);
      time.sleep(3);

      tap_macro(adb_address, 600, 1);
      time.sleep(4);

      if (imageExists("skip_button.png", log)) {
        break
      }
    }
  }
  updateLastAction();
}

module.exports = {
  runTutorialSkip: runTutorialSkip,
  handleNextBattle: handleNextBattle,
  handleCharPrompt: handleCharPrompt,
};
