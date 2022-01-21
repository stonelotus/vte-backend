const config = require('./config.js');
sql = require('mssql');
var logger = require('nlogger').logger(module);


const getTest = async() => {
    let stream = await sql.connect(config);
    let clients = stream.request().query("SELECT * FROM Patients")
    console.log(clients);
    return clients; 
}

const updatePatient = async(patient) => {
    let stream = await sql.connect(config);
    console.log("success connecting to stream\n");
    let current_query = "UPDATE Patients SET first_name='" + patient.first_name + "'" + " WHERE ID=" + patient.id;
    
    console.log("this is the query: ",current_query)
    let clients = stream.request().query(current_query);
    console.log("nice clients: \n");
    console.log(clients);
    return clients;
}

const getAdminCreds = async(email) => { 
    let stream = await sql.connect(config);
    console.log("success connecting to stream\n");
    let current_query = "SELECT admin.password FROM Admins admin WHERE email = '" + email + "'";
    
    console.log("Querying for: " + current_query);
    let admin_password = await stream.request().query(current_query);

    return admin_password && admin_password.recordset && admin_password.recordset[0] && admin_password.recordset[0].password;

}

module.exports = {getTest,updatePatient,getAdminCreds};