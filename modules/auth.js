/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🔐 AUTH MODULE [FIXED]
 * ═══════════════════════════════════════════════════════════════════════
 * ✅ FIXED: Removed global 'log' dependency - now accepts logger as param
 */

const { findAndClick, imageExists } = require("./detection");
const { randomSleep } = require("./humanization");

const PLAY_STORE_PKG = "com.android.vending";
const GAME_PKG_NAME = "com.bladetw.bd";

/**
 * Uninstall game (if exists), open Play Store,
 * and navigate to game install page using image detection
 * @param {Object} logger - Logger object with info/success/error/warning methods
 * @param {String} gamePkgName - Game package name
 */
function downloadGame(logger, gamePkgName = GAME_PKG_NAME) {
  logger.info("⬇️ Preparing fresh game install");

  // 1️⃣ Uninstall if already installed
  if (app.isInstalled(gamePkgName)) {
    logger.info("🗑️ Game already installed, uninstalling...");
    app.uninstall(gamePkgName);

    // Wait until uninstall completes
    let timeout = Date.now() + 60_000;
    while (app.isInstalled(gamePkgName)) {
      sleep(1000);
      if (Date.now() > timeout) {
        throw new Error("❌ Uninstall timeout");
      }
    }
    logger.success("✅ Uninstall complete");
  }

  randomSleep(1500, 2500);

  // 2️⃣ Launch Play Store
  logger.info("🏪 Opening Play Store");
  app.launchPackage(PLAY_STORE_PKG);
  randomSleep(3000, 5000);

  // 3️⃣ Navigate Play Store UI
  navigatePlayStore(logger, gamePkgName);
}

/**
 * Handles Play Store UI flow
 * @param {Object} logger - Logger object
 * @param {String} gamePkgName - Game package name
 */
function navigatePlayStore(logger, gamePkgName = GAME_PKG_NAME) {
  logger.info("🔍 Navigating Play Store UI");

  // Accept Play Store dialogs
  if (imageExists("play_accept.png")) {
    findAndClick("play_accept.png");
    randomSleep(1000, 1500);
  }

  // Search icon
  if (imageExists("play_search_icon.png")) {
    findAndClick("play_search_icon.png");
    randomSleep(1000, 1500);
  }

  // Search input field
  if (imageExists("play_search_input.png")) {
    findAndClick("play_search_input.png");
    randomSleep(500, 800);

    // Type game name (not pkg name)
    setText("Your Game Name Here");
    randomSleep(800, 1200);
    press("enter");
  }

  randomSleep(3000, 5000);

  // Select game from results
  if (imageExists("game_card.png")) {
    findAndClick("game_card.png");
    randomSleep(3000, 4000);
  }

  // Install button
  if (imageExists("install_button.png")) {
    logger.info("⬇️ Installing game");
    findAndClick("install_button.png");
  }

  waitForInstall(logger);
}

/**
 * Wait until install completes
 * @param {Object} logger - Logger object
 */
function waitForInstall(logger) {
  logger.info("⏳ Waiting for installation");

  let timeout = Date.now() + 10 * 60_000; // 10 min max

  while (true) {
    if (imageExists("open_button.png")) {
      logger.success("✅ Game installed");
      return;
    }

    if (Date.now() > timeout) {
      throw new Error("❌ Install timeout");
    }

    sleep(5000);
  }
}

/**
 * Handle authentication flow (guest login, terms, etc.)
 * @param {Object} logger - Logger object
 */
function handleAuth(logger) {
  logger.info("🔐 Checking login / guest state");

  if (imageExists("terms_accept.png")) {
    findAndClick("terms_accept.png");
    randomSleep(800, 1200);
  }

  if (imageExists("guest_login.png")) {
    logger.info("👤 Selecting Guest Login");
    findAndClick("guest_login.png");
    randomSleep(1500, 2500);
  }

  if (imageExists("guest_confirm.png")) {
    findAndClick("guest_confirm.png");
    randomSleep(1500, 2500);
  }

  if (imageExists("server_confirm.png")) {
    findAndClick("server_confirm.png");
    randomSleep(1000, 1500);
  }

  logger.success("✅ Auth phase complete");
}

module.exports = {
  downloadGame,
  handleAuth,
};
