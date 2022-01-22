var logger = require('nlogger').logger(module);
const db_sql_helper = require('../../sqlDb/utils');

async function handlePatientsGetter(req) {
    var patientsList = await db_sql_helper.getPatients();
    if(!patientsList){
        return {error: 'No patients returned.', result: null};
    } else {
        return {error: null, result: patientsList};
    }
} 

module.exports = {handlePatientsGetter};