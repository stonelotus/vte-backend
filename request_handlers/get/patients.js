var logger = require('nlogger').logger(module);
const db_sql_helper = require('../../sqlDb/utils');
var _RISK_LEVEL_THRESHOLD = 2;

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
        case 'drugs': 
             dbQuery = "select * from Drugs join Conditions on Drugs.prohibited_condition = Conditions.name"
             break;
        case 'dashboard_data': 
             var dashboardData = await getDashboardData();
             return {error: null, result: dashboardData};
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
async function getDashboardData() {
    var dbQuery;
    dbQuery = "select top(1) count(ID) as counter, p.first_name, p.last_name from Patients p join PatientCondition pc on p.ID = pc.patient_id group by ID , p.first_name, p.last_name order by count(ID) desc";
    var patientWithMostConditions = await db_sql_helper.getComplexData(dbQuery);
    
    dbQuery = "select top(1) count(c.name) as counter,c.name from Conditions c join PatientCondition pc on c.name = pc.condition group by c.name order by counter desc";
    var mostCommonCondition = await db_sql_helper.getComplexData(dbQuery);

      
    var dbQuery = "select * from Patients p where p.ID NOT IN(select pc.patient_id from PatientCondition pc)";
    var patientsWithNoConditions = await db_sql_helper.getComplexData(dbQuery);

    var dbQuery = "select c.name, c.description from Conditions c full join PatientCondition pc on c.name = pc.condition where c.name not in (select pc2.condition from PatientCondition pc2)";
    var neverSeenConditions = await db_sql_helper.getComplexData(dbQuery);

    var dbQuery =  "select * from Conditions c where c.name IN (select pc.condition from PatientCondition pc where pc.risk_level >" + _RISK_LEVEL_THRESHOLD + ")"; 
    var conditionWithRiskLevelOverThreshold = await db_sql_helper.getComplexData(dbQuery);    
    return {
        patientWithMostConditions,
        mostCommonCondition,
        patientsWithNoConditions,
        neverSeenConditions,
        conditionWithRiskLevelOverThreshold
    }
}
module.exports = {handleTableGetter,handleComplexGetter};