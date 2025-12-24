/**
 * =========================================================================
 * EXPLORATION MODULE [FIXED]
 * =========================================================================
 * FIXED: All functions now accept logger parameter
 * Auto-exploration with joystick movement and resource collection
 */

const config = require("./config.js");
var detection = require("./detection.js");
var findImageAny = detection.findImageAny;
var findAndClick = detection.findAndClick;
var humanization = require("./humanization.js");
var randomRange = humanization.randomRange;
var randomSleep = humanization.randomSleep;
var explore = config.EXPLORE;

/**
 * Find marker by color in ROI
 * @returns {Object|null} { x, y } or null
 */
function findMarkerByColor(roi, color, log) {
  var img = captureScreen();
  if (!img) return null;

  var imgW = img.getWidth();
  var imgH = img.getHeight();

  var x1 = roi[0];
  var y1 = roi[1];
  var x2 = roi[2];
  var y2 = roi[3];

  // Clamp coordinates
  x1 = Math.max(0, Math.min(x1, imgW - 1));
  y1 = Math.max(0, Math.min(y1, imgH - 1));
  x2 = Math.max(x1 + 1, Math.min(x2, imgW));
  y2 = Math.max(y1 + 1, Math.min(y2, imgH));

  var w = x2 - x1;
  var h = y2 - y1;

  var point = images.findColor(img, color, {
    region: [x1, y1, w, h],
    threshold: 10,
  });

  img.recycle();

  if (point) {
    log.info("Marker found at (" + point.x + ", " + point.y + ")");
    return { x: point.x, y: point.y };
  }

  log.warning("Marker not found");
  return null;
}

function normalize(dx, dy) {
  var length = Math.sqrt(dx * dx + dy * dy);
  if (length === 0) return { x: 0, y: 0 };
  return { x: dx / length, y: dy / length };
}

/**
 * Simulate joystick movement for exploration
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function autoExplore(config, log, updateLastAction) {
  if (!config.autoExplore) return;

  log.info("Auto-exploring using marker feedback loop...");

  var steps = 0;

  while (steps < 10) {
    // Re-detect marker every loop
    roi = [472, 500, 811, 645];
    color_Marker = "#f8c6fb";
    var marker = findMarkerByColor(roi, color_Marker, log);
    if (!marker) {
      toast("Marker lost, stopping movement");
      log.warning("Marker lost, stopping movement");
      break;
    }

    // Direction vector
    var dx = marker.x - explore.centerX;
    var dy = marker.y - explore.centerY;

    var length = Math.sqrt(dx * dx + dy * dy);
    if (length < 10) {
      log.success("Reached marker center");
      break;
    }

    var nx = dx / length;
    var ny = dy / length;

    // Joystick swipe target
    var jx = explore.joystickX;
    var jy = explore.joystickY;

    var jx2 = jx + nx * explore.swipeDistance;
    var jy2 = jy + ny * explore.swipeDistance;

    var duration = 3000;

    log.info(
      "Step " +
        (steps + 1) +
        ": moving dx=" +
        Math.round(dx) +
        " dy=" +
        Math.round(dy)
    );

    swipe(jx, jy, jx2, jy2, duration);

    updateLastAction();

    // Small wait before next detection
    randomSleep(
      randomRange(config.explore.stepDelay[0], config.explore.stepDelay[1])
    );

    steps++;
  }
}

function tapToTrack(config, log, updateLastAction) {
  log.info("Attempting to find and tap tracking marker...");
  var roi = [66, 288, 169, 314];
  var color_tracker = "#ff8fb8";
  var point = findMarkerByColor(roi, color_tracker, log);

  if (point) {
    click(point.x, point.y);
    updateLastAction();
    log.success("Tapped tracking marker at (" + point.x + ", " + point.y + ")");
    return { x: point.x, y: point.y };
  }
}

/**
 * Collect resources if found on screen
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function collectResources(config, log, updateLastAction) {
  log.info("Checking for collectible resources...");

  if (
    findAndClick(
      "btn_collect_resources.png",
      2000,
      config,
      log,
      updateLastAction
    )
  ) {
    log.success("Collected resources!");
    randomSleep(1500);
    findAndClick("btn_confirm.png", 1500, config, log, updateLastAction);
  }
}

module.exports = {
  autoExplore: autoExplore,
  collectResources: collectResources,
  tapToTrack: tapToTrack,
};
