/**
 * Fake N/runtime module
 * Simulates script runtime info
 */

let governanceLimit = 10000;
const javaBridge = require("../api/java.utils")

module.exports = {
    getCurrentScript: () => ({
        id: 'sample_script_id',
        deploymentId: '1',
        getRemainingUsage: () => governanceLimit,
        getParameter: (name) => {
            const Params = {
                custscript_demo_flag: true,
                custscript_max_records: 100
            };
            return Params[name];
        }
    }),
    getGovernanceLimit: () => governanceLimit,
    setGovernanceLimit: (limit) => { governanceLimit = limit; },
    sendEmail : () => javaBridge.generateReport(`LoadFile-${filePath}`)
};
