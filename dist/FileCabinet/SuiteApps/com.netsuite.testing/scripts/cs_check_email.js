/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define([
  'N/search', 
  'N/ui/dialog', 
  '../../../suitescript/governance' // Path to your governance module
], (search, dialog, governance) => {

    /**
     * pageInit function
     */
    const pageInit = (scriptContext) => {
        const title = "pageInit ::";
        try {
            // Simulate 1 governance unit for pageInit
            governance.consume(1);

            log.debug({ title: title, details: 'Executed!' });
            alert('You can create a new record');

        } catch (error) {
            log.error({ title: title + ' error', details: error });
        }
    }

    /**
     * fieldChanged function
     */
    const fieldChanged = (scriptContext) => {
        const title = "fieldChanged ::";
        const { currentRecord, fieldId } = scriptContext;
        try {
            // Simulate 1 governance unit per field change
            governance.consume(1);

            log.debug({ title: title, details: 'Executed!' });

            if (fieldId === 'phone') {
                const phone = currentRecord.getValue('phone');

                if (phone.length > 11) {
                    alert('PhoneNo only 11 numbers are allowed!');
                    currentRecord.setValue('phone', '');
                    return false;
                }

                const fax = currentRecord.getValue('fax');
                if (!fax) {
                    currentRecord.setValue('fax', phone);
                    log.debug({ title: title + ' phone', details: phone });
                }
            }

        } catch (error) {
            log.debug({ title: title + ' error', details: error });
        }
    }

    /**
     * checkEmployeeEmail function
     */
    const checkEmployeeEmail = () => {
        const title = "checkEmployeeEmail ::";
        try {
            log.debug({ title: title, details: 'Executed!' });

            // Consume governance for search operation
            governance.consume(10);

            const mySearch = search.create({
                type: search.Type.EMPLOYEE,
                columns: ['email'],
                filters: ['email', 'contains', 'jamshed@dynasoftcloud.com']
            });

            const myResultSet = mySearch.run();
            const resultRange = myResultSet.getRange({ start: 0, end: 1 });

            if (resultRange.length > 0) {
                const options = {
                    title: "System Email Information",
                    message: "Employee email already exists, would you like to add?"
                };

                const success = (result) => {
                    log.debug({ title: 'Success with value!:', details: result });
                    return true;
                }

                const failure = (reason) => {
                    log.debug("Failure: " + reason);
                    return false;
                }

                // Consume extra units for dialog operation
                governance.consume(5);

                return dialog.confirm(options).then(success).catch(failure);
            }

            return false;

        } catch (error) {
            log.error({ title: title + ' error', details: error });
        }
    }

    /**
     * saveRecord function
     */
    const saveRecord = (scriptContext) => {
        const title = 'saveRecord ::';
        const employee = scriptContext.currentRecord;
        try {
            // Consume governance for save validation
            governance.consume(5);

            log.debug({ title: title, details: 'Executed!' });

            const empCode = employee.getValue('custentity_dsc_employee_code');
            const email = employee.getValue('email');
            const phoneNo = employee.getValue('phone');

            if (email && !phoneNo) {
                alert('PhoneNo field is mandatory!');
                return false;
            }

            if (empCode === 'x') {
                alert('Please enter valid employee code!');
                return false;
            }

            // Check employee email
            const emailStatus = checkEmployeeEmail();
            log.debug({ title: title + ' emailStatus', details: emailStatus });

            // Simulate some additional governance consumption
            governance.consume(2);

            return true;

        } catch (error) {
            log.error({ title: title + ' error', details: error });
            return false;
        }
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
    };
});
