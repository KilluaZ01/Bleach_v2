/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🖼️ IMAGE UTILITIES MODULE [FIXED]
 * ═══════════════════════════════════════════════════════════════════════
 * ✅ FIXED: All functions now properly handle logger parameter
 * Handles image loading, caching, and preloading
 */

const { IMG_PATH } = require("./config.js");

// Image cache storage
let imageCache = {};

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
  const variants = [
    imageName,
    imageName.replace(".png", "_blur.png"),
    imageName.replace(".png", "_dim.png"),
  ];

  for (let variant of variants) {
    // Try different folder structures
    const paths = [
      IMG_PATH + variant,
      IMG_PATH + "tutorial/" + variant,
      IMG_PATH + "rewards/" + variant,
      IMG_PATH + "popups/" + variant,
      IMG_PATH + "gameplay/" + variant,
      IMG_PATH + "errors/" + variant,
    ];

    for (let path of paths) {
      if (files.exists(path)) {
        try {
          const img = images.read(path);
          if (img) {
            imageCache[imageName] = img;
            if (log) log.info(`Loaded image: ${variant}`);
            return img;
          }
        } catch (e) {
          if (log) log.warning(`Failed to load ${path}: ${e.message}`);
        }
      }
    }
  }

  if (log)
    log.error(`Image not found: ${imageName} (tried all variants & folders)`);
  return null;
}

/**
 * Preload all common images at startup
 * @param {Object} log - Logger object
 */
function preloadImages(log) {
  log.info("Preloading images...");

  const commonImages = [
    "btn_start.png",
    "btn_skip.png",
    "btn_confirm.png",
    "btn_ok.png",
    "icon_mail.png",
    "icon_mail_notify.png",
    "btn_claim_all.png",
    "btn_claim.png",
    "icon_gift.png",
    "icon_event.png",
    "btn_close_x.png",
    "btn_close_x_dark.png",
    "btn_cancel.png",
    "joystick_base.png",
    "btn_attack.png",
    "btn_skill_1.png",
    "btn_skill_2.png",
    "btn_skill_3.png",
    "icon_auto_battle_off.png",
    "icon_auto_battle_on.png",
    "text_network_error.png",
    "btn_retry.png",
    "loading_icon.png",
    "menu_icon.png",
    "btn_back.png",
    "icon_quest.png",
  ];

  let loadedCount = 0;
  commonImages.forEach((imgName) => {
    if (loadImage(imgName, log)) loadedCount++;
  });

  log.success(`Preloaded ${loadedCount}/${commonImages.length} images`);
}

/**
 * Clear image cache and recycle all images
 * @param {Object} log - Logger object
 */
function clearImageCache(log) {
  if (log) log.info("Clearing image cache...");

  Object.values(imageCache).forEach((img) => {
    try {
      if (img) img.recycle();
    } catch (e) {
      // Ignore errors during cleanup
    }
  });

  imageCache = {};
}

module.exports = {
  loadImage,
  preloadImages,
  clearImageCache,
};
