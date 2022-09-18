const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Business = require('./models/business');
const Review = require('./models/review');
const business = require('./models/business');

mongoose.connect('mongodb://localhost:27017/yelp-clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home')
});

app.get('/business/new', async (req, res) => {
    res.render('businesses/new');
})

app.get('/business', async (req, res) => {
    const business = await Business.find({});
    console.log(business);
    res.render('businesses/index', { business });
})

app.get('/business/edit/:id', async (req, res) => {
    const business = await Business.findById(req.params.id);
    //render edit.ejs from businesses folder
    res.render('businesses/edit', { business });
})

app.get('/business/:id', async (req, res) => {
    const business = await Business.findById(req.params.id);
    console.log(business);
    res.render('businesses/show', { business });
})

app.put('/business/:id', async (req, res) => {
    const business = await Business.findByIdAndUpdate(req.params.id, { ...req.body.business });
    console.log(business);
    res.redirect(`/business/${business._id}`);
    //res.redirect('/businesses/edit', { business });
})

app.post('/business', async (req, res) => {
    const business = new Business(req.body.business);
    console.log(business);
    await business.save();
    res.redirect(`/business/${business._id}`);
})

app.delete('/business/:id', async (req, res) => {
    await Business.findByIdAndDelete(req.params.id);
    res.redirect('/business');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})