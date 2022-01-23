const { DateTime } = require('mssql');
const config = require('./config.js');
sql = require('mssql');
var logger = require('nlogger').logger(module);


const getTest = async() => {
    let stream = await sql.connect(config);
    let clients = stream.request().query("SELECT * FROM Patients")
    logger.info(clients);
    return clients; 
}

const updatePatient = async(patient) => {
    let stream = await sql.connect(config);
    logger.info("success connecting to stream\n");
    let current_query = "UPDATE Patients SET ";

    if(patient.first_name) current_query += "first_name='" + patient.first_name + "',";
    if(patient.last_name) current_query += "last_name='" + patient.last_name + "',";
    if(patient.age) current_query += "age='"       + patient.age + "',";
    if(patient.trial_start) current_query += "trial_start='"    + patient.trial_start + "',";
    if(patient.trial_end) current_query += "trial_end='"      + patient.trial_end + "',";
    if(patient.dose_number) current_query += "doses_received='" + patient.dose_number + "',";
    if(patient.given_vaccine) current_query += "given_vaccines_ids='" + patient.given_vaccine + "'";

    if(current_query[current_query.length-1] == ','){
        current_query = current_query.slice(0, current_query.length - 1);
    }
    current_query += " where ID=" + patient.id;
                                            
    
    logger.info("this is the query: ",current_query)
    let clients = await stream.request().query(current_query);
    return clients;
}

const getAdminCreds = async(email) => { 
    let stream = await sql.connect(config);
    logger.info("success connecting to stream\n");
    let current_query = "SELECT admin.password FROM Admins admin WHERE email = '" + email + "'";
    
    logger.info("Querying for: " + current_query);
    let admin_password = await stream.request().query(current_query);

    return admin_password && admin_password.recordset && admin_password.recordset[0] && admin_password.recordset[0].password;

}

const getPatients = async() => {
    let stream = await sql.connect(config);
    logger.info("success connecting to stream\n");

    let current_query = "SELECT * FROM Patients";
    logger.info("Querying for " + current_query);
    let patients = await stream.request().query(current_query);
    if(!patients) {
        logger.error('Error getting patients');
    } else {
        patients = patients.recordset;
    }
    return patients;
}

const addPatient = async(patient) => {
    let stream = await sql.connect(config);
    logger.info("success connecting to stream\n");

    let current_query = "INSERT INTO Patients ( first_name, last_name, age, gender, created_at, trial_start, trial_end, given_vaccines_ids, doses_received)" + 
                "VALUES (" +  
                        "'" + patient.first_name + "'," +
                        "'" + patient.last_name + "'," +
                            patient.age + ',' +
                            "'" + patient.gender + "'," +
                            "'" + Date.now().toString() + "'," +
                            "'" + patient.trial_start.toString() + "'," +
                            "'" + patient.trial_end.toString() + "'," +
                            patient.given_vaccine + ',' + 
                            patient.dose_number + ')';
                        
    logger.info("Querying for " + current_query);
    let response = await stream.request().query(current_query);
    if(response && response.rowsAffected && response.rowsAffected[0] && response.rowsAffected[0] > 0) {
        return "success";
    } else {
        logger.error("Something went wrong adding a new patient");
    }
}

const deletePatient = async(patientID) => {
    let stream = await sql.connect(config);
    logger.info("success connecting to stream\n");

    let current_query = "DELETE FROM Patients where ID=" + patientID;
                        
    logger.info("Querying for " + current_query);
    let response = await stream.request().query(current_query);
    if(response && response.rowsAffected && response.rowsAffected[0] && response.rowsAffected[0] > 0) {
        return "success";
    } else {
        logger.error("Something went wrong deleting the patient");
    }
}


module.exports = {getTest,updatePatient,getAdminCreds,getPatients,addPatient,deletePatient};