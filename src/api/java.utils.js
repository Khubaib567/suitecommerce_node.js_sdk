/**
 * rhinoJava.js
 * ------------------------------------------
 * Utility to call Java backend APIs via Rhino
 */

(function(global) {

    // Load Java classes
    // var EmailService = Java.type('com.demo.EmailService');

    // Singleton instance
    // var emailService = new EmailService();

    // Export utility functions
    global.JavaBridge = {
        sendEmail: function(to, subject, body) {
            return emailService.sendEmail(to, subject, body);
        },
        generateReport: function(reportName) {
            return emailService.generateReport(reportName);
        }
    };

})(this);
