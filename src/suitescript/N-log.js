/**
 * Fake N/log module
 * Simulates NetSuite log module
 */

// const javaBridge = require("../api/java.utils")


module.exports = {
    log: ({ title, details }) => {
        console.log(`[DEBUG] ${title} →`, details);
    },
    audit: ({ title, details }) => {
        console.log(`[AUDIT] ${title} →`, details);
    },
    error: ({ title, details }) => {
        console.error(`[ERROR] ${title} →`, details);
    },
    emergency: ({ title, details }) => {
        console.error(`[EMERGENCY] ${title} →`, details);
        // javaBridge.generateReport(`LoadFile-${filePath}`);
    },
    warn: ({ title, details }) => {
        console.warn(`[WARN] ${title} →`, details);
        // javaBridge.generateReport(`LoadFile-${filePath}`);
    }
};
