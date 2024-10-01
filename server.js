// Inport the dependencies
const express = require("express");
const app = express()
const mysql = require('mysql2');
const dotenv = require('dotenv')

// configure environment variables
dotenv.config()

// Create our object connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// Test the connection
db.connect((err) => {
  // if the connection is not successful
  if(err) {
    return console.log("Error connecting to the database: ", err)
  }

  // if connection is successful
  console.log("Successfully connected to MySQL: ", db.threadId)

})



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


// Question 1: Retrieve all patients
app.get('', (req, res) => {
  const getPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"
  db.query(getPatients, (err, data) => {
    if(err) {
      return res.status(400).send("Failed to get patients", err)
    }

    res.status(200).render('data', { data })
  }) 
})

// Question 2: Retrieving all providers
app.get('/providers', (req, res) =>{
  const getProviders = "SELECT first_name, last_name, provider_speciality FROM providers"
  db.query(getProviders, (err, data) => {
    if(err) {
      return res.status(400).send("Failed to get providers", err)
    }

    res.status(200).send(data)
  }) 
})

// Question 3: Filter patients by First Name

app.get('/patients/search/:firstName', (req, res) => {
  const firstName = req.params.firstName;
  const query = "SELECT * FROM patients WHERE first_name LIKE '%${firstName}%";
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error retrieving patients:', err);
          res.status(500).send('Internal Server Error');
      } else {
          res.render('data', { results });
      }
  });
});

// Question 4: Retrieve all providers by their specialty
app.get('/providers/:specialty', (req, res) => {
  const specialty = req.params.specialty;
  const query = "SELECT * FROM providers WHERE provider_specialty = ?";
  db.query(query, [specialty], (err, results) => {
      if (err) {
          console.error('Error retrieving providers:', err);
          res.status(500).send('Internal Server Error');
      } else {
          res.render('providers', { results });
      }
  });
});

// Start and listen to server
app.listen(3300, () => {
  console.log('Server is running on port 3300...')
})
