
var logger = require('nlogger').logger(module);
const db_sql_helper = require('../sqlDb/utils');

async function addPatient(patient){
    logger.info("Adding patient..");

    var parsedPatient = JSON.parse(patient);
   
    var patientAddedStatus = await db_sql_helper.addPatient(parsedPatient);
    if(!patientAddedStatus || patientAddedStatus != 'success'){
        return {error: 'Patient add error', result: null};
    } else {
        var patientId = (await db_sql_helper.getComplexData("select p.ID from Patients p where p.last_name='" 
                        + parsedPatient.last_name + "'and p.first_name='" + parsedPatient.first_name + "'"))[0]['ID'];
                     

        if(parsedPatient.conditions){
            var conditions = parsedPatient.conditions.split(';');
            delete parsedPatient.conditions;
            for(var i=0;i<conditions.length;i++){
                var query = "select count(*) from Conditions c where c.name = '" +conditions[i] + "'";
                var conditionExists = (await db_sql_helper.getComplexData(query))[0][''];
                logger.info(conditionExists);
    
                if(conditionExists) {
                    var query = "insert into PatientCondition (patient_id, condition) VALUES ('" + 
                                patientId + "', '" + conditions[i] + "')";
                    await db_sql_helper.executeComplexQuery(query);
                    logger.info("Done inserting condition " + conditions[i] + " on patient " + patientId);
                }
            }
            return {error: null, result: patientAddedStatus};

        }
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