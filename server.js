const express = require('express');
const path = require('path');
// Import your specific module
// const customLog = require('./src/suitescript/N-log'); 

const app = express();
const logStore = [];

global.define = (dependencies, callback) => {
    // This assumes order of dependencies matches the parameters in the ClientScript
    // Dependencies: ['N/search', 'N/ui/dialog', 'governance']
    const search = require('./src/suitescript/N-search'); 
    const dialog = require('./src/suitescript//N-dialog');
    const governance = require('./src/suitescript/governance');

    // Execute the callback and export the result
    module.exports = callback(search, dialog, governance);
};

// Wrap the customLog to capture attributes into logStore while maintaining logic
const log = {
    // ...customLog,
    debug: (args) => {
        logStore.push(`[DEBUG] ${args.title} → ${JSON.stringify(args.details)}`);
        // return customLog.log(args);
    },
    audit: (args) => {
        logStore.push(`[AUDIT] ${args.title} → ${JSON.stringify(args.details)}`);
        // return customLog.audit(args);
    },
    error: (args) => {
        logStore.push(`[ERROR] ${args.title} → ${JSON.stringify(args.details)}`);
        // return customLog.error(args);
    },
    emergency: (args) => {
        logStore.push(`[EMERGENCY] ${args.title} → ${JSON.stringify(args.details)}`);
        // return customLog.emergency(args);
    },
    warn: (args) => {
        logStore.push(`[WARN] ${args.title} → ${JSON.stringify(args.details)}`);
        // return customLog.warn(args);
    },
    log: (args) => {
        logStore.push(`[DEBUG] ${args.title} → ${JSON.stringify(args.details)}`);
        // return customLog.log(args);
    }
};

app.get('/clientscript/cs_check_email', (req, res) => {
    logStore.length = 0;

    try {

        if (typeof define !== 'function') { 
          var define = require('amdefine')(module); 
        }
        const csPath = path.resolve('./dist/FileCabinet/SuiteApps/com.netsuite.testing/scripts/cs_check_email.js');
        
        // Use delete require.cache to allow re-testing without restarting server
        delete require.cache[require.resolve(csPath)];
        const clientScript = require(csPath);

        // Inject the wrapped log module
        if (clientScript.__setLog) {
            clientScript.__setLog(log);
        }

        // Trigger SuiteScript entry points
        if (clientScript.pageInit) clientScript.pageInit();

        if (clientScript.fieldChanged) {
            clientScript.fieldChanged({
                currentRecord: { getValue: () => 'demo@example.com', setValue: () => {} },
                fieldId: 'email'
            });
        }

        if (clientScript.saveRecord) {
            clientScript.saveRecord({
                currentRecord: { getValue: (f) => (f === 'email' ? 'demo@example.com' : ''), setValue: () => {} }
            });
        }

        const htmlLogs = logStore.map(line => `<div style="font-family: monospace; margin-bottom: 5px;">${line}</div>`).join('');
        res.send(`
            <html>
                <head><title>ClientScript Logs</title></head>
                <body style="padding: 20px; background: #fafafa;">
                    <h1 style="color: #333;">cs_check_email ClientScript Logs</h1>
                    <div style="background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 4px;">
                        ${htmlLogs || '<em>No logs generated during execution.</em>'}
                    </div>
                </body>
            </html>
        `);

    } catch (err) {
        res.status(500).send(`<h1>Error executing ClientScript</h1><pre>${err.stack}</pre>`);
    }
});

app.listen(3000, () => {
    console.log('Open http://localhost:3000/clientscript/cs_check_email to view logs')
    console.log('Server running at http://localhost:3000');
});
