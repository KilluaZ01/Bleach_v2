/**
 * =========================================================================
 * POPUP HANDLER MODULE [FIXED]
 * =========================================================================
 * FIXED: All functions now accept logger parameter
 * Close popups and ads automatically
 */

var detection = require("./detection.js");
var findAndClick = detection.findAndClick;
var imageExists = detection.imageExists;
var humanization = require("./humanization.js");
var randomSleep = humanization.randomSleep;

/**
 * Close any popups or ads
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function closePopups(config, log, updateLastAction) {
  log.info("Checking for popups/ads...");

  var closeButtons = [
    "btn_close_x.png",
    "btn_close_x_dark.png",
    "btn_cancel.png",
  ];

  var closed = false;
  for (var i = 0; i < closeButtons.length; i++) {
    var btn = closeButtons[i];
    if (findAndClick(btn, 1500, config, log, updateLastAction)) {
      log.success("Closed popup with " + btn);
      closed = true;
      randomSleep(1000);
      break;
    }
  }

  // Try back button as fallback
  if (!closed && imageExists("popup_background.png", config, log)) {
    back();
    log.info("Closed popup with back button");
    randomSleep(1000);
  }
}

module.exports = {
  closePopups: closePopups,
};
