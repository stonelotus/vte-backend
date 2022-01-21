const config = {
    user: 'dio',
    password: 'maretestaici',
    server: 'LAPTOP-BMHMFCM2', 
    database: 'covid_vaccination_trials',

    options: {  
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithPort: true, 
        instancename: 'SQLEXPRESS'
    },
    port: 55892  //
}

module.exports = config;