const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer  = require('multer');
const storage = multer.memoryStorage();
const GorillaSafari = require('../models/GorillaSafari');
const Activity = require('../models/Activity');
const AboutUs = require('../models/AboutUs');
const WildlifeSafari = require('../models/WildlifeSafari');
const Tour = require('../models/Tour');
const Destination = require('../models/Destination');
const User = require('../models/User');
const { Faq, Ans } = require('../models/Faq');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const flash = require('express-flash');
const session = require('express-session');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;
const upload = multer({
    storage: storage,
    limits: { fieldSize: 10 * 1024 * 1024 } // Increase the field size limit to 10MB
  });

  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(flash());
  router.use(cookieParser());
  router.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true
}));

  /**
 * GET
 * Admin-login page
 */
router.get('/login', async (req,  res) => {
    
    try {

        const locals = {
            title: "Login",
        }
    
        res.render('admin/login', { 
            locals, 
            currentPage: 'login'
        });
    } catch (error) {
        console.log('error');
    }
});

/**
 * GET
 * Admin-register page
 */
router.get('/register', async (req,  res) => {
    
    try {

        const locals = {
            title: "Register"
        }
    
        res.render('admin/register', { 
            locals, 
            currentPage: 'register' 
        });
    } catch (error) {
        console.log('error');
    }
});

/**
 * POST
 * Admin Register 
 */
router.post('/admin/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        if (!email || !password) {
            req.flash('error', 'Both Email and Password required');
            return res.redirect('/register');
        } else if (password.length < 8) {
            req.flash('error', 'Password must be at least 8 characters');
            return res.redirect('/register');
        } else {
            try {
                const user = await User.create({ username, email, password: hashedPassword });
                req.flash('success', 'User Created');
                return res.redirect('/login');
            } catch (error) {
                if (error.code === 11000) {
                    req.flash('error', 'Username or email already in use');
                    return res.redirect('/register');
                }
                console.error(error); // Log the exact error for debugging
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


/**
 * Post
 * Admin login 
 */
router.post('/admin/login', async (req,  res) => {
    
    try {

        const { username, password } = req.body;
        
        const user = await User.findOne({username});
        if(!user) {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/login');
        };

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/login');
        };

        const token = jwt.sign({ userId: user._id}, jwtSecret);
        res.cookie('token', token, { httpOnly: true});
        res.redirect('/admin');
        req.flash('success', 'You are logged in');

    
       
    } catch (error) {
        console.log(error);
    }
}); 

/**
 * check-login 
 */
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/'); // Redirect unauthorized users to index.ejs
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;

        // Check if the authenticated user is an admin
        const user = await User.findById(req.userId);
        if (!user || !user.isAdmin) {
            return res.redirect('/'); // Redirect non-admin users to index.ejs
        }

        next();
    } catch (error) {
        return res.redirect('/'); // Redirect unauthorized users to index.ejs
    }
};


// Get - Admin Uganda dashboard
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    const ugandaGorillaSafaris = await fetchUgGs(); // Fetch all gorilla safaris from the database
    const ugandaWildlifeSafaris = await fetchUgWs(); // Fetch all wildlife safaris from the database
    const ugandaTours = await fetchUgTours(); // Fetch all tours from the database
    const ugandaDestinations = await fetchUgDestinations(); // Fetch all Destinations from the database
    const ugandaActivities = await fetchUgActivities(); // Fetch all activities from the database
    const locals = {
      title: 'Ecowonders' // Pass the gorilla safaris data to the template
    };
    res.render('admin/index', {
      locals,
      layout: adminLayout,
      ugandaGorillaSafaris: ugandaGorillaSafaris,
      ugandaWildlifeSafaris: ugandaWildlifeSafaris,
      ugandaTours: ugandaTours,
      ugandaDestinations: ugandaDestinations,
      ugandaActivities: ugandaActivities
    });
  } catch (error) {
    console.error(error);
    res.redirect('/'); // Redirect to an error page in case of an error
  }
});

// Get - Kenya Dashboard
router.get('/kenya', async (req, res) => {
  try {
    const kenyaGorillaSafaris = await fetchKyGs();
    const kenyaWildlifeSafaris = await fetchKyWs();
    const kenyaTours = await fetchKyTours();
    const kenyaActivities = await fetchKyActivities();
    const kenyaDestinations = await fetchKyDestinations();
    
    const locals = {
      title: 'Kenya Dashboard'
    };
    res.render('admin/kenya', {
      kenyaGorillaSafaris: kenyaGorillaSafaris,
      kenyaWildlifeSafaris: kenyaWildlifeSafaris,
      kenyaTours: kenyaTours,
      kenyaActivities: kenyaActivities,
      kenyaDestinations: kenyaDestinations,
      locals,
      layout: adminLayout
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get - Tanzania Dashboard
router.get('/tz', async (req, res) => {
  try {
    const tzGorillaSafaris = await fetchTzGs();
    const tzWildlifeSafaris = await fetchTzWs();
    const tzTours = await fetchTzTours();
    const tzActivities = await fetchTzActivities();
    const tzDestinations = await fetchTzDestinations();
    const locals = {
      title: 'Tanzania Dashboard'
    };
    res.render('admin/tz', {
      tzGorillaSafaris: tzGorillaSafaris,
      tzWildlifeSafaris: tzWildlifeSafaris,
      tzTours: tzTours,
      tzActivities: tzActivities,
      locals,
      tzDestinations: tzDestinations,
      layout: adminLayout
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get - Rwanda Dashboard
router.get('/rwanda', async (req, res) => {
  try {
    const rwandaGorillaSafaris = await fetchRdGs();
    const rwandaWildlifeSafaris = await fetchRdWs();
    const rwandaTours = await fetchRdTours();
    const rwandaActivities = await fetchRdActivities();
    const rwandaDestinations = await fetchRdDestinations();
    const locals = {
      title: 'Rwanda Dashboard'
    };
    res.render('admin/rwanda', {
      rwandaGorillaSafaris: rwandaGorillaSafaris,
      rwandaWildlifeSafaris: rwandaWildlifeSafaris,
      rwandaTours: rwandaTours,
      rwandaActivities: rwandaActivities,
      locals,
      rwandaDestinations: rwandaDestinations,
      layout: adminLayout
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get - Congo Dashboard
router.get('/congo', async (req, res) => {
  try {
    const congoGorillaSafaris = await fetchCgGs();
    const congoWildlifeSafaris = await fetchCgWs();
    const congoTours = await fetchCgTours();
    const congoActivities = await fetchCgActivities();
    const congoDestinations = await fetchCgDestinations();
    const locals = {
      title: 'Congo Dashboard'
    };
    res.render('admin/congo', {
      congoGorillaSafaris: congoGorillaSafaris,
      congoWildlifeSafaris: congoWildlifeSafaris,
      congoTours: congoTours,
      congoActivities: congoActivities,
      locals,
      congoDestinations: congoDestinations,
      layout: adminLayout
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


  //edit gorilla safari
  router.get('/edit-gs/:id', authMiddleware, async (req, res) => {
    try {
  
      const locals = {
        title: "Edit Gorilla Safari" 
      };
  
      const gorillaSafari = await GorillaSafari.findOne({ _id: req.params.id });
  
      res.render('admin/edit-gs', {
        locals,
        gorillaSafari,
        layout: adminLayout
      })
  
    } catch (error) {
      console.log(error);
    }
  
  });
   

//Get
//Admin add gorilla safari
router.get('/add-gs', authMiddleware, (req, res) => {
    const locals = {
        title: 'Add Gorilla Safari'
    };
    res.render('admin/add-gs', {
        locals,
        layout: adminLayout
    });
}); 

//Post
//Admin add gorilla safari
router.post('/add-gs', authMiddleware, upload.fields([{ name: 'header-image', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
        const headerImageObject = {
            data: req.files['header-image'][0].buffer,
            contentType: req.files['header-image'][0].mimetype
        };

        const imageObject = {
            data: req.files['image'][0].buffer,
            contentType: req.files['image'][0].mimetype
        };

        const newGorillaSafari = new GorillaSafari({
            country: req.body.country,
            title: req.body.title,
            overview: req.body.overview,
            days: req.body.days, 
            price: req.body.price,
            when: req.body.when, 
            details: req.body.details,
            disclaimer: req.body.disclaimer,
            accommodation: req.body.accommodation,
            preview: req.body.preview,
            itinerary: req.body.itinerary,
            headerImage: headerImageObject,
            image: imageObject
        });

        await GorillaSafari.create(newGorillaSafari);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
});

// Get Admin add tour
router.get('/add-tours', authMiddleware, (req, res) => {
    const locals = {
        title: 'Add Tour'
    };
    res.render('admin/add-tours', {
        locals,
        layout: adminLayout
    });
});

// Post Admin add tour
router.post('/add-tour', authMiddleware, upload.fields([{ name: 'header-image', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
        const headerImageObject = {
            data: req.files['header-image'][0].buffer,
            contentType: req.files['header-image'][0].mimetype
        };

        const imageObject = {
            data: req.files['image'][0].buffer,
            contentType: req.files['image'][0].mimetype
        };

        const newTour = new Tour({
            country: req.body.country,
            title: req.body.title,
            overview: req.body.overview,
            days: req.body.days,
            price: req.body.price,
            when: req.body.when, 
            details: req.body.details,
            disclaimer: req.body.disclaimer,
            accommodation: req.body.accommodation,
            preview: req.body.preview,
            itinerary: req.body.itinerary,
            headerImage: headerImageObject,
            image: imageObject
        });

        await Tour.create(newTour);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
});

//Get
//Admin edit tour
router.get('/edit-tours/:id', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: "Edit Tour" 
      };
  
      const tour = await Tour.findOne({ _id: req.params.id });
  
      res.render('admin/edit-tours', {
        locals,
        tour,
        layout: adminLayout
      })
  
    } catch (error) {
      console.log(error);
    }
  });

  //POST
// Admin Edit Tours
router.post('/edit-tours/:id', authMiddleware, upload.fields([{ name: 'header-image', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
      const tourId = req.params.id;
      const tour = await Tour.findById(tourId);
  
      const headerImageObject = {
        data: req.files['header-image'][0].buffer,
        contentType: req.files['header-image'][0].mimetype
    };

    const imageObject = {
        data: req.files['image'][0].buffer,
        contentType: req.files['image'][0].mimetype
    };
      // Update the tour properties
      tour.country= req.body.country,
      tour.title= req.body.title,
      tour.overview= req.body.overview,
      tour.days= req.body.days,
      tour.price= req.body.price,
      tour.Safari.when= req.body.when, 
      tour.Safari.details= req.body.details,
      tour.disclaimer= req.body.disclaimer,
      tour.accommodation= req.body.accommodation,
      tour.preview= req.body.preview,
      tour.itinerary= req.body.itinerary,
      tour.headerImage= headerImageObject,
      tour.image= imageObject
  
      await tour.save();
      res.redirect('/admin');
      req.flash('success', 'Tour Updated');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
 * DELETE Tour
 * Admin Delete Tour
 */
router.delete('/delete-tours/:id', authMiddleware, async (req, res) => {
    try {
        await Tour.deleteOne({ _id: req.params.id });
        res.redirect('/admin');
        req.flash('success', 'Tour Deleted');
    } catch (error) {
        console.log(error);
    }
});


// Get Admin add destination
router.get('/add-destinations', authMiddleware, (req, res) => {
    const locals = {
        title: 'Add destination'
    };
    res.render('admin/add-destinations', {
        locals,
        layout: adminLayout
    });
});

// Post Admin add destination
router.post('/add-destination', authMiddleware, upload.fields([{ name: 'header-image', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
        const headerImageObject = {
            data: req.files['header-image'][0].buffer,
            contentType: req.files['header-image'][0].mimetype
        };

        const imageObject = {
            data: req.files['image'][0].buffer,
            contentType: req.files['image'][0].mimetype
        };

        const newdestination = new Destination({
            country: req.body.country,
            title: req.body.title,
            overview: req.body.overview,
            days: req.body.days,
            price: req.body.price,
            when: req.body.when, 
            details: req.body.details,
            disclaimer: req.body.disclaimer,
            accommodation: req.body.accommodation,
            preview: req.body.preview,
            itinerary: req.body.itinerary,
            headerImage: headerImageObject,
            image: imageObject
        });

        await Destination.create(newdestination);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
});

//Get
//Admin edit destination
router.get('/edit-destinations/:id', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: "Edit destination" 
      };
  
      const destination = await Destination.findOne({ _id: req.params.id });
  
      res.render('admin/edit-destinations', {
        locals,
        destination,
        layout: adminLayout
      })
  
    } catch (error) {
      console.log(error);
    }
  });

  //POST
// Admin Edit destinations
router.post('/edit-destinations/:id', authMiddleware, upload.fields([{ name: 'header-image', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
      const destinationId = req.params.id;
      const destination = await Destination.findById(destinationId);
  
      const headerImageObject = {
        data: req.files['header-image'][0].buffer,
        contentType: req.files['header-image'][0].mimetype
    };

    const imageObject = {
        data: req.files['image'][0].buffer,
        contentType: req.files['image'][0].mimetype
    };
      // Update the destination properties
      destination.country= req.body.country,
      destination.title= req.body.title,
      destination.overview= req.body.overview,
      destination.days= req.body.days,
      destination.price= req.body.price,
      destination.Safari.when= req.body.when, 
      destination.Safari.details= req.body.details,
      destination.disclaimer= req.body.disclaimer,
      destination.accommodation= req.body.accommodation,
      destination.preview= req.body.preview,
      destination.itinerary= req.body.itinerary,
      destination.headerImage= headerImageObject,
      destination.image= imageObject
  
      await Destination.save();
      res.redirect('/admin');
      req.flash('success', 'destination Updated');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
 * DELETE destination
 * Admin Delete destination
 */
router.delete('/delete-destinations/:id', authMiddleware, async (req, res) => {
    try {
        await Destination.deleteOne({ _id: req.params.id });
        res.redirect('/admin');
        req.flash('success', 'destination Deleted');
    } catch (error) {
        console.log(error);
    }
});

  


// Get Admin add wildlife safari
router.get('/add-ws', authMiddleware, (req, res) => {
    const locals = {
        title: 'Add Wildlife Safari'
    };
    res.render('admin/add-ws', {
        locals,
        layout: adminLayout
    });
});

// Post Admin add wildlife safari
router.post('/add-ws', authMiddleware, upload.fields([{ name: 'header-image', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
        
        const headerImageObject = {
            data: req.files['header-image'][0].buffer,
            contentType: req.files['header-image'][0].mimetype
        };

        const imageObject = {
            data: req.files['image'][0].buffer,
            contentType: req.files['image'][0].mimetype
        };

        const newWildlifeSafari = new WildlifeSafari({
            country: req.body.country,
            title: req.body.title,
            overview: req.body.overview,
            days: req.body.days,
            price: req.body.price,
            when: req.body.when, 
            details: req.body.details,
            disclaimer: req.body.disclaimer,
            accommodation: req.body.accommodation,
            preview: req.body.preview,
            itinerary: req.body.itinerary,
            headerImage: headerImageObject,
            image: imageObject
        });

        await WildlifeSafari.create(newWildlifeSafari);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
});

//Get
//Admin Edit Wildlife Safari
router.get('/edit-ws/:id', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: "Edit Wildlife Safari" 
      };
  
      const wildlifeSafari = await WildlifeSafari.findOne({ _id: req.params.id });
  
      res.render('admin/edit-ws', {
        locals,
        wildlifeSafari,
        layout: adminLayout
      })
  
    } catch (error) {
      console.log(error);
    }
  });

  //Post
  // Edit Wildlife Safari
router.post('/edit-ws/:id', authMiddleware, upload.fields([{ name: 'header-image', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
      const wildlifeSafariId = req.params.id;
      const wildlifeSafari = await WildlifeSafari.findById(wildlifeSafariId);
  
      const headerImageObject = {
        data: req.files['header-image'][0].buffer,
        contentType: req.files['header-image'][0].mimetype
    };

    const imageObject = {
        data: req.files['image'][0].buffer,
        contentType: req.files['image'][0].mimetype
    };
      // Update the gorillaSafari properties
      wildlifeSafari.country= req.body.country,
      wildlifeSafari.title= req.body.title,
      wildlifeSafari.overview= req.body.overview,
      wildlifeSafari.days= req.body.days,
      wildlifeSafari.price= req.body.price,
      wildlifeSafari.when= req.body.when, 
      wildlifeSafari.details= req.body.details,
      wildlifeSafari.disclaimer= req.body.disclaimer,
      wildlifeSafari.accommodation= req.body.accommodation,
      wildlifeSafari.preview= req.body.preview,
      wildlifeSafari.itinerary= req.body.itinerary,
      wildlifeSafari.headerImage= headerImageObject,
      wildlifeSafari.image= imageObject
  
      await wildlifeSafari.save();
      res.redirect('/admin');
      req.flash('success', 'Wildlife Safari Updated');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
 * DELETE Wildlife Safari
 * Admin Delete Wildlife Safari
 */
router.delete('/delete-ws/:id', authMiddleware, async (req, res) => {
    try {
        await WildlifeSafari.deleteOne({ _id: req.params.id });
        res.redirect('/admin');
        req.flash('success', 'Wildlife Safari Deleted');
    } catch (error) {
        console.log(error);
    }
});



// Get Admin add activity
router.get('/add-activity', authMiddleware, (req, res) => {
    const locals = {
        title: 'Add Activity'
    };
    res.render('admin/add-activities', {
        locals,
        layout: adminLayout
    });
});

// Post Admin add activity
router.post('/add-activity', authMiddleware, upload.fields([{ name: 'header-image', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
        
        const headerImageObject = {
            data: req.files['header-image'][0].buffer,
            contentType: req.files['header-image'][0].mimetype
        };

        const imageObject = {
            data: req.files['image'][0].buffer,
            contentType: req.files['image'][0].mimetype
        };

        const newActivity = new Activity({
            country: req.body.country,
            title: req.body.title,
            overview: req.body.overview,
            days: req.body.days,
            price: req.body.price,
            when: req.body.when, 
            details: req.body.details,
            disclaimer: req.body.disclaimer,
            accommodation: req.body.accommodation,
            preview: req.body.preview,
            itinerary: req.body.itinerary,
            headerImage: headerImageObject,
            image: imageObject
        });

        await Activity.create(newActivity);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
});

//Get
//Admin Edit Activity
router.get('/edit-activities/:id', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: "Edit Activity" 
      };
  
      const activity = await Activity.findOne({ _id: req.params.id });
  
      res.render('admin/edit-activities', {
        locals,
        activity,
        layout: adminLayout
      })
  
    } catch (error) {
      console.log(error);
    }
  });



//Post
//Admin Edit Activities
router.post('/edit-activities/:id', authMiddleware, upload.fields([{ name: 'header-image', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
      const activityId = req.params.id;
      const activity = await Activity.findById(activityId);
  
      const headerImageObject = {
        data: req.files['header-image'][0].buffer,
        contentType: req.files['header-image'][0].mimetype
    };

    const imageObject = {
        data: req.files['image'][0].buffer,
        contentType: req.files['image'][0].mimetype
    };
      // Update the activity properties
      activity.country= req.body.country,
      activity.title= req.body.title,
      activity.overview= req.body.overview,
      activity.days= req.body.days,
      activity.price= req.body.price,
      activity.disclaimer= req.body.disclaimer,
      activity.when= req.body.when, 
      activity.details= req.body.details,
      activity.accommodation= req.body.accommodation,
      activity.preview= req.body.preview,
      activity.itinerary= req.body.itinerary,
      activity.headerImage= headerImageObject,
      activity.image= imageObject
  
      await activity.save();
      res.redirect('/admin');
      req.flash('success', 'Activity Updated');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
 * DELETE Activity
 * Admin Delete Activity
 */
router.delete('/delete-activity/:id', authMiddleware, async (req, res) => {
    try {
        await Activity.deleteOne({ _id: req.params.id });
        res.redirect('/admin');
        req.flash('success', 'Activity Deleted');
    } catch (error) {
        console.log(error);
    }
});


//Post
//Admin edit gs
router.post('/edit-gs/:id', authMiddleware, upload.fields([{ name: 'header-image', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
      const gorillaSafariId = req.params.id;
      const gorillaSafari = await GorillaSafari.findById(gorillaSafariId); // Fetch the gorillaSafari from the database
  
      const headerImageObject = {
        data: req.files['header-image'][0].buffer,
        contentType: req.files['header-image'][0].mimetype
    };

    const imageObject = {
        data: req.files['image'][0].buffer,
        contentType: req.files['image'][0].mimetype
    };
      // Update the gorillaSafari properties
      gorillaSafari.country= req.body.country,
      gorillaSafari.title= req.body.title,
      gorillaSafari.overview= req.body.overview,
      gorillaSafari.days= req.body.days,
      gorillaSafari.price= req.body.price,
      gorillaSafari.when= req.body.when, 
      gorillaSafari.details= req.body.details,
      gorillaSafari.disclaimer= req.body.disclaimer,
      gorillaSafari.accommodation= req.body.accommodation,
      gorillaSafari.preview= req.body.preview,
      gorillaSafari.itinerary= req.body.itinerary,
      gorillaSafari.headerImage= headerImageObject,
      gorillaSafari.image= imageObject
  
      await gorillaSafari.save(); // Save the updated gorillaSafari
  
      res.redirect('/admin');
      req.flash('success', 'GorillaSafari Updated'); // Redirect to the latest-projects page
    } catch (error) {
      console.error(error);
      // Handle error response
      res.status(500).json({ error: 'Internal server error' });
    }
  });

/**
 * DELETE POST
 * Admin Delete Post
 */
router.delete('/delete-gs/:id', authMiddleware, async (req, res) => {

    try {
        await GorillaSafari.deleteOne( { _id: req.params.id });
        res.redirect('/admin');
        req.flash('success', 'Post Deleted');
    } catch (error) {
        console.log(error);
    }
});

// GET About Us page
router.get('/about-Us', async (req, res) => {
  try {
      // Assuming 'AboutUs' is your model for the about us content
      const aboutUsContent = await AboutUs.find();
      const faqs = await Faq.find(); 
      const aboutUs = await AboutUs.findById(req.params.id);
      const locals = {
          title: 'About Us', 
      }; 

      res.render('admin/about-Us', { 
          locals,
          layout: adminLayout,
          aboutUsContent,
          aboutUs,
          faqs
      });

  } catch (error) {
      console.error(error);
      res.redirect('/'); // You can redirect to an error page or the home page if an error occurs
  }
});


// Get Admin add aboutUs
router.get('/add-aboutUs', authMiddleware, (req, res) => {
  const locals = {
      title: 'Add About Us'
  };
  res.render('admin/add-aboutUs', {
      locals,
      layout: adminLayout
  });
});


// Post Admin add aboutUs
router.post('/add-aboutUs', authMiddleware,  async (req, res) => {
  try {

      const newAboutUs = new AboutUs({
          responsibleTravelPolicy: req.body.responsibleTravelPolicy,
          helpAndFAQ: req.body.helpAndFAQ,
          whyTravelWonders: req.body.whyTravelWonders,
          contactUs: req.body.contactUs,
          privacyPolicy: req.body.privacyPolicy,
          newNormsAndSafariGuides: req.body.newNormsAndSafariGuides
      });

      await AboutUs.create(newAboutUs);
      res.redirect('/about-Us');
  } catch (error) {
      console.error(error);
      res.redirect('/about-Us');
  }
});

// Get Admin Edit About Us
router.get('/edit-aboutUs/:id', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit About Us" 
    };

    const aboutUs = await AboutUs.findOne({ _id: req.params.id });

    res.render('admin/edit-aboutUs', {
      locals,
      aboutUs,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }
});

// Post Admin Edit About Us
router.post('/edit-aboutUs/:id', authMiddleware, async (req, res) => {
  try {
      const aboutUs = await AboutUs.findById(req.params.id);
      if (!aboutUs) {
        // Handle the case where the About Us data does not exist
        return res.redirect('/aboutUs');
      }

      aboutUs.responsibleTravelPolicy = req.body.responsibleTravelPolicy;
      aboutUs.helpAndFAQ = req.body.helpAndFAQ;
      aboutUs.whyTravelWonders = req.body.whyTravelWonders;
      aboutUs.contactUs = req.body.contactUs;
      aboutUs.privacyPolicy = req.body.privacyPolicy;
      aboutUs.newNormsAndSafariGuides = req.body.newNormsAndSafariGuides;

      await aboutUs.save();
      res.redirect('/about-Us');
  } catch (error) {
      console.error(error);
      res.redirect('/about-Us');
  }
});

/**
 * DELETE ABOUT US
 * Admin Delete About Us
 */
router.delete('/delete-aboutUs/:id', authMiddleware, async (req, res) => {
  try {
      await AboutUs.deleteOne({ _id: req.params.id });
      res.redirect('/about-Us');
      req.flash('success', 'About Us Deleted');
  } catch (error) {
      console.error(error);
  }
});

  //**
  //GET
 // Admin Add faqs
 //
 router.get('/add-faq', authMiddleware, (req, res) => {
  const locals = {
      title: 'Add faq',
      layout: adminLayout,
    };
  res.render('admin/add-faq', locals); // Replace with your actual view name
});

//**
//POST
// Admin Add faqs
//
router.post('/add-faq', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const newfaq = new Faq ({
      qstn: req.body.qstn,
      ans: req.body.ans,
      description: req.body.description
    });

    await Faq.create(newfaq);
    console.log(newfaq);
    res.redirect('/about-Us');// Redirect to the dashboard or other appropriate page
  } catch (error) {
    console.error(error);
    // Handle error response
    res.status(500).json({ error: 'Internal server error' });
  }
});

//**
//GET
// Admin Edit faqs
//
router.get('/edit-faq/:id', authMiddleware, async (req, res) => {
  try {
      const locals = {
          title: 'Edit faq'
      };

      const faq = await Faq.findOne({ _id: req.params.id });

      res.render('admin/edit-faq', { 
          locals,
          faq,
          layout: adminLayout,
       });
  } catch (error) {
      console.error(error);
      // Handle error response
      res.status(500).render( { error: 'Internal server error' });
  }
});

//**
//POST
// Admin Edit faqs
//
router.post('/edit-faq/:id', authMiddleware, async (req, res) => {
  try {
    const faqId = req.params.id;
    const faq = await Faq.findById(faqId);

    if (!faq) {
      // faq not found
      return res.status(404).json({ error: 'faq not found' });
    }

    // Update the faq properties
    faq.qstn = req.body.qstn;
    faq.ans = req.body.ans;
    faq.description = req.body.description;

    await Faq.save();

    res.redirect('/about-Us');
  } catch (error) {
    console.error(error);

    // Handle error response
    res.status(500).json({ error: 'Internal server error' });
  }
});

   //**
//DELETE
// Admin Delete faq
//
router.delete('/delete-faq/:id', authMiddleware, async (req, res) => {
  try {
    const faqId = req.params.id;
    const faq = await Faq.findById(faqId); // Fetch the faq from the database

    if (!faq) {
      return res.status(404).json({ error: 'faq not found' });
    }

    await Faq.deleteOne( { _id: req.params.id }); // Remove the faq from the database

    res.redirect('/about-Us'); 
  } catch (error) {
    console.error(error);
    // Handle error response
    res.status(500).json({ error: 'Internal server error' });
  }
});






//Uganda Gorilla Safaris
const fetchUgGs = async () => {
    try {
      const ugandaGorillaSafaris = await GorillaSafari.find({ country: 'Uganda' });
      return ugandaGorillaSafaris;
    } catch (error) {
      console.log(error);
      return [];
    }
};

//Kenya Gorilla Safaris
const fetchKyGs = async () => {
    try {
      const kenyaGorillaSafaris = await GorillaSafari.find({ country: 'Kenya' });
      return kenyaGorillaSafaris;
    } catch (error) {
      console.log(error);
      return [];
    }
};

//Tanzania Gorilla Safaris
const fetchTzGs = async () => {
    try {
      const tanzaniaGorillaSafaris = await GorillaSafari.find({ country: 'Tanzania' });
      return tanzaniaGorillaSafaris;
    } catch (error) {
      console.log(error);
      return [];
    }
};
  
//Rwanda Gorilla Safaris
const fetchRdGs = async () => {
    try {
      const rwandaGorillaSafaris = await GorillaSafari.find({ country: 'Rwanda' });
      return rwandaGorillaSafaris;
    } catch (error) {
      console.log(error);
      return [];
    }
};
  
//Congo Gorilla Safaris
const fetchCgGs = async () => {
    try {
      const congoGorillaSafaris = await GorillaSafari.find({ country: 'Congo' });
      return congoGorillaSafaris;
    } catch (error) {
      console.log(error);
      return [];
    }
};

//Uganda tours
const fetchUgTours = async () => {
  try {
      const ugandaTours = await Tour.find({ country: 'Uganda' });
      return ugandaTours;
  } catch (error) {
      console.log(error);
      return [];
  }
};

//Kenya tours
const fetchKyTours = async () => {
  try {
      const kenyaTours = await Tour.find({ country: 'Kenya' });
      return kenyaTours;
  } catch (error) {
      console.log(error);
      return [];
  }
};

//Tanzania tours
const fetchTzTours = async () => {
  try {
      const tanzaniaTours = await Tour.find({ country: 'Tanzania' });
      return tanzaniaTours;
  } catch (error) {
      console.log(error);
      return [];
  }
};

//Congo tours
const fetchCgTours = async () => {
  try {
      const congoTours = await Tour.find({ country: 'Congo' });
      return congoTours;
  } catch (error) {
      console.log(error);
      return [];
  }
};

//Rwanda tours
const fetchRdTours = async () => {
  try {
      const rwandaTours = await Tour.find({ country: 'Rwanda' });
      return rwandaTours;
  } catch (error) {
      console.log(error);
      return [];
  }
};

//Uganda Destinations
const fetchUgDestinations = async () => {
  try {
      const ugandaDestinations = await Destination.find({ country: 'Uganda' });
      return ugandaDestinations;
  } catch (error) {
      console.log(error);
      return [];
  }
};

//Kenya Destinations
const fetchKyDestinations = async () => {
  try {
      const kenyaDestinations = await Destination.find({ country: 'Kenya' });
      return kenyaDestinations;
  } catch (error) {
      console.log(error);
      return [];
  }
};

//Tanzania Destinations
const fetchTzDestinations = async () => {
  try {
      const tanzaniaDestinations = await Destination.find({ country: 'Tanzania' });
      return tanzaniaDestinations;
  } catch (error) {
      console.log(error);
      return [];
  }
};

//Congo Destinations
const fetchCgDestinations = async () => {
  try {
      const congoDestinations = await Destination.find({ country: 'Congo' });
      return congoDestinations;
  } catch (error) {
      console.log(error);
      return [];
  }
};

//Rwanda Destinations
const fetchRdDestinations = async () => {
  try {
      const rwandaDestinations = await Destination.find({ country: 'Rwanda' });
      return rwandaDestinations;
  } catch (error) {
      console.log(error);
      return [];
  }
};

//Wildlife Safaris
//Uganda Wildlifw Safaris
const fetchUgWs = async () => {
  try {
      const ugandaWildlifeSafaris = await WildlifeSafari.find({ country: 'Uganda' });
      return ugandaWildlifeSafaris;
  } catch (error) {
      console.log(error);
      return [];
  }
};

// Kenya Wildlife Safaris
const fetchKyWs = async () => {
  try {
      const kenyaWildlifeSafaris = await WildlifeSafari.find({ country: 'Kenya' });
      return kenyaWildlifeSafaris;
  } catch (error) {
      console.log(error);
      return [];
  }
};

// Tanzania Wildlife Safaris
const fetchTzWs = async () => {
  try {
      const tanzaniaWildlifeSafaris = await WildlifeSafari.find({ country: 'Tanzania' });
      return tanzaniaWildlifeSafaris;
  } catch (error) {
      console.log(error);
      return [];
  }
};

// Kenya Congo Safaris
const fetchCgWs = async () => {
  try {
      const congoWildlifeSafaris = await WildlifeSafari.find({ country: 'Congo' });
      return congoWildlifeSafaris;
  } catch (error) {
      console.log(error);
      return [];
  }
};

// Rwanda Wildlife Safaris
const fetchRdWs = async () => {
  try {
      const rwandaWildlifeSafaris = await WildlifeSafari.find({ country: 'Rwanda' });
      return rwandaWildlifeSafaris;
  } catch (error) {
      console.log(error);
      return [];
  }
};

//Activities
//Uganda Activities
const fetchUgActivities = async () => {
  try {
      const ugandaActivities = await Activity.find({ country: 'Uganda' });
      return ugandaActivities;
  } catch (error) {
      console.log(error);
      return [];
  }
};

// Kenya Activities
const fetchKyActivities = async () => {
  try {
      const kenyaActivities = await Activity.find({ country: 'Kenya' });
      return kenyaActivities;
  } catch (error) {
      console.log(error);
      return [];
  }
};


// Tanzania Activities
const fetchTzActivities = async () => {
  try {
      const tanzaniaActivities = await Activity.find({ country: 'Tanzania' });
      return tanzaniaActivities;
  } catch (error) {
      console.log(error);
      return [];
  }
};

// Congo Activities
const fetchCgActivities = async () => {
  try {
      const congoActivities = await Activity.find({ country: 'Congo' });
      return congoActivities;
  } catch (error) {
      console.log(error);
      return [];
  }
};

//Rwanda Activities
const fetchRdActivities = async () => {
  try {
      const rwandaActivities = await Activity.find({ country: 'Rwanda' });
      return rwandaActivities;
  } catch (error) {
      console.log(error);
      return [];
  }
};

  
  



  




module.exports = router;
