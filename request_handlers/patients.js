
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

async function deletePatient(patientId){
    var patientDeletedStatus = await db_sql_helper.deletePatient(JSON.parse(patientId));
    if(!patientDeletedStatus || patientDeletedStatus != 'success'){
        return {error: 'Patient delete error', result: null};
    } else {
        return {error: null, result: patientDeletedStatus};
    }
}

async function updatePatient(patient){
    var clearPatient = JSON.parse(patient);
    var patientKeys = Object.keys(clearPatient);
    for(var i=0;i<patientKeys.length;i++) {
        var key = patientKeys[i];
        logger.info(clearPatient[key]);
        if(clearPatient[key] == '' || !clearPatient[key]) {
            delete clearPatient[key];
        } 
    }
    logger.info(clearPatient);
    var patientUpdatedStatus = await db_sql_helper.updatePatient(clearPatient);
    if(!patientUpdatedStatus || patientUpdatedStatus != 'success'){
        return {error: 'Patient update error', result: null};
    } else {
        return {error: null, result: patientUpdatedStatus};
    }
}
module.exports = {addPatient, deletePatient, updatePatient};