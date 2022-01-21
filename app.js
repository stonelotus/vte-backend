const bodyParser = require('body-parser')
const express = require('express');
const { password } = require('./sqlDb/config.js');
const app = express()
const port = 3000
const db_sql_helper = require('./sqlDb/utils.js');
var logger = require('nlogger').logger(module);
    
app.use( function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    next();
})
app.use(bodyParser.json());


var distDir = __dirname + "/dist/";

app.get('/login', (req,res) => {
    var queried_creds = req.query;
    db_sql_helper.getAdminCreds(queried_creds.email).then(password_response => {
        logger.info("Req pass:", queried_creds.password);
        logger.info("Resp pass:", password_response);
        if(!password_response) {
            logger.info("No user with that email.");
            res.json({error: 'undefined_password', response: null})
            return;
        }

        if(password_response == queried_creds.password){
            logger.info("Password matched succesfully.");
            res.json({error:null, response: 'success'});
        } else {
            logger.info("Incorrect password");
            res.json({error: null, response: 'wrong_password'})
        }
    })
})

app.get('/', (req, res) => {
   // res.send('Hello From Windows Service !!')
    console.log(req.query);
    console.log("we're doing what we can...");

    if(req && req.query){
        if(req.query.order == "update"){
            let new_data = JSON.parse(req.query.data);
            let new_patient = {
                id: new_data.power,
                first_name: new_data.name
            }
            console.log(new_patient);
            console.log("here we go updating....");
            db_sql_helper.updatePatient(new_patient).then(response => {
                res.json({});
            })
        } else {
            db_sql_helper.getTest().then(response => {
                res.json(response.recordset);
            })
        }
    } else {
        db_sql_helper.getTest().then(response => {
            res.json(response.recordset);
        })
    }
}) 


app.listen(port, () => {
    console.log(`App is running http://localhost:${port}`)

})



