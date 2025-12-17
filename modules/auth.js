/**
 * =========================================================================
 * AUTH MODULE [UPDATED FOR DEBUGGING]
 * =========================================================================
 * Added detailed logging to debug where the bot gets stuck
 */

var detection = require("./detection");
var findImageAndClick = detection.findImageAndClick;
var imageExists = detection.imageExists;
var humanization = require("./humanization");
var randomSleep = humanization.randomSleep;

var PLAY_STORE_PKG = "com.android.vending";
var GAME_PKG_NAME = "com.bleach.apj";

/**
 * Uninstall game (if exists), open Play Store,
 * and navigate to game install page using image detection
 * @param {Object} logger - Logger object with info/success/error/warning methods
 * @param {String} gamePkgName - Game package name
 * @param {Function} updateLastAction - Callback to update last action time
 */
function downloadGame(logger, gamePkgName, updateLastAction) {
  if (gamePkgName === undefined) {
    gamePkgName = GAME_PKG_NAME;
  }

  logger.info("Preparing fresh game install");

  // 1. Uninstall if already installed
  if (app.getAppName(gamePkgName)) {
    logger.info("Game already installed, uninstalling...");
    app.uninstall(gamePkgName);
    randomSleep(2000, 2500);

    click(583, 770);
    randomSleep(2000); // Okay for uninstall

    // Wait until uninstall completes
    var timeout = Date.now() + 60000;
    while (app.getAppName(gamePkgName)) {
      randomSleep(1000, 1500);
      if (Date.now() > timeout) {
        throw new Error("Uninstall timeout");
      }
    }
    logger.success("Uninstall complete");
  }

  randomSleep(1500, 2500);

  // 2. Launch Play Store
  logger.info("Opening Play Store");
  app.launchPackage(PLAY_STORE_PKG);
  randomSleep(8000);

  // 3. Navigate Play Store UI
  navigatePlayStore(logger, gamePkgName, updateLastAction);
}

/**
 * Handles Play Store UI flow
 * @param {Object} logger - Logger object
 * @param {String} gamePkgName - Game package name
 * @param {Function} updateLastAction - Callback to update last action time
 */
function navigatePlayStore(logger, gamePkgName, updateLastAction) {
  if (gamePkgName === undefined) {
    gamePkgName = GAME_PKG_NAME;
  }

  logger.info("Navigating Play Store UI");

  // Search icon
  logger.info("Checking for search icon...");
  if (imageExists("play_search_icon.png", logger)) {
    logger.info("Search icon found, clicking...");
    findImageAndClick("play_search_icon.png", logger);
    randomSleep(2500);
  } else {
    logger.warning("Search icon not found");
  }

  // Search input field
  logger.info("Checking for search input field...");
  if (imageExists("play_search_input.png", logger)) {
    logger.info("Search input field found, clicking...");
    findImageAndClick("play_search_input.png", logger);
    randomSleep(6000);

    // Type game name (not pkg name)
    logger.info("Typing game name...");
    setText("Bleach Soul Resonance");
    randomSleep(1200);
    click(670, 1230);
    randomSleep(5000);
  } else {
    logger.warning("Search input field not found");
  }

  randomSleep(5000);

  // Select game from results
  logger.info("Checking for game card in search results...");
  if (imageExists("game_card.png", logger)) {
    logger.info("Game card found, clicking...");
    findImageAndClick("game_card.png", logger);
    randomSleep(4000);
  } else {
    logger.warning("Game card not found in search results");
  }

  // Install button
  logger.info("Checking for install button...");
  if (imageExists("play_install_button.png", logger)) {
    logger.info("Install button found, clicking...");
    findImageAndClick("play_install_button.png", logger);
    randomSleep(4000);
  } else {
    logger.warning("Install button not found");
  }

  logger.info("Checking for okay button...");
  if (imageExists("play_okay_button.png", logger)) {
    logger.info("Okay button found, clicking...");
    findImageAndClick("play_okay_button.png", logger);
    randomSleep(3000);
  } else {
    logger.warning("Okay button not found");
  }

  waitForInstall(logger);
}

/**
 * Wait until install completes
 * @param {Object} logger - Logger object
 */
function waitForInstall(logger) {
  logger.info("Waiting for installation");

  var timeout = Date.now() + 10 * 80000; // 10 min max

  while (true) {
    logger.info("Checking for open button...");
    if (imageExists("open_button.png", logger)) {
      logger.success("Game installed");
      launchApp("BLEACH: Soul Resonance");
      sleep(70000); // Wait for initial load
      return;
    }

    if (Date.now() > timeout) {
      throw new Error("Install timeout");
    }

    sleep(80000);
  }
}

/**
 * Handle authentication flow (guest login, terms, etc.)
 * @param {Object} logger - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function handleAuth(logger, updateLastAction) {
  logger.info("Checking login / guest state");

  logger.info("Checking for terms accept button...");
  click(286, 329);
  randomSleep(4000);

  click(286, 386);
  randomSleep(4000);

  click(642, 487);
  randomSleep(10000);

  click(640, 530);
  randomSleep(820000);

  logger.info("Checking close button...");
  for (var i = 0; i < 5; i++) {
    if (imageExists("close_button.png", logger)) {
      logger.info("Close button found, clicking...");
      findImageAndClick("close_button.png", logger);
      randomSleep(5000);
      break;
    } else {
      logger.warning("Guest login button not found");
      randomSleep(30000);
    }
  }

  // Guest Account
  click(764, 620);
  randomSleep(25000);

  // Start Game
  click(645, 653);
  randomSleep(40000);
  logger.success("Auth phase complete");
}

module.exports = {
  downloadGame: downloadGame,
  handleAuth: handleAuth,
};
