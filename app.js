require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

const connectDB = require('./server/config/db');
const session = require('express-session');

const app = express();
const PORT = 8080 ||  process.env.PORT;

//connect database
connectDB();

app.use(express.static('public'));

//Templating
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));
app.use(flash());
app.use(cookieParser());
app.use(
    session({
      secret: 'keyboardcat',
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        // Add the following line to use native MongoDB driver's client
        client: connectDB.getClient(), // Make sure to adjust this based on your connectDB implementation
      }),
    })
  );
 
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});