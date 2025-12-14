/**
 * =========================================================================
 * HUMANIZATION MODULE
 * =========================================================================
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
 * (ES5-safe: no default params)
 */
function randomSleep(minMs, maxMs) {
  if (maxMs === undefined) {
    maxMs = minMs;
  }

  if (minMs > maxMs) {
    var temp = minMs;
    minMs = maxMs;
    maxMs = temp;
  }

  sleep(random(minMs, maxMs));
}

/**
 * Human-like tap with random offset
 */
function randomTap(x, y, config, log, updateLastAction) {
  var offsetRange = 15;
  var tapX = x + randomRange(-offsetRange, offsetRange);
  var tapY = y + randomRange(-offsetRange, offsetRange);

  // Random tap duration for realism
  var duration = randomRange(50, 150);
  press(tapX, tapY, duration);

  if (log && log.info) {
    log.info("Tapped at (" + tapX + ", " + tapY + ")");
  }

  if (updateLastAction) {
    updateLastAction();
  }

  randomSleep(randomRange(config.tapDelay[0], config.tapDelay[1]));
}

/**
 * Human-like swipe gesture
 */
function randomSwipe(x1, y1, x2, y2, log, updateLastAction) {
  var duration = randomRange(300, 600);
  swipe(x1, y1, x2, y2, duration);

  if (log && log.info) {
    log.info(
      "Swiped from (" + x1 + ", " + y1 + ") to (" + x2 + ", " + y2 + ")"
    );
  }

  if (updateLastAction) {
    updateLastAction();
  }

  randomSleep(500);
}

module.exports = {
  randomRange: randomRange,
  randomSleep: randomSleep,
  randomTap: randomTap,
  randomSwipe: randomSwipe,
};
