auto();

/**
 * =========================================================================
 * IMAGE DETECTION MODULE [SIMPLIFIED]
 * =========================================================================
 * Simplified image detection using basic screen capture and image search
 */

var imageUtils = require("./imageUtils.js");
var IMG_PATH = require("./config.js").IMG_PATH;
var loadImage = imageUtils.loadImage;
var loadImageDirect = imageUtils.loadImageDirect;

/**
 * Capture screen with error handling (assumes permission already granted)
 * @param {Object} log - Logger object
 */
function getScreen(log) {
  try {
    log.info("Capturing screen...");
    var screen = captureScreen();

    if (!screen) {
      log.error("❌ Screen capture failed: No screen data returned");
      return null;
    }
    log.info("✅ Screen captured successfully.");
    return screen;
  } catch (e) {
    log.error("❌ Screen capture failed: " + e.message);
    return null;
  }
}

/**
 * Find image on screen
 * Returns: {found: boolean, x: int, y: int}
 * @param {String} imageName - Image file name
 * @param {Object} log - Logger object
 */
function findImageAny(imageName, log) {
  var imagePath = IMG_PATH + imageName;
  var template = loadImageDirect(imagePath, log);
  if (!template) {
    log.error("❌ Failed to load template image: " + imageName);
    return { found: false };
  }

  var screen = getScreen(log);
  if (!screen) {
    template.recycle();
    return { found: false };
  }

  var point = images.findImage(screen, template, { threshold: 0.75 });
  screen.recycle();
  template.recycle();

  if (point) {
    log.success("✅ Image found at: (" + point.x + ", " + point.y + ")");
    return { found: true, x: point.x, y: point.y };
  } else {
    log.warning("❌ Image NOT found: " + imageName);
    return { found: false };
  }
}

function findImageAndClick(imageName, log) {
  var imagePath = IMG_PATH + imageName;
  var template = loadImageDirect(imagePath, log);
  if (!template) {
    log.error("❌ Failed to load template image: " + imageName);
    return { found: false };
  }

  var screen = getScreen(log);
  if (!screen) {
    template.recycle();
    return { found: false };
  }

  var point = images.findImage(screen, template, { threshold: 0.8 });
  screen.recycle();
  template.recycle();

  if (point) {
    log.success("✅ Image found at: (" + point.x + ", " + point.y + ")");
    click(point.x, point.y);
    return { found: true, x: point.x, y: point.y };
  } else {
    log.warning("❌ Image NOT found: " + imageName);
    return { found: false };
  }
}

/**
 * Find and click image if found
 * @param {String} imageName - Image file name
 * @param {Object} log - Logger object
 */
function findAndClick(imageName, log) {
  var result = findImageAny(imageName, log);
  if (result.found) {
    click(result.x, result.y);
    return true;
  }
  return false;
}

/**
 * Check if image exists on screen (quick check)
 * @param {String} imageName - Image file name
 * @param {Object} log - Logger object
 */
function imageExists(imageName, log) {
  var result = findImageAny(imageName, log);
  return result.found;
}

module.exports = {
  getScreen: getScreen,
  findImageAny: findImageAny,
  findAndClick: findAndClick,
  imageExists: imageExists,
  findImageAndClick: findImageAndClick,
};
