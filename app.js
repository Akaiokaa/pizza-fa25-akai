// Import the express module
import express from 'express';

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

app.get('/admin', (req, res) => {
    res.render('admin', {orders})
    // res.sendFile(`${import.meta.dirname}/views/admin.html`); 
});

app.post('/submit-order', (req, res) => {
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
    //const prder = req.body; order.fname
    orders.push(order);
    console.log(orders);
    // console.log(orders);
    res.render('confirmation', {order: order
    });
});


// Start the server and make it listen on the port 
// specified above
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); 
