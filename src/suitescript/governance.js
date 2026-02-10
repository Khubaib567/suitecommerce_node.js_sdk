/**
 * -------------------------------------------------------
 * Fake NetSuite Governance Module
 * -------------------------------------------------------
 * Simulates NetSuite governance limits for scripts
 * (Usage Units, script type limits, throttling, logging)
 *
 * Location: src/fake-netsuite/governance.js
 * -------------------------------------------------------
 */

const runtime = require('./N-runtime');
const log = require('./N-log');
const javaBridge = require("../api/java.utils")

/**
 * Default governance configuration
 * Customize based on suiteapp.json -> fakePlatform.governanceLimit
 */
const GOVERNANCE_LIMIT = runtime.getGovernanceLimit ? runtime.getGovernanceLimit() : 10000;

class Governance {
  constructor() {
    this.remainingUsage = GOVERNANCE_LIMIT;
    this.thresholdWarn = Math.floor(GOVERNANCE_LIMIT * 0.1); // 10% warning
  }

  /**
   * Consume governance units
   * @param {number} units
   */
  consume(units = 1) {
    this.remainingUsage -= units;

    if (this.remainingUsage < 0) {
      throw new Error('[Governance] Script usage exceeded the limit!');
    }

    if (this.remainingUsage <= this.thresholdWarn) {
      log.warn('governance.js', `Approaching governance limit: ${this.remainingUsage} units left`);
      javaBridge.generateReport(`LoadFile-${filePath}`)
      
    
    }

    return this.remainingUsage;
  }

  /**
   * Reset usage counter
   */
  reset() {
    this.remainingUsage = GOVERNANCE_LIMIT;
    log.debug('governance.js', 'Governance usage reset');
    javaBridge.generateReport(`LoadFile-${filePath}`)

  }

  /**
   * Returns remaining governance units
   */
  getRemainingUsage() {
    return this.remainingUsage;
  }

  /**
   * Wrap an async function to auto-check governance
   * @param {Function} fn
   */
  async wrapAsync(fn) {
    if (typeof fn !== 'function') throw new TypeError('wrapAsync expects a function');
    return async (...args) => {
      // Consume 1 unit per function call by default
      this.consume(1);
      return await fn(...args);
    };
  }

  /**
   * Wrap a sync function to auto-check governance
   * @param {Function} fn
   */
  wrapSync(fn) {
    if (typeof fn !== 'function') throw new TypeError('wrapSync expects a function');
    return (...args) => {
      this.consume(1);
      return fn(...args);
    };
  }
}

/**
 * Export a singleton
 */
module.exports = new Governance();
