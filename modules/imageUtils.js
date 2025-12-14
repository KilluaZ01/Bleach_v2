/**
 * =========================================================================
 * IMAGE UTILITIES MODULE [FIXED]
 * =========================================================================
 * FIXED: All functions now properly handle logger parameter
 * Handles image loading, caching, and preloading
 */

var config = require("./config.js");
var IMG_PATH = config.IMG_PATH;

// Image cache storage
var imageCache = {};

/**
 * Load and cache image from filesystem
 * Automatically tries normal, blur, and dim variants
 * @param {String} imageName - Image file name
 * @param {Object} log - Logger object (optional for silent mode)
 * @returns {Image} Image object or null
 */
function loadImage(imageName, log) {
  // Check cache first
  if (imageCache[imageName]) {
    return imageCache[imageName];
  }

  // Try to load image variants in priority order
  var variants = [
    imageName,
    imageName.replace(".png", "_blur.png"),
    imageName.replace(".png", "_dim.png"),
  ];

  for (var i = 0; i < variants.length; i++) {
    var variant = variants[i];
    // Try different folder structures
    var paths = [
      IMG_PATH + variant,
      IMG_PATH + "tutorial/" + variant,
      IMG_PATH + "rewards/" + variant,
      IMG_PATH + "popups/" + variant,
      IMG_PATH + "gameplay/" + variant,
      IMG_PATH + "errors/" + variant,
    ];

    for (var j = 0; j < paths.length; j++) {
      var path = paths[j];
      if (files.exists(path)) {
        try {
          var img = images.read(path);
          if (img) {
            imageCache[imageName] = img;
            if (log) log.info("Loaded image: " + variant);
            return img;
          }
        } catch (e) {
          if (log) log.warning("Failed to load " + path + ": " + e.message);
        }
      }
    }
  }

  if (log)
    log.error(
      "Image not found: " + imageName + " (tried all variants & folders)"
    );
  return null;
}

/**
 * Load image directly from given path, without caching
 * @param {String} imagePath - Full image file path
 * @param {Object} log - Logger object (optional for silent mode)
 * @returns {Image} Image object or null
 */
function loadImageDirect(imagePath, log) {
  try {
    if (files.exists(imagePath)) {
      var img = images.read(imagePath);
      if (img) {
        if (log) log.info("Loaded image: " + imagePath);
        return img;
      }
    }
    if (log) log.error("Image not found: " + imagePath);
  } catch (e) {
    if (log) log.warning("Failed to load " + imagePath + ": " + e.message);
  }
  return null;
}

/**
 * Preload all common images at startup
 * @param {Object} log - Logger object
 */

function preloadImages(log) {
  log.info("Preloading images...");

  var commonImages = [
    "play_search_icon.png",
    "play_search_input.png",
    "game_card.png",
    "play_install_button.png",
    "play_okay_button.png",
    // "btn_start.png",
    // "btn_skip.png",
    // "btn_confirm.png",
    // "btn_ok.png",
    // "icon_mail.png",
    // "icon_mail_notify.png",
    // "btn_claim_all.png",
    // "btn_claim.png",
    // "icon_gift.png",
    // "icon_event.png",
    // "btn_close_x.png",
    // "btn_close_x_dark.png",
    // "btn_cancel.png",
    // "joystick_base.png",
    // "btn_attack.png",
    // "btn_skill_1.png",
    // "btn_skill_2.png",
    // "btn_skill_3.png",
    // "icon_auto_battle_off.png",
    // "icon_auto_battle_on.png",
    // "text_network_error.png",
    // "btn_retry.png",
    // "loading_icon.png",
    // "menu_icon.png",
    // "btn_back.png",
    // "icon_quest.png",
  ];

  var loadedCount = 0;
  for (var i = 0; i < commonImages.length; i++) {
    var imgName = commonImages[i];
    if (loadImage(imgName, log)) loadedCount++;
  }

  log.success(
    "Preloaded " + loadedCount + "/" + commonImages.length + " images"
  );
}

/**
 * Clear image cache and recycle all images
 * @param {Object} log - Logger object
 */
function clearImageCache(log) {
  if (log) log.info("Clearing image cache...");

  var keys = Object.keys(imageCache);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var img = imageCache[key];
    try {
      if (img) img.recycle();
    } catch (e) {
      // Ignore errors during cleanup
    }
  }

  imageCache = {};
}

module.exports = {
  loadImage: loadImage,
  loadImageDirect: loadImageDirect,
  preloadImages: preloadImages,
  clearImageCache: clearImageCache,
};
