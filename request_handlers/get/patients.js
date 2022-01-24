var logger = require('nlogger').logger(module);
const db_sql_helper = require('../../sqlDb/utils');

async function handleTableGetter(query) {
    var tableName = query.tableName;
    var tableData = await db_sql_helper.getTable(tableName);
    if(!tableData){
        return {error: 'No patients returned.', result: null};
    } else {
        return {error: null, result: tableData};
    }
} 

async function handleComplexGetter(query) {
    var dbQuery;
    switch(query.resource) {
        case 'given_vaccine': 
            dbQuery = "select * from Vaccines v join GivenVaccines gv on v.batch_id = gv.batch_id where gv.patient_id ='" + query.id + "'";
            break;
        case 'patient': 
            var patientData = await getFullPatientData(query.id);
            return {error: null, result: patientData};
            break;
    }
    var tableData = await db_sql_helper.getComplexData(dbQuery);
    logger.info(tableData);
    if(!tableData){
        return {error: 'No data returned.', result: null};
    } else {
        return {error: null, result: tableData};
    }
}
async function getFullPatientData(id) {
    var patientFullData = {};
    var dbQuery = "select * from Vaccines v join GivenVaccines gv on v.batch_id = gv.batch_id where gv.patient_id ='" + id + "'";
    var givenVaccines = await db_sql_helper.getComplexData(dbQuery);

    var dbQuery = "select * from Patients where ID ='" + id + "'";
    var patient = await db_sql_helper.getComplexData(dbQuery);

    var dbQuery = "select * from PatientSideEffect pse join SideEffects sf on sf.name=pse.side_effect where pse.patient_id='" + id + "'";
    var patientSideEffects = await db_sql_helper.getComplexData(dbQuery);

    var dbQuery = "select * from PatientCondition pc join Conditions c on pc.condition=c.name where pc.patient_id='" + id + "'";
    var patientConditions = await db_sql_helper.getComplexData(dbQuery);
    patientFullData = { 
        givenVaccines, patient, patientSideEffects, patientConditions
    }

    return patientFullData;

}
module.exports = {handleTableGetter,handleComplexGetter};