/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/ui/dialog'], ( search, dialog)  => {


    const pageInit = (scriptContext) => {
        const title = "pageInit ::";
        try {
        
            log.debug({ title: title , details: 'Executed!' });
            alert('You can create a new record');
            
        } catch (error) {
            log.error({ title: title + 'error', details: error });
        }

        
    }


    const fieldChanged = (scriptContext) => {
        const title = "fieldChanged ::";
        const {currentRecord,fieldId} = scriptContext
        try {
            log.debug({ title: title , details: 'Executed!' });
            if (fieldId == 'phone') {
                const phone = currentRecord.getValue('phone');

                if (phone.length > 11) {
                    alert('phoneNo only 11 numbers are allowed!')
                    currentRecord.setValue('phone', '');
                    return false;
                }
                const fax = currentRecord.getValue('fax');
                if (!fax) {
                    currentRecord.setValue('fax', phone);
                    log.debug({ title: title + 'phone' , details: phone });
                }

            }
        } catch (error) {
            log.debug({
                title: title,
                details: error
            });
        }

    }

    const checkEmployeeEmail=  () =>{
        const title = "checkEmployeeEmail ::";
        try {
        log.debug({ title: title , details: 'Executed!' });

        // INITAIZLIE A VARIABLE TO GET THE FLAG
        // let flag = false;
        const mySearch =  search.create({
            type: search.Type.EMPLOYEE,
            columns: ['email'],
            filters: ['email', 'contains', 'jamshed@dynasoftcloud.com']
        });

        const myResultSet =  mySearch.run();
        const resultRange = myResultSet.getRange({
            start: 0,
            end: 1
        });

        if (resultRange.length > 0) {
            const options = {
                    title: "System Email Information ",
                    message: "Employee email already exists, would you like to add?"
            };

            const success = (result) => {
                log.debug({ title: 'Success with value!: ' , details: result });
                flag = true;
                return flag;
            }

            const failure =(reason) =>{
                log.debug("Failure: " + reason);
                return false;
            }


            const status =  dialog.confirm(options).then(success).catch(failure);
            return status
        }
            
        } catch (error) {
            log.error({ title: title + 'error', details: error });
        }

    }

    const saveRecord = (Context) => {
        const title = 'saveRecord :: ';
        const employee = Context.currentRecord;
        try {


        log.debug({ title: title , details: 'Executed!' });
        const empCode = employee.getValue('custentity_dsc_employee_code');
        const email = employee.getValue('email');
        if (email) {
            const phoneNo = employee.getValue('phone');

            if (!phoneNo) {
                alert('PhoneNo field is mandatory!');
                return false;
            }
        }

        if (empCode == 'x') {
            alert('Please enter valid employee code!');
            return false;
        }

        // INITIALIZE A VARIABLE TO CHECK THE EMAIL STATUS:
        const emailStatus = checkEmployeeEmail()
        log.debug({ title: title + 'emailStatus', details: emailStatus });
        

            
        } catch (error) {
            log.error({ title: title + 'error', details: error });
        }
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
    };

});
