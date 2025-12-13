/**
 * ═══════════════════════════════════════════════════════════════════════
 * 📬 REWARDS MODULE [FIXED]
 * ═══════════════════════════════════════════════════════════════════════
 * ✅ FIXED: All functions now accept logger parameter
 * Auto-claim mail, daily rewards, and events
 */

const { findAndClick } = require("./detection.js");
const { randomSleep } = require("./humanization.js");

/**
 * Claim mail rewards
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function claimMailRewards(config, log, updateLastAction) {
  if (!config.claimMail) return;

  log.info("📬 Checking mail rewards...");

  // Find and click mail icon
  if (
    findAndClick("icon_mail.png", 3000, config, log, updateLastAction) ||
    findAndClick("icon_mail_notify.png", 3000, config, log, updateLastAction)
  ) {
    randomSleep(2000, 500);

    // Try to claim all
    if (
      findAndClick("btn_claim_all.png", 3000, config, log, updateLastAction)
    ) {
      log.success("Claimed all mail rewards!");
      randomSleep(1500);

      // Confirm if needed
      findAndClick("btn_confirm.png", 2000, config, log, updateLastAction);
      randomSleep(1000);
    } else {
      // Try individual claim buttons
      let claimed = 0;
      for (let i = 0; i < 5; i++) {
        if (
          findAndClick("btn_claim.png", 1500, config, log, updateLastAction)
        ) {
          claimed++;
          randomSleep(1000);
        }
      }
      if (claimed > 0) {
        log.success(`Claimed ${claimed} mail rewards individually`);
      }
    }

    // Close mail screen
    back();
    randomSleep(1000);
  } else {
    log.info("No mail icon found");
  }
}

/**
 * Claim daily/login rewards
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function claimDailyRewards(config, log, updateLastAction) {
  if (!config.claimDaily) return;

  log.info("🎁 Checking daily rewards...");

  // Find and click gift/event icons
  const icons = ["icon_gift.png", "icon_event.png"];

  for (let icon of icons) {
    if (findAndClick(icon, 3000, config, log, updateLastAction)) {
      randomSleep(2000, 500);

      // Try to claim
      if (
        findAndClick("btn_claim.png", 3000, config, log, updateLastAction) ||
        findAndClick("btn_claim_all.png", 3000, config, log, updateLastAction)
      ) {
        log.success(`Claimed from ${icon}`);
        randomSleep(1500);
        findAndClick("btn_confirm.png", 2000, config, log, updateLastAction);
        randomSleep(1000);
      }

      // Close screen
      back();
      randomSleep(1000);
    }
  }
}

/**
 * Claim all available rewards in one pass
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function claimAllRewards(config, log, updateLastAction) {
  log.info("💰 Starting reward claim cycle...");
  claimMailRewards(config, log, updateLastAction);
  claimDailyRewards(config, log, updateLastAction);
  log.info("Reward claim cycle complete");
}

module.exports = {
  claimMailRewards,
  claimDailyRewards,
  claimAllRewards,
};
