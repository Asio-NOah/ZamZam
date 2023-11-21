require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

const { connectDB, getClient } = require('./server/config/db');
const session = require('express-session');

const app = express();
const PORT = 8080 || process.env.PORT;

async function startApp() {
  // Connect database
  await connectDB();

  app.use(express.static('public'));

  // Templating
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
        client: getClient(), // Use the exported getClient function
      }),
    })
  );

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

// Call the asynchronous function
startApp();
