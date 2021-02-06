export function easeInOut(t, amt=2) {
    let tPow = Math.pow(t, amt);
    return tPow / (tPow + Math.pow(1 - t, amt));
}

export function sinEaseInOut(t) {
    return 0.5 - 0.5 * Math.cos(Math.PI * t);
}

export function loop(t) {
    return 0.5 - 0.5 * Math.cos(Math.PI * 2 * t);
}

export function slurp(val1, val2, amt) {
    return (val2 - val1) * amt + val1;
}

export function experp(val1, val2, amt) {
    return Math.exp(
        slurp(
            Math.log(val1),
            Math.log(val2),
            amt
        )
    )
}

export function clampedSlurp(val1, val2, amt) {
    if (amt < 0) {
        return val1;
    }
    if (amt > 1) {
        return val2;
    }
    return slurp(val1, val2, amt);
}

export function clamp(amt, val1, val2) {
    if (amt < val1) {
        return val1;
    }
    if (amt > val2) {
        return val2;
    }
    return amt;
}

/**
 * Extracts a 0-1 interval from a section of a 0-1 interval
 *
 * For example, if min == 0.3 and max == 0.7, you get:
 *
 *           0.3  0.7
 *     t: 0 --+----+-- 1
 *           /      \
 *          /        \
 *         /          \
 *     -> 0 ---------- 1
 *
 * Useful for making sub animations.
 *
 * Doesn't do any clamping, so you might want to clamp yourself.
 */
export function divideInterval(t, min, max) {
    return (t - min) / (max - min);
}

/**
 * Extracts a 0-1 interval from a section of a 0-1 interval
 *
 * For example, if min == 0.3 and max == 0.7, you get:
 *
 *           0.3  0.7
 *     t: 0 --+----+-- 1
 *           /      \
 *          /        \
 *         /          \
 *     -> 0 ---------- 1
 *
 * Useful for making sub animations.
 *
 * Doesn't do any clamping, so you might want to clamp yourself.
 *
 * Equivalent to divideInterval, I just prefer this name.
 */
export function splitInternal(t, min, max) {
    divideInterval(t, min, max);
}

/**
 * Like splitInterval, but with clamping.
 */
export function clampedSplitInternal(t, min, max) {
    return clamp(splitInternal(t, min, max), 0, 1);
}

export function rgb(r, g, b) {
    return 'rgb('+r+','+g+','+b+')';
}

export function gray(whiteAmt) {
    whiteAmt = clamp(whiteAmt, 0, 1);
    const whiteRgb = Math.floor(255 * whiteAmt);
    return rgb(whiteRgb, whiteRgb, whiteRgb);
}

// Pseudo-random number generator functions
// From stack overflow: https://stackoverflow.com/a/47593316
function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

// Just using a simple 32-bit random number generator, our numbers don't need to be too random.
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

/**
 * @param {string} seed What ya seed it with.
 * @returns {function():number} A wonderful seeded random number generator.
 */
export function seededRandom(seed) {
    const seedFn = xmur3(seed);
    return mulberry32(seedFn());
}
