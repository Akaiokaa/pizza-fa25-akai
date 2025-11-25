// Import the express module
import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import { validateForm } from './validation.js';

// Load the variables from .env
dotenv.config();
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

// Create an instance of an Express application
const app = express();
//Set EJS as our view engine
app.set('view engine', 'ejs')

// Enable static file serving
app.use(express.static('public'));

//Allow the app to parse form data
app.use(express.urlencoded({extended: true}));

//Creat an array to store rders 
const orders = [];

// Define the port number where our server will listen
const PORT = 3005;

//Define a rout to test database connection
app.get('/db-test', async(req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders');
        res.send(orders);
    } catch(err) {
        console.error('Database error:', err)
        res.status(500).send('Database error: ' + err.message);
    }
});
// Define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client
app.get('/', (req, res) => {

    // Send a response to the client
    // res.send(`<h1>Welcome to Poppa\'s Pizza!</h1>`);
    // res.sendFile(`${import.meta.dirname}/views/home.html`);
    res.render('home')
});

app.get('/contact-us', (req, res) => {
    // res.render(`${import.meta.dirname}/views/contact.html`);
    res.render('contact')
});

app.get('/confirmation', (req, res) => {
    // res.render(`${import.meta.dirname}/views/confirmation.html`); 
    res.render('confirmation', { orders} )
});

app.get('/admin', async(req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders');
        pool.query('SELECT * FROM orders ORDER BY timestamp DESC')
        res.render('admin', {orders})
    } catch(err) {
        console.error('Database error:', err)
    }
    
    // res.sendFile(`${import.meta.dirname}/views/admin.html`); 
});

app.post('/submit-order', async(req, res) => {
    // console.log(req.body);
    // res.render(`${import.meta.dirname}/views/confirmation.html`);
    const dateOrdered = new Date();
    const order = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        method: req.body.method,
        toppings: req.body.toppings,
        size: req.body.size,
        comment: req.body.comment,
        timestamp: dateOrdered.toLocaleString()
    };
    const valid = validateForm(order);
    if(!valid.isValid) {
        res.render('home', {errors: valid.errors});
    }
    //const prder = req.body; order.fname
    // orders.push(order);
    
    const sql = "INSERT INTO orders (fname, lname, email, size, method, toppings) VALUES (?,?,?,?,?,?)";
    //CREATE array of parameters for each placeholder
    const params =[
        order.fname,
        order.lname,
        order.email,
        order.size,
        order.method,
        order.toppings,
    ];
    try {
        const [result] = await pool.execute(sql,params);
        res.render('confirmation', {order});
    } catch(err){
        console.log("Database Error", err.message)
    }
    // console.log(orders);
    // console.log(orders);
    
});


// Start the server and make it listen on the port 
// specified above
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); 
