/**
 * =========================================================================
 * COMBAT MODULE [FIXED]
 * =========================================================================
 * FIXED: Removed global log dependency - accepts logger param
 * Auto-combat with skill rotation and auto-battle
 */

var detection = require("./detection.js");
var imageExists = detection.imageExists;
var findImageAndClick = detection.findImageAndClick;
var humanization = require("./humanization.js");
var randomSleep = humanization.randomSleep;

/**
 * Find combat marker by color inside ROI
 * @param {Array} roi - [x1, y1, x2, y2]
 * @param {Array} lower - [h, s, v]
 * @param {Array} upper - [h, s, v]
 * @param {Object} log
 * @returns {Object|null} {x, y} or null
 */

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

function findCombatMarker(log) {
  var img = captureScreen();
  if (!img) return null;

  // ROI (same as Python example)
  var x1 = 1037,
    y1 = 25,
    x2 = 1057,
    y2 = 46;

  // Marker color (#FCD9FB example converted to RGB tolerance)
  var color = "#4b4a4b";
  var color2 = "#f9f8f9";
  var threshold = 10;

  var point = images.findColor(img, color, {
    region: [x1, y1, x2 - x1, y2 - y1],
    threshold: threshold,
  });

  var point2 = images.findColor(img, color2, {
    region: [x1, y1, x2 - x1, y2 - y1],
    threshold: threshold,
  });

  img.recycle();

  if (point || point2) {
    log.info(
      "Marker found at (" +
        (point ? point.x : point2.x) +
        ", " +
        (point ? point.y : point2.y) +
        ")"
    );
    toast(
      "Marker found at (" +
        (point ? point.x : point2.x) +
        ", " +
        (point ? point.y : point2.y) +
        ")"
    );
    return {
      x: point ? point.x : point2.x,
      y: point ? point.y : point2.y,
    };
  }

  log.warning("Marker not found");
  return null;
}

/**
 * Enable auto-battle if available
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function enableAutoBattle(config, log, updateLastAction) {
  if (!config.autoCombat) return;

  // Check if auto is already on
  if (imageExists("icon_auto_battle_on.png", log)) {
    log.info("Auto-battle already enabled");
    return;
  }

  // Try to enable auto
  if (
    findAndClick(
      "icon_auto_battle_off.png",
      2000,
      config,
      log,
      updateLastAction
    )
  ) {
    log.success("Enabled auto-battle!");
    randomSleep(500);
  }
}

function checkHealthBar(log, updateLastAction) {
  roi = [400, 29, 420, 41];
  color1 = "#eaebeb";
  color2 = "#a0a1a1";
  color3 = "#464647";

  testColor1 = findMarkerByColor(roi, color1, log);
  testColor2 = findMarkerByColor(roi, color2, log);
  testColor3 = findMarkerByColor(roi, color3, log);

  if (testColor1 || testColor2 || testColor3) {
    log.info("Health Bar detected!");
    return true;
  } else {
    return false;
  }
}

function combatRotation(config, log, updateLastAction) {
  if (!config.autoCombat) return;

  log.info("Starting state-driven combat...");

  var loops = 0;
  var maxLoops = config.combatMaxLoops || 100;

  toast("Searching Flash Step");
  if (
    imageExists("flash_step_text.png", log) ||
    imageExists("dodge_text.png", log)
  ) {
    click(1068, 538);
    randomSleep(1500);
    click(1068, 538);
    randomSleep(1500);
  }

  while (loops < maxLoops) {
    var clock = findCombatMarker(log);
    var clockDimmed = findCombatMarker(log);
    var canDodge = imageExists("dodge_text.png", log);
    var healthBarDetected = checkHealthBar(log, updateLastAction);

    if (!clock && !clockDimmed) {
      log.info("Clock not found (normal or dimmed), exiting loop");
      break;
    }

    click(1177, 420); // Counter
    randomSleep(1500);

    click(1068, 538); // Basic Attack
    randomSleep(2000);

    click(1068, 538); // Basic Attack
    randomSleep(2000);

    click(944, 493); // Special attack
    randomSleep(2000);

    if (!canDodge) {
      click(946, 632); // Dodge
      randomSleep(1000);
      click(946, 632); // Dodge
      randomSleep(1000);
    } else {
      click(946, 632); // Dodge
      randomSleep(1000);
    }

    click(1045, 406); // Ultimate Attack
    randomSleep(2000);

    for (var i = 0; i < 15; i++) {
      // Basic attack
      if (healthBarDetected || clock) {
        click(1068, 538); // Basic Attack
        randomSleep(500);
        i++;
      } else {
        break;
      }
    }

    updateLastAction();
    loops++;
  }
}

module.exports = {
  enableAutoBattle: enableAutoBattle,
  combatRotation: combatRotation,
};
