
var logger = require('nlogger').logger(module);
const db_sql_helper = require('../sqlDb/utils');

async function addPatient(patient){
    var patientAddedStatus = await db_sql_helper.addPatient(JSON.parse(patient));
    if(!patientAddedStatus || patientAddedStatus != 'success'){
        return {error: 'Patient add error', result: null};
    } else {
        return {error: null, result: patientAddedStatus};
    }
}

module.exports = {addPatient};