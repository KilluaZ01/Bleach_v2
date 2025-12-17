/**
 * =========================================================================
 * COMBAT MODULE [FIXED]
 * =========================================================================
 * FIXED: Removed global log dependency - accepts logger param
 * Auto-combat with skill rotation and auto-battle
 */

var detection = require("./detection.js");
var imageExists = detection.imageExists;
var findAndClick = detection.findImageAndClick;
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
function findCombatMarker(roi, lower, upper, log) {
  var screen = captureScreen();
  if (!screen) return null;

  try {
    var x1 = roi[0],
      y1 = roi[1],
      x2 = roi[2],
      y2 = roi[3];

    var w = x2 - x1;
    var h = y2 - y1;

    var cropped = images.clip(screen, x1, y1, w, h);
    var hsv = images.cvtColor(cropped, "BGR2HSV");

    var mask = images.inRange(
      hsv,
      colors.hsv(lower[0], lower[1], lower[2]),
      colors.hsv(upper[0], upper[1], upper[2])
    );

    var points = images.findNonZero(mask);

    if (points && points.length > 0) {
      var p = points[0]; // first detected pixel
      return {
        x: p.x + x1,
        y: p.y + y1,
      };
    }
  } catch (e) {
    log.warning("Combat marker detection failed: " + e.message);
  } finally {
    screen.recycle();
  }

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
  if (imageExists("icon_auto_battle_on.png", config, log)) {
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

function combatRotation(config, log, updateLastAction) {
  if (!config.autoCombat) return;

  log.info("Starting state-driven combat...");

  var loops = 0;
  var maxLoops = config.combatMaxLoops || 25;

  while (loops < maxLoops) {
    var marker = findMarkerByColor(log);
    var clock = findCombatMarker(
      [1035, 25, 1058, 47],
      [0, 0, 220],
      [179, 20, 255],
      log
    );

    var clockDimmed = findCombatMarker(
      [1035, 25, 1058, 47],
      [0, 0, 50],
      [179, 30, 120],
      log
    );

    // 🛑 Exit condition
    if (marker) {
      log.success("Combat ended (marker found)");
      break;
    }

    if (!clock && !clockDimmed) {
      log.info("Clock not found (normal or dimmed), exiting loop");
      break;
    }

    click(1177, 420); // Counter
    randomSleep(1500);

    click(1068, 538); // Basic Attack
    randomSleep(2000);

    click(944, 493); // Special attack
    randomSleep(2000);

    click(946, 632); // Dodge
    randomSleep(1000);
    click(946, 632); // Dodge
    randomSleep(1000);
    click(1045, 406); // Ultimate Attack
    randomSleep(4500);

    // Basic attack
    if (canAttack) {
      findAndClick("btn_attack.png", 600, config, log, updateLastAction);
      randomSleep(200, 350);
    } else {
      // Small idle wait if attack not available
      randomSleep(150, 250);
    }

    updateLastAction();
    loops++;
  }
}

module.exports = {
  enableAutoBattle: enableAutoBattle,
  combatRotation: combatRotation,
};
