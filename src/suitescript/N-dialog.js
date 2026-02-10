/**
 * Mock N/ui/dialog module for Node.js
 */
const readline = require('readline');

const askQuestion = (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
};

module.exports = {
    /**
     * dialog.alert
     * @param {Object} options - { title, message }
     * @returns {Promise<boolean>}
     */
    alert: async (options) => {
        console.log(`\n--- DIALOG ALERT ---`);
        console.log(`Title: ${options.title}`);
        console.log(`Message: ${options.message}`);
        
        // In Node terminal, we wait for Enter
        await askQuestion("Press [Enter] to continue...");
        return Promise.resolve(true);
    },

    /**
     * dialog.confirm
     * @param {Object} options - { title, message }
     * @returns {Promise<boolean>}
     */
    confirm: async (options) => {
        console.log(`\n--- DIALOG CONFIRM ---`);
        console.log(`Title: ${options.title}`);
        console.log(`Message: ${options.message}`);
        
        const answer = await askQuestion("Confirm? (y/n): ");
        const result = answer.toLowerCase() === 'y';
        return Promise.resolve(result);
    },

    /**
     * dialog.create
     * @param {Object} options - { title, message, buttons }
     * @returns {Promise<string|number>}
     */
    create: async (options) => {
        console.log(`\n--- DIALOG CREATE ---`);
        console.log(`Title: ${options.title}`);
        console.log(`Message: ${options.message}`);
        
        const buttonLabels = options.buttons.map((b, i) => `[${i}] ${b.label}`).join('  ');
        console.log(`Buttons: ${buttonLabels}`);

        const answer = await askQuestion("Enter button index: ");
        const index = parseInt(answer, 10);
        
        const selectedValue = options.buttons[index] ? options.buttons[index].value : null;
        return Promise.resolve(selectedValue);
    }
};
