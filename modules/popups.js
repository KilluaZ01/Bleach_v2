/**
 * =========================================================================
 * POPUP HANDLER MODULE [FIXED]
 * =========================================================================
 * FIXED: All functions now accept logger parameter
 * Close popups and ads automatically
 */

var detection = require("./detection.js");
var findImageAndClick = detection.findImageAndClick;
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
    "close_button.png",
    // "btn_close_x_dark.png",
    // "btn_cancel.png",
  ];

  var closed = false;
  for (var i = 0; i < closeButtons.length; i++) {
    var btn = closeButtons[i];
    if (findImageAndClick(btn, log)) {
      log.success("Closed popup with " + btn);
      closed = true;
      randomSleep(1000);
      break;
    }
  }

  // Try back button as fallback
  if (!closed && imageExists("close_button.png", config, log)) {
    back();
    log.info("Closed popup with back button");
    randomSleep(1000);
  }

  updateLastAction();
}

function closeRandomPopups(config, log, updateLastAction) {
  log.info("Checking for random popups...");

  if (findImageAndClick("lvl_up.png", log)) {
    log.info("Closed level up popup");
    click(630, 550);
    randomSleep(2000);
  }
  updateLastAction();
}

module.exports = {
  closePopups: closePopups,
  closeRandomPopups: closeRandomPopups,
};
