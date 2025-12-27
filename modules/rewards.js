/**
 * =========================================================================
 * REWARDS MODULE [FIXED]
 * =========================================================================
 * FIXED: All functions now accept logger parameter
 * Auto-claim mail, daily rewards, and events
 */

var detection = require("./detection.js");
var imageExists = detection.imageExists;
var findImageAndClick = detection.findImageAndClick;
var humanization = require("./humanization.js");
var randomSleep = humanization.randomSleep;

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

/**
 * Claim mail rewards
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function claimMailRewards(config, log, updateLastAction) {
  if (!config.claimMail) return;

  log.info("Checking mail rewards...");
  click(170, 588); // Claim Rewards
  randomSleep(8000);
  click(133, 650);
  randomSleep(10000);
  click(645, 622);
  randomSleep(7000);
  click(645, 670);
  randomSleep(6000);
  click(54, 35);
  randomSleep(6000);
  click(196, 583);
  randomSleep(8000);
  click(327, 661);
  randomSleep(6000);
  click(645, 541);
  randomSleep(8000);
  click(54, 35);
  randomSleep(6000);
  if (imageExists("battle_icon.png", log)) {
    log.info("Still Not Home...");
  } else {
    click(54, 35);
    randomSleep(6000);
  }
  click(1196, 93);
  randomSleep(4000);
  click(1193, 77);
  randomSleep(4000);
}

function drawTillNext(log) {
  for (var i = 0; i < 20; i++) {
    log.info("Draw attempt #" + (i + 1));

    // 1️⃣ Skip gacha animation
    if (imageExists("skip_gatcha.png", log)) {
      log.info("Skip detected");
      click(1180, 52);
      sleep(2000);
      continue;
    }

    // 2️⃣ Normal flow
    click(640, 664); // Tap to close
    sleep(3000);

    click(1146, 658); // 10x pull
    sleep(3000);

    // 3️⃣ Token required popup
    if (imageExists("close_button.png", log)) {
      log.info("Close token required popup");
      click(978, 203);
      sleep(3000);
      return true;
    }

    // 4️⃣ Rating popup
    if (imageExists("rating.png", log)) {
      log.info("Rating popup detected");
      click(861, 64);
      sleep(2000);
    }
  }

  return false;
}

function draw10xTill1x(log) {
  while (true) {
    // 1️⃣ Skip animation
    if (imageExists("skip_gatcha.png", log)) {
      log.info("Skipping animation...");
      click(1180, 52);
      sleep(2000);
      continue;
    }

    // 2️⃣ Close animation
    log.info("Closing animation...");
    click(640, 664);
    sleep(3000);

    // 3️⃣ Another 10x pull
    log.info("Another 10x pull...");
    click(1146, 658);
    sleep(3000);

    // 4️⃣ Popup handling
    if (imageExists("close_button.png", log)) {
      // Confirm
      log.info("Confirming...");
      click(868, 512);
      sleep(3000);

      // Top-up detected
      if (imageExists("top_up.png", log)) {
        log.info("Top-up screen — returning");
        click(54, 35);
        sleep(2000);
        return true;
      }
    }

    if (imageExists("rating.png", log)) {
      log.info("Rating popup");
      click(861, 64);
      sleep(2000);
    }
  }

  return false;
}

function draw1xTill0(log) {
  // Initial 1x pull
  click(845, 657);
  sleep(3000);

  while (true) {
    // 1️⃣ Skip animation
    if (imageExists("skip_gatcha.png", log)) {
      log.info("Skipping animation");
      click(1180, 52);
      sleep(2000);
      continue;
    }

    // 2️⃣ Close animation
    click(640, 664);
    sleep(3000);

    // 3️⃣ Another 1x pull
    click(845, 657);
    sleep(3000);

    // 4️⃣ Confirm & check top-up
    if (imageExists("close_button.png", log)) {
      log.info("Confirm popup");
      click(868, 512);
      sleep(3000);

      if (imageExists("top_up.png", log)) {
        log.info("Top-up detected — stopping");
        return true;
      }
    }

    if (imageExists("rating.png", log)) {
      log.info("Rating popup");
      click(861, 64);
      sleep(2000);
    }
  }

  return false;
}

/**
 * Summoning logic
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function summoningLogic(config, log, updateLastAction) {
  log.info("Summoning Characters...");

  click(889, 651); // Gatcha Button
  randomSleep(8000);

  click(1146, 658); // 10x Summon
  randomSleep(4000);

  drawTillNext(log);
  randomSleep(2000);

  click(110, 293); // Another Banner
  randomSleep(6000);

  click(1146, 658); // 10x Summon
  randomSleep(4000);

  draw10xTill1x(log);
  randomSleep(2000);

  draw1xTill0(log);
  randomSleep(2000);

  click(54, 35); // Close Gatcha
  randomSleep(6000);

  if (imageExists("battle_icon.png", log)) {
    log.info("Already at Home Screen...");
    return;
  }

  click(54, 35); // Close Gatcha
  randomSleep(6000);

  log.info("Summoning cycle complete");
}

function checkIfValid(config, log, updateLastAction) {
  // Valid Accounts Checking
  if (imageExists("home_char.png", log)) {
    findImageAndClick("home_char.png", log);
    log.info("Inside Characters");
    randomSleep(6000);
  }

  if (imageExists("more.png", log)) {
    findImageAndClick("more.png", log);
    log.info("Clicking More");
    randomSleep(6000);
  }

  click(30, 50);
  randomSleep(6000);

  if (
    findMarkerByColor([160, 158, 170, 161], "#fee761", log) &&
    findMarkerByColor([260, 158, 270, 161], "#fee761", log)
  ) {
    log.success("Valid account detected, Stopping Bot");
    return true;
  } else {
    log.error("Invalid account detected, Retrying Loop From Start...");
    return false;
  }
}

/**
 * Claim all available rewards in one pass
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function claimAllRewards(config, log, updateLastAction) {
  log.info("Starting reward claim cycle...");
  claimMailRewards(config, log, updateLastAction);
  log.info("Mail rewards claimed");
  randomSleep(2000);
  log.info("Proceeding to summoning logic...");
  summoningLogic(config, log, updateLastAction);
  log.info("Reward claim cycle complete");
}

module.exports = {
  claimAllRewards: claimAllRewards,
  claimMailRewards: claimMailRewards,
  summoningLogic: summoningLogic,
  checkIfValid: checkIfValid,
};
