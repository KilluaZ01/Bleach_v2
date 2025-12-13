/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🎲 HUMANIZATION MODULE
 * ═══════════════════════════════════════════════════════════════════════
 * Provides random behavior to mimic human actions
 */

/**
 * Random number in range
 */
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random sleep with variance
 */
function randomSleep(baseMs, varianceMs = 200) {
  const sleepTime = baseMs + randomRange(-varianceMs, varianceMs);
  sleep(Math.max(100, sleepTime));
}

/**
 * Human-like tap with random offset
 */
function randomTap(x, y, config, log, updateLastAction) {
  const offsetRange = 15;
  const tapX = x + randomRange(-offsetRange, offsetRange);
  const tapY = y + randomRange(-offsetRange, offsetRange);

  // Random tap duration for realism
  const duration = randomRange(50, 150);
  press(tapX, tapY, duration);

  log.info(`Tapped at (${tapX}, ${tapY})`);
  updateLastAction();
  randomSleep(randomRange(config.tapDelay[0], config.tapDelay[1]));
}

/**
 * Human-like swipe gesture
 */
function randomSwipe(x1, y1, x2, y2, log, updateLastAction) {
  const duration = randomRange(300, 600);
  swipe(x1, y1, x2, y2, duration);
  log.info(`Swiped from (${x1}, ${y1}) to (${x2}, ${y2})`);
  updateLastAction();
  randomSleep(500);
}

module.exports = {
  randomRange,
  randomSleep,
  randomTap,
  randomSwipe,
};
