var express = require('express');
var exphbs  = require('express-handlebars'); // Import express-handlebars
var mongoose = require('mongoose');
var app = express();
var database = require('./config/database');
var bodyParser = require('body-parser');
var path = require('path'); // Import path module

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

//mongoose.connect(database.uri, database.options);
mongoose.connect(database.uri);


var product = require('./models/product'); // Assuming a model named 'Product'


// CUSTOM HANDLEBARS
const hbs = exphbs.create({ extname: '.hbs', defaultLayout: 'main' });
  
app.engine('.hbs', hbs.engine);

// Set views directory
//app.set('views', path.join(__dirname, 'Question2', 'views'));

// Set views directory
app.set('views', path.join(__dirname, 'views'));

  
//SETTING VIEW ENGINE FOR EXPRESS
app.set('view engine', '.hbs');

// Get all product data from the database
app.get('/api/products', async function(req, res) {
    try {
        const products = await product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get a product by ID
app.get('/api/products/:product_id', async function(req, res) {
    try {
        const id = req.params.product_id;
        const product = await product.findById(id);
        res.json(product);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Insert a new product
app.post('/api/products', async function(req, res) {
    try {
        const product = await product.create(req.body);
        const products = await product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update an existing product record
app.put('/api/products/:product_id', async function(req, res) {
    try {
        const id = req.params.product_id;
        const data = req.body;
        const product = await product.findByIdAndUpdate(id, data);
        res.send('Successfully! Product updated - ' + product.title);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete a product by ID
app.delete('/api/products/:product_id', async function(req, res) {
    try {
        const id = req.params.product_id;
        const deletedProduct = await product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).send('Product not found.');
        }
        res.send('Successfully! Product has been Deleted.');
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// //ASIGNMENT 2 PART

// ROUTE TO RENDER ALL PRODUCTS
app.get('/allData', async (req, res) => {
    try {
        const products = await product.find(); // Fetch all products from the database
        // Render all products info in an HTML table using Handlebars
        res.render('productAll', { product: products, title: 'All Products In HTML Table' });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});
 // Route to insert a new product - form display
app.get('/insertProduct', function(req, res) {
    res.render('insertProd', { title: 'Inseert new product' });
});


// Route to insert a new product - form submission
app.post('/insertProduct', async function(req, res) {
    try {
        const { title, description, price } = req.body;
        // Assuming your product model has properties 'title', 'description', and 'price'
        const newProduct = await product.create({ title, categoryName, price });
        res.redirect('/allData'); // Redirect to the page displaying all products
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});


app.listen(port, () => {
    console.log("App listening on port : " + port);
});
