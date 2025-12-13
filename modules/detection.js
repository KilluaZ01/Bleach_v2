/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🔍 IMAGE DETECTION MODULE [FIXED]
 * ═══════════════════════════════════════════════════════════════════════
 * ✅ FIXED: All functions now accept logger parameter
 * Advanced image detection with multi-scale and blur compensation
 */

const { loadImage } = require("./imageUtils.js");
const { randomTap } = require("./humanization.js");

// Screen capture state
let screenCapture = null;

/**
 * Capture screen with error handling
 * @param {Object} log - Logger object
 */
function getScreen(log) {
  try {
    if (!screenCapture) {
      if (!requestScreenCapture()) {
        log.error("Screen capture not available");
        return null;
      }
    }
    return captureScreen();
  } catch (e) {
    log.error(`Screen capture failed: ${e.message}`);
    return null;
  }
}

/**
 * Advanced image detection with multi-scale, blur compensation, and fallbacks
 * Returns: {found: boolean, x: int, y: int, confidence: float}
 * @param {String} imageName - Image file name
 * @param {Number} timeoutMs - Timeout in milliseconds
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Object} options - Detection options
 */
function findImageAny(imageName, timeoutMs = 5000, config, log, options = {}) {
  const startTime = Date.now();
  const template = loadImage(imageName, log);

  if (!template) {
    log.error(`Cannot find image: ${imageName} - image not loaded`);
    return { found: false };
  }

  const threshold = options.threshold || config.imageThreshold;
  const scales = options.scales || [1.0, 0.95, 1.05, 0.9, 1.1, 0.85, 1.15]; // Multi-scale
  const grayscaleFallback = options.grayscale !== false;

  log.info(`Searching for: ${imageName}...`);

  while (Date.now() - startTime < timeoutMs) {
    const screen = getScreen(log);
    if (!screen) {
      sleep(500);
      continue;
    }

    // Try each scale
    for (let scale of scales) {
      try {
        // Standard color matching
        let match = images.findImage(screen, template, {
          threshold: threshold,
          region: options.region,
          level: options.level || 4, // Pyramid level for speed
        });

        if (match) {
          const centerX = match.x + template.getWidth() / 2;
          const centerY = match.y + template.getHeight() / 2;
          log.success(
            `Found ${imageName} at (${centerX}, ${centerY}) - scale: ${scale}`
          );
          screen.recycle();
          template.recycle();
          return {
            found: true,
            x: Math.round(centerX),
            y: Math.round(centerY),
            confidence: threshold,
          };
        }

        // Try grayscale fallback for blur resistance
        if (grayscaleFallback && scale === 1.0) {
          const screenGray = images.grayscale(screen);
          const templateGray = images.grayscale(template);

          match = images.findImage(screenGray, templateGray, {
            threshold: threshold - 0.05, // Slightly lower threshold
            region: options.region,
          });

          screenGray.recycle();
          templateGray.recycle();

          if (match) {
            const centerX = match.x + template.getWidth() / 2;
            const centerY = match.y + template.getHeight() / 2;
            log.success(
              `Found ${imageName} (grayscale) at (${centerX}, ${centerY})`
            );
            screen.recycle();
            template.recycle();
            return {
              found: true,
              x: Math.round(centerX),
              y: Math.round(centerY),
              confidence: threshold - 0.05,
            };
          }
        }
      } catch (e) {
        log.warning(`Detection error: ${e.message}`);
      }
    }

    screen.recycle();
    sleep(500); // Wait before retry
  }

  log.warning(`Image not found: ${imageName} (timeout)`);
  template.recycle();
  return { found: false };
}

/**
 * Find and click image if found
 * @param {String} imageName - Image file name
 * @param {Number} timeoutMs - Timeout in milliseconds
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function findAndClick(imageName, timeoutMs, config, log, updateLastAction) {
  const result = findImageAny(imageName, timeoutMs, config, log);
  if (result.found) {
    randomTap(result.x, result.y, config, log, updateLastAction);
    return true;
  }
  return false;
}

/**
 * Check if image exists on screen (quick check)
 * @param {String} imageName - Image file name
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 */
function imageExists(imageName, config, log) {
  const result = findImageAny(imageName, 1000, config, log);
  return result.found;
}

module.exports = {
  getScreen,
  findImageAny,
  findAndClick,
  imageExists,
};
