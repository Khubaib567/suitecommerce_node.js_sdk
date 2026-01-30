const express = require('express');
const path = require('path');

const app = express();

// In-memory log store
const logStore = [];

// Fake N/log module for ClientScript to push logs to logStore
const log = {
  debug: ({ title, details }) => logStore.push(`[DEBUG] ${title} → ${details}`),
  audit: ({ title, details }) => logStore.push(`[AUDIT] ${title} → ${details}`),
  error: ({ title, details }) => logStore.push(`[ERROR] ${title} → ${details}`),
  emergency: ({ title, details }) => logStore.push(`[EMERGENCY] ${title} → ${details}`),
  warn: ({ title, details }) => logStore.push(`[WARN] ${title} → ${details}`)
};

// Route to execute ClientScript and render logs
app.get('/clientscript/cs_check_email', (req, res) => {
  // Clear previous logs
  logStore.length = 0;

  try {
    // Load the ClientScript module
    const csPath = path.resolve(
      './dist/FileCabinet/SuiteApps/com.netsuite.testing/scripts/cs_check_email.js'
    );
    const clientScript = require(csPath);

    // Inject fake log module
    if (clientScript.__setLog) {
      clientScript.__setLog(log); // if ClientScript exposes a setter
    }

    // Execute pageInit
    if (clientScript.pageInit) clientScript.pageInit();

    // Optionally simulate fieldChanged
    if (clientScript.fieldChanged) {
      clientScript.fieldChanged({
        currentRecord: {
          getValue: () => 'demo@example.com',
          setValue: () => {}
        },
        fieldId: 'email'
      });
    }

    // Optionally simulate saveRecord
    if (clientScript.saveRecord) {
      clientScript.saveRecord({
        currentRecord: {
          getValue: (field) => (field === 'email' ? 'demo@example.com' : ''),
          setValue: () => {}
        }
      });
    }

    // Render logs in browser
    const htmlLogs = logStore.map(line => `<div>${line}</div>`).join('');
    res.send(`
      <html>
        <head>
          <title>ClientScript Logs</title>
        </head>
        <body>
          <h1>cs_check_email ClientScript Logs</h1>
          ${htmlLogs}
        </body>
      </html>
    `);

  } catch (err) {
    res.send(`<h1>Error executing ClientScript</h1><pre>${err.stack}</pre>`);
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
  console.log('Open http://localhost:3000/clientscript/cs_check_email to view logs');
});
