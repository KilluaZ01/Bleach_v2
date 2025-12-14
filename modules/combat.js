/**
 * =========================================================================
 * COMBAT MODULE [FIXED]
 * =========================================================================
 * FIXED: Removed global log dependency - accepts logger param
 * Auto-combat with skill rotation and auto-battle
 */

var detection = require("./detection.js");
var imageExists = detection.imageExists;
var findAndClick = detection.findAndClick;
var humanization = require("./humanization.js");
var randomSleep = humanization.randomSleep;

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

/**
 * Perform manual combat rotation
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function combatRotation(config, log, updateLastAction) {
  if (!config.autoCombat) return;

  log.info("Executing combat rotation...");

  // Spam attack button
  for (var i = 0; i < 3; i++) {
    if (findAndClick("btn_attack.png", 1000, config, log, updateLastAction)) {
      randomSleep(300);
    }
  }

  // Use skills if available
  var skills = ["btn_skill_1.png", "btn_skill_2.png", "btn_skill_3.png"];
  for (var j = 0; j < skills.length; j++) {
    var skill = skills[j];
    if (findAndClick(skill, 1000, config, log, updateLastAction)) {
      randomSleep(500);
    }
  }

  updateLastAction();
}

module.exports = {
  enableAutoBattle: enableAutoBattle,
  combatRotation: combatRotation,
};
