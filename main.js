/**
 * ==================================================================
 *  AutoX.js RPG/Open-World Game Bot - MAIN ORCHESTRATOR [FIXED]
 * ==================================================================
 *  [FIXED] CRITICAL FIXES:
 *    - NO auto-execution (module.exports pattern)
 *    - NO global variable redeclarations
 *    - Proper logger passing to all modules
 *    - Single worker thread model
 *    - Clean stop signal handling
 *    - Proper function scope separation
 * ==================================================================
 */

// =======================================================================
// IMPORTS (Loaded once, no re-execution)
// =======================================================================

// CRITICAL: Do NOT auto-execute anything at module level
// Wait for explicit startBot() call from launcher

// =======================================================================
// EXPORTED START FUNCTION (Called by launcher ONLY)
// =======================================================================

/**
 * Main bot entry point - called by launcher.js when START is pressed
 * @param {Object} userConfig - Configuration from UI
 * @param {Object} logger - Logger object with info/success/error/warning methods
 * @param {Object} storage - Storage object for stop signal
 */
module.exports.startBot = function (userConfig, logger, storage) {
  // CRITICAL FIX: Use passed logger, don't create global 'log'
  const log = logger;

  log.info("==========================================");
  log.info("  AutoX.js Game Bot Starting...");
  log.info("  Modular Architecture Loaded");
  log.info("==========================================");

  // =======================================================================
  // INITIALIZATION
  // =======================================================================

  // CRITICAL FIX: Import FIXED modules (or use original names if you renamed them)
  const { initConfig } = require("../AutoXBot/modules/config.js");
  const {
    preloadImages,
    clearImageCache,
  } = require("../AutoXBot/modules/imageUtils.js");

  const {
    randomSleep,
    randomRange,
  } = require("../AutoXBot/modules/humanization.js");
  const { runTutorialSkip } = require("../AutoXBot/modules/tutorial.js");
  const { claimAllRewards } = require("../AutoXBot/modules/rewards.js");
  const {
    autoExplore,
    collectResources,
    tapToTrack,
  } = require("../AutoXBot/modules/exploration.js");
  const {
    enableAutoBattle,
    combatRotation,
  } = require("../AutoXBot/modules/combat.js");
  const { closePopups } = require("../AutoXBot/modules/popups.js");
  const {
    checkForErrors,
    restartGame,
  } = require("../AutoXBot/modules/errors.js");
  const { startWatchdog } = require("../AutoXBot/modules/watchdog.js");
  const { downloadGame, handleAuth } = require("../AutoXBot/modules/auth.js");

  // Initialize configuration
  const CONFIG = initConfig(userConfig);

  // Runtime state
  let lastActionTime = Date.now();
  let botRunning = true;

  // =======================================================================
  // HELPER FUNCTIONS
  // =======================================================================

  /**
   * Update last action timestamp
   */
  function updateLastAction() {
    lastActionTime = Date.now();
  }

  /**
   * Get last action timestamp
   */
  function getLastActionTime() {
    return lastActionTime;
  }

  /**
   * Check if bot should stop (checks storage flag)
   */
  function shouldStop() {
    return storage.get("shouldStop", false);
  }

  /**
   * Check if bot is running
   */
  function isBotRunning() {
    return botRunning && !shouldStop();
  }

  // =======================================================================
  // MAIN INFINITE LOAOP
  // =======================================================================

  /**
   * Main bot loop - runs forever until stopped
   */
  function mainLoop() {
    log.info("Starting main bot loop...");

    let loopCount = 0;

    while (botRunning) {
      loopCount++;
      log.info(`============ LOOP #${loopCount} ============`);

      // CRITICAL: Check for stop signal FIRST
      if (shouldStop()) {
        log.warning("Stop signal received - exiting loop");
        botRunning = false;
        break;
      }

      try {
        // // Priority 1: Error recovery
        // if (checkForErrors(CONFIG, log, updateLastAction, lastActionTime)) {
        //   log.info("Recovered from error, continuing...");
        //   randomSleep(3000);
        //   continue;
        // }

        // // Check stop again after slow operation
        // if (shouldStop()) break;

        // // Priority 2: Close popups
        // closePopups(CONFIG, log, updateLastAction);
        // randomSleep(500);

        // // Check stop signal
        // if (shouldStop()) break;

        // Priority 3: Tutorial skip (if enabled)
        if (CONFIG.tutorialSkip) {
          runTutorialSkip(CONFIG, log, updateLastAction, shouldStop);
        }

        if (shouldStop()) break;

        // // Priority 4: Enable auto-battle
        // enableAutoBattle(CONFIG, log, updateLastAction);
        // randomSleep(500);

        // if (shouldStop()) break;

        // // Priority 5: Claim rewards
        // claimAllRewards(CONFIG, log, updateLastAction);
        // randomSleep(1000);

        // if (shouldStop()) break;

        // Priority 6: Exploration
        if (CONFIG.autoExplore) {
          autoExplore(CONFIG, log, updateLastAction);
          randomSleep(2000);
          tapToTrack(CONFIG, log, updateLastAction);
          randomSleep(2000);
        }

        if (shouldStop()) break;

        // Priority 7: Combat
        if (CONFIG.autoCombat) {
          combatRotation(CONFIG, log, updateLastAction);
          randomSleep(1000);
        }

        if (shouldStop()) break;

        // // Priority 8: Resource collection
        // collectResources(CONFIG, log, updateLastAction);
        // randomSleep(1000);

        // if (shouldStop()) break;

        // Slow mode extra delay
        if (CONFIG.slowMode) {
          log.info("Slow mode: extra delay");
          randomSleep(3000, 1000);
        }

        if (shouldStop()) break;

        // Loop delay with periodic stop checks
        const loopDelayMs = CONFIG.loopDelay * 60 * 1000; // Convert minutes to ms
        log.info(`Loop complete. Waiting ${CONFIG.loopDelay} minute(s)...`);

        // FIXED: Break long sleep into smaller chunks to check stop signal
        const chunkSize = 5000; // Check every 5 seconds
        let remainingDelay = loopDelayMs;
        while (remainingDelay > 0 && !shouldStop()) {
          sleep(Math.min(chunkSize, remainingDelay));
          remainingDelay -= chunkSize;
        }
      } catch (e) {
        log.error(`Loop error: ${e.message}`);
        log.error(`Stack: ${e.stack}`);
        randomSleep(5000);
      }
    }

    log.info("Bot stopped gracefully");
  }

  // =======================================================================
  // AUTH LOOP (FIXED: Proper function scope)
  // =======================================================================

  /**
   * Authentication loop - handles game download and login
   */
  function authLoop() {
    log.info("Starting auth loop...");

    let attempts = 0;
    const maxAttempts = 5;

    while (botRunning && !shouldStop() && attempts < maxAttempts) {
      attempts++;
      try {
        log.info(`Auth attempt ${attempts}/${maxAttempts}`);

        downloadGame(log);
        randomSleep(3000);

        if (shouldStop()) break;

        handleAuth(log);
        randomSleep(5000);

        log.success("Auth loop completed");
        break; // Success, exit auth loop
      } catch (e) {
        log.error(`Auth loop error: ${e.message}`);
        log.error(`Stack: ${e.stack}`);
        randomSleep(5000);
      }
    }

    if (attempts >= maxAttempts) {
      log.error("Auth failed after max attempts");
      botRunning = false;
    }
  }

  // =======================================================================
  // STARTUP & EXECUTION (FIXED: Proper function scope)
  // =======================================================================

  /**
   * Main execution function
   */
  function main() {
    try {
      // Preload images
      preloadImages(log);

      // Start watchdog thread
      startWatchdog(
        CONFIG,
        log,
        getLastActionTime,
        updateLastAction,
        isBotRunning
      );

      // Run auth loop first
      authLoop();

      // Check if we should continue
      if (shouldStop()) {
        log.warning("Stop signal received during auth");
        cleanup();
        return;
      }

      // Wait for game to be ready
      log.info("Waiting 5 seconds for game to be ready...");
      randomSleep(5000);

      if (shouldStop()) {
        log.warning("Stop signal received before main loop");
        cleanup();
        return;
      }

      // Start main loop
      mainLoop();

      // Cleanup
      cleanup();
    } catch (e) {
      log.error(`Fatal error: ${e.message}`);
      log.error(`Stack: ${e.stack}`);
      cleanup();
    }
  }

  /**
   * Cleanup function
   */
  function cleanup() {
    log.info("Cleaning up resources...");
    botRunning = false;
    clearImageCache(log);
    log.info("==========================================");
    log.info("  Bot execution complete");
    log.info("==========================================");
  }

  // =======================================================================
  // ENTRY POINT - Call main function
  // =======================================================================

  // Handle exit gracefully
  events.on("exit", function () {
    botRunning = false;
    log.info("Exit event received");
    clearImageCache(log);
  });

  // Start the bot
  main();
};

// =======================================================================
// [!] CRITICAL: NO CODE EXECUTION AT MODULE LEVEL
// =======================================================================
// This file is loaded as a module. It only exports the startBot function.
// Nothing executes until launcher.js explicitly calls startBot().
