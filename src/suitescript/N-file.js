/**
 * Fake N/file module
 * Simulates file operations
 */
const fs = require('fs');
const path = require('path');
const javaBridge = require("../api/java.utils")

module.exports = {
    load: (filePath) => {
        const fullPath = path.resolve(filePath);
        if (!fs.existsSync(fullPath)) throw new Error(`File not found: ${filePath}`);
        const contents = fs.readFileSync(fullPath, 'utf8');
        javaBridge.generateReport(`LoadFile-${filePath}`);
        return { id: filePath, contents };
    },

    write: (filePath, contents) => {
        const fullPath = path.resolve(filePath);
        fs.writeFileSync(fullPath, contents, 'utf8');
        javaBridge.sendEmail('admin@example.com', `File Written: ${filePath}`, 'File updated in N/file module');
        return true;
    },

    exists: (filePath) => fs.existsSync(path.resolve(filePath))
};
