/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🗺️ EXPLORATION MODULE [FIXED]
 * ═══════════════════════════════════════════════════════════════════════
 * ✅ FIXED: All functions now accept logger parameter
 * Auto-exploration with joystick movement and resource collection
 */

const { findImageAny, findAndClick } = require("./detection.js");
const { randomRange, randomSleep } = require("./humanization.js");

/**
 * Simulate joystick movement for exploration
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function autoExplore(config, log, updateLastAction) {
  if (!config.autoExplore) return;

  log.info("🗺️ Auto-exploring world...");

  // Find joystick base position (usually bottom-left)
  const joystickResult = findImageAny("joystick_base.png", 2000, config, log);
  let joystickX = 120; // Default position
  let joystickY = device.height - 180;

  if (joystickResult.found) {
    joystickX = joystickResult.x;
    joystickY = joystickResult.y;
    log.info(`Joystick detected at (${joystickX}, ${joystickY})`);
  } else {
    log.warning("Joystick not found, using default position");
  }

  // Random direction movement
  const directions = [
    { name: "up", dx: 0, dy: -60 },
    { name: "down", dx: 0, dy: 60 },
    { name: "left", dx: -60, dy: 0 },
    { name: "right", dx: 60, dy: 0 },
    { name: "up-right", dx: 45, dy: -45 },
    { name: "up-left", dx: -45, dy: -45 },
    { name: "down-right", dx: 45, dy: 45 },
    { name: "down-left", dx: -45, dy: 45 },
  ];

  const direction = directions[randomRange(0, directions.length - 1)];
  const moveDuration = randomRange(
    config.exploreMoveDuration[0],
    config.exploreMoveDuration[1]
  );

  log.info(`Moving ${direction.name} for ${moveDuration}ms`);

  // Simulate joystick drag
  const endX = joystickX + direction.dx;
  const endY = joystickY + direction.dy;

  // Long press to simulate continuous movement
  press(joystickX, joystickY, 100);
  randomSleep(50);
  swipe(joystickX, joystickY, endX, endY, moveDuration);

  updateLastAction();
}

/**
 * Collect resources if found on screen
 * @param {Object} config - Bot configuration
 * @param {Object} log - Logger object
 * @param {Function} updateLastAction - Callback to update last action time
 */
function collectResources(config, log, updateLastAction) {
  log.info("⛏️ Checking for collectible resources...");

  if (
    findAndClick(
      "btn_collect_resources.png",
      2000,
      config,
      log,
      updateLastAction
    )
  ) {
    log.success("Collected resources!");
    randomSleep(1500);
    findAndClick("btn_confirm.png", 1500, config, log, updateLastAction);
  }
}

module.exports = {
  autoExplore,
  collectResources,
};
