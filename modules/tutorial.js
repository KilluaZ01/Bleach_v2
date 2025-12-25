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
    if (
      imageExists("skip_button.png", log) ||
      imageExists("skip_another.png", log)
    ) {
      toast("Skip button detected");
      click(1180, 52); // Skip button
      randomSleep(4000);
      click(870, 533); // Confirm skip
      randomSleep(4000);
    }

    attempts++;
    randomSleep(1000);

    // Check if tutorial is complete (no more skip buttons)
    if (
      attempts > 3 &&
      (!imageExists("skip_button.png", log) ||
        !imageExists("skip_another.png", log))
    ) {
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

function runSenseTest(config, log, updateLastAction) {
  log.info("Starting sense test...");

  // Swipe coordinates (adjust once per game)
  var x1 = 645;
  var y1 = 290;
  var x2 = 645;
  var y2 = 320;

  // Progressive swipe durations (ms)
  var durations = [1800, 2200, 2600, 3000, 3500];

  var maxRounds = 10; // safety
  var round = 0;

  while (round < maxRounds) {
    for (var i = 0; i < durations.length; i++) {
      var duration = durations[i];

      log.info(
        "Sense swipe attempt: round " + (round + 1) + ", duration=" + duration
      );

      swipe(x1, y1, x2, y2, duration);
      updateLastAction();

      randomSleep(1200); // allow animation

      // ✅ Final success check
      if (imageExists("third_sense.png", log)) {
        log.success("Sense test PASSED");
        return true;
      }
    }

    round++;
  }

  log.warning("Sense test FAILED after retries");
  return false;
}

function handleChatPrompts(config, log, updateLastAction, setExitMainLoop) {
  if (imageExists("another_chat.png", log)) {
    click(798, 363); // Talk to NPC
    randomSleep(4000);
    click(1180, 52); // Skip
    randomSleep(4000);
    click(977, 431); // Talk Again
    randomSleep(7000);

    runSenseTest(config, log, updateLastAction);

    while (true) {
      if (
        imageExists("skip_button.png", log) ||
        imageExists("skip_another.png", log)
      ) {
        toast("Skip Button Found! Stopping Clicks...");
        click(1180, 52); // Skip
        randomSleep(4000);
        click(870, 533);
        randomSleep(4000);
        break;
      }
      click(1, 1);
      randomSleep(1000);
      click(1, 1);
      randomSleep(1000);
      click(1, 1);
      randomSleep(1000);
    }

    click(1180, 52); // Skip
    randomSleep(3000);
    click(879, 533); // Skip Confirm
    randomSleep(3000);
    click(1, 1);
    randomSleep(4000);

    // Signal to exit the main loop
    setExitMainLoop();
  }
  updateLastAction();
}

module.exports = {
  runTutorialSkip: runTutorialSkip,
  handleNextBattle: handleNextBattle,
  handleCharPrompt: handleCharPrompt,
  handleChatPrompts: handleChatPrompts,
};
