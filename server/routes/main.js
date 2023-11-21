const express = require('express');
const router = express.Router();
const GorillaSafari = require('../models/GorillaSafari');
const Activity = require('../models/Activity');
const AboutUs = require('../models/AboutUs');
const WildlifeSafari = require('../models/WildlifeSafari');
const Tour = require('../models/Tour');
const { Faq, Ans } = require('../models/Faq');
const Destination = require('../models/Destination');

//Routes
router.get('', async (req, res) => {
    const locals = {
        title: 'Ecowonders',
        description: 'The official website for Ecowonders Safaris'
    }

    const popularPackages = await getPopularPackages();
    const faqs = await Faq.find(); 
    const destinations = await Destination.find();
    const popularGorillaSafaris = await GorillaSafari.aggregate([
        {
          $match: {
            // Define your filtering criteria here
            views: { $gt: 100 }
          }
        },
        {
          $project: {
            // Only include the fields that you need in the results.
            _id: 1,
            name: 1,
            views: 1
          }
        },
        {
          $sort: {
            views: -1
          }
        },
        {
          $limit: 6
        }
    ], { allowDiskUse: true });

    const allPackages = await getAllPackages();

      
      
      
      
    res.render('index', {
        locals, 
        popularPackages,
        popularGorillaSafaris,
        allPackages,
        faqs,
        destinations
    });
});

/* GORILLA SAFARIS */


/* Gorilla safari Uganda */
router.get('/gorilla-safari-uganda', async (req, res) => {

    let slug = req.params.id;
        const gorillaSafari = await GorillaSafari.findById(slug);
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const ugandaGorillaSafaris = await GorillaSafari.aggregate([
            { $match: { country: 'Uganda' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, preview:1, days:1, price:1} },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
          ]);

          for (const gorillaSafari of ugandaGorillaSafaris) {
            if (gorillaSafari.image && gorillaSafari.image.data && gorillaSafari.image.contentType) {
                gorillaSafari.image.data = gorillaSafari.image.data.toString('base64');
            }
        }

        const count = await GorillaSafari.countDocuments({ country: 'Uganda' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        const faqs = await Faq.find(); 

        const locals = {
            title: 'Uganda Gorilla Safaris',
            description: 'Gorilla Safari packages in Uganda'
        };

        const allPackages = await getAllPackages();



        
        

        res.render('gorilla-safari-uganda', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            ugandaGorillaSafaris,
            gorillaSafari,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* Gorilla safari Congo */
router.get('/gorilla-safari-congo', async (req, res) => {

    let slug = req.params.id;
    const gorillaSafari = await GorillaSafari.findById(slug);
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const congoGorillaSafaris = await GorillaSafari.aggregate([
            { $match: { country: 'Congo' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, preview: 1, days: 1, price: 1 } },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        for (const gorillaSafari of congoGorillaSafaris) {
            if (gorillaSafari.image && gorillaSafari.image.data && gorillaSafari.image.contentType) {
                gorillaSafari.image.data = gorillaSafari.image.data.toString('base64');
            }
        }

        const count = await GorillaSafari.countDocuments({ country: 'Congo' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const locals = {
            title: 'Congo Gorilla Safaris',
            description: 'Gorilla Safari packages in Congo'
        };

        const allPackages = await getAllPackages();
        const faqs = await Faq.find(); 

        res.render('gorilla-safari-congo', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            congoGorillaSafaris,
            gorillaSafari,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* Gorilla safari Rwanda */
router.get('/gorilla-safari-rwanda', async (req, res) => {

    let slug = req.params.id;
    const gorillaSafari = await GorillaSafari.findById(slug);
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const rwandaGorillaSafaris = await GorillaSafari.aggregate([
            { $match: { country: 'Rwanda' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, preview: 1, days: 1, price: 1 } },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        for (const gorillaSafari of rwandaGorillaSafaris) {
            if (gorillaSafari.image && gorillaSafari.image.data && gorillaSafari.image.contentType) {
                gorillaSafari.image.data = gorillaSafari.image.data.toString('base64');
            }
        }

        const count = await GorillaSafari.countDocuments({ country: 'Rwanda' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const locals = {
            title: 'Rwanda Gorilla Safaris',
            description: 'Gorilla Safari packages in Rwanda'
        };

        const allPackages = await getAllPackages();
        const faqs = await Faq.find(); 

        res.render('gorilla-safari-rwanda', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            rwandaGorillaSafaris,
            gorillaSafari,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* DESTINATIONS */

/* Destination Uganda */
/* Wildlife safari Uganda */
router.get('/uganda-safaris', async (req, res) => {
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const ugandaWildlifeSafaris = await WildlifeSafari.aggregate([
            { $match: { country: 'Uganda' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, preview: 1, days: 1, price: 1 } },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        for (const wildlifeSafari of ugandaWildlifeSafaris) {
            if (wildlifeSafari.image && wildlifeSafari.image.data && wildlifeSafari.image.contentType) {
                wildlifeSafari.image.data = wildlifeSafari.image.data.toString('base64');
            }
        }

        const count = await WildlifeSafari.countDocuments({ country: 'Uganda' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const locals = {
            title: 'Uganda Wildlife Safaris',
            description: 'Wildlife Safari packages in Uganda'
        };

        const allPackages = await getAllPackages();
        const faqs = await Faq.find(); 

        res.render('uganda-safaris', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            ugandaWildlifeSafaris,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* Tours */
/* Tours in Uganda */
router.get('/uganda-tours', async (req, res) => {
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const ugandaTours = await Tour.aggregate([
            { $match: { country: 'Uganda' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, preview: 1, days: 1, price: 1 } },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        for (const tour of ugandaTours) {
            if (tour.image && tour.image.data && tour.image.contentType) {
                tour.image.data = tour.image.data.toString('base64');
            }
        }

        const count = await Tour.countDocuments({ country: 'Uganda' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        const faqs = await Faq.find(); 

        const locals = {
            title: 'Tours in Uganda',
            description: 'Tour packages in Uganda'
        };

        const allPackages = await getAllPackages();

        res.render('uganda-tours', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            ugandaTours,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* Activities in Uganda */
router.get('/uganda-activities', async (req, res) => {
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const ugandaActivities = await Activity.aggregate([
            { $match: { country: 'Uganda' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, description: 1, price: 1 } },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        for (const activity of ugandaActivities) {
            if (activity.image && activity.image.data && activity.image.contentType) {
                activity.image.data = activity.image.data.toString('base64');
            }
        }

        const count = await Activity.countDocuments({ country: 'Uganda' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const locals = {
            title: 'Activities in Uganda',
            description: 'Exciting activities in Uganda'
        };

        const allPackages = await getAllPackages();
        const faqs = await Faq.find(); 

        res.render('uganda-activities', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            ugandaActivities,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* Destination Kenya */
/* Safaris */
/* Wildlife safari Kenya */
router.get('/kenya-safaris', async (req, res) => {
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const kenyaWildlifeSafaris = await WildlifeSafari.aggregate([
            { $match: { country: 'Kenya' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, preview: 1, days: 1, price: 1 } },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        for (const wildlifeSafari of kenyaWildlifeSafaris) {
            if (wildlifeSafari.image && wildlifeSafari.image.data && wildlifeSafari.image.contentType) {
                wildlifeSafari.image.data = wildlifeSafari.image.data.toString('base64');
            }
        }

        const count = await WildlifeSafari.countDocuments({ country: 'Kenya' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const locals = {
            title: 'Kenya Wildlife Safaris',
            description: 'Wildlife Safari packages in Kenya'
        };

        const allPackages = await getAllPackages();
        const faqs = await Faq.find(); 

        res.render('kenya-safaris', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            kenyaWildlifeSafaris,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* Tours in Kenya */
router.get('/kenya-tours', async (req, res) => {
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const kenyaTours = await Tour.aggregate([
            { $match: { country: 'Kenya' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, preview: 1, days: 1, price: 1 } },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        for (const tour of kenyaTours) {
            if (tour.image && tour.image.data && tour.image.contentType) {
                tour.image.data = tour.image.data.toString('base64');
            }
        }

        const count = await Tour.countDocuments({ country: 'Kenya' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const locals = {
            title: 'Tours in Kenya',
            description: 'Tour packages in Kenya'
        };

        const allPackages = await getAllPackages();
        const faqs = await Faq.find(); 

        res.render('kenya-tours', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            kenyaTours,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* Activities in Kenya */
router.get('/kenya-activities', async (req, res) => {
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const kenyaActivities = await Activity.aggregate([
            { $match: { country: 'Kenya' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, description: 1, price: 1 } },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        for (const activity of kenyaActivities) {
            if (activity.image && activity.image.data && activity.image.contentType) {
                activity.image.data = activity.image.data.toString('base64');
            }
        }

        const count = await Activity.countDocuments({ country: 'Kenya' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const locals = {
            title: 'Activities in Kenya',
            description: 'Exciting activities in Kenya'
        };

        const allPackages = await getAllPackages();
        const faqs = await Faq.find(); 

        res.render('kenya-activities', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            kenyaActivities,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* Destination Tanzania */
/* Wildlife safari Tanzania */
router.get('/tz-safaris', async (req, res) => {
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const tanzaniaWildlifeSafaris = await WildlifeSafari.aggregate([
            { $match: { country: 'Tanzania' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, preview: 1, days: 1, price: 1 } },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        for (const wildlifeSafari of tanzaniaWildlifeSafaris) {
            if (wildlifeSafari.image && wildlifeSafari.image.data && wildlifeSafari.image.contentType) {
                wildlifeSafari.image.data = wildlifeSafari.image.data.toString('base64');
            }
        }

        const count = await WildlifeSafari.countDocuments({ country: 'Tanzania' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const locals = {
            title: 'Tanzania Wildlife Safaris',
            description: 'Wildlife Safari packages in Tanzania'
        };

        const allPackages = await getAllPackages();
        const faqs = await Faq.find(); 

        res.render('tz-safaris', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            tanzaniaWildlifeSafaris,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* Tours in Tanzania */
router.get('/tz-tours', async (req, res) => {
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const tanzaniaTours = await Tour.aggregate([
            { $match: { country: 'Tanzania' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, preview: 1, days: 1, price: 1 } },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        for (const tour of tanzaniaTours) {
            if (tour.image && tour.image.data && tour.image.contentType) {
                tour.image.data = tour.image.data.toString('base64');
            }
        }

        const count = await Tour.countDocuments({ country: 'Tanzania' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const locals = {
            title: 'Tours in Tanzania',
            description: 'Tour packages in Tanzania'
        };

        const allPackages = await getAllPackages();
        const faqs = await Faq.find(); 

        res.render('tz-tours', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            tanzaniaTours,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* Activities */
/* Activities in Tanzania */
router.get('/tz-activities', async (req, res) => {
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const tanzaniaActivities = await Activity.aggregate([
            { $match: { country: 'Tanzania' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, description: 1, price: 1 } },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        for (const activity of tanzaniaActivities) {
            if (activity.image && activity.image.data && activity.image.contentType) {
                activity.image.data = activity.image.data.toString('base64');
            }
        }

        const count = await Activity.countDocuments({ country: 'Tanzania' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const locals = {
            title: 'Activities in Tanzania',
            description: 'Exciting activities in Tanzania'
        };

        const allPackages = await getAllPackages();
        const faqs = await Faq.find(); 

        res.render('activities-tanzania', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            tanzaniaActivities,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* Destination Rwanda */
/* Safaris */
/* Wildlife safari Rwanda */
router.get('/rwanda-safaris', async (req, res) => {
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const rwandaWildlifeSafaris = await WildlifeSafari.aggregate([
            { $match: { country: 'Rwanda' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, preview: 1, days: 1, price: 1 } },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        for (const wildlifeSafari of rwandaWildlifeSafaris) {
            if (wildlifeSafari.image && wildlifeSafari.image.data && wildlifeSafari.image.contentType) {
                wildlifeSafari.image.data = wildlifeSafari.image.data.toString('base64');
            }
        }

        const count = await WildlifeSafari.countDocuments({ country: 'Rwanda' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const locals = {
            title: 'Rwanda Wildlife Safaris',
            description: 'Wildlife Safari packages in Rwanda'
        };

        const allPackages = await getAllPackages();
        const faqs = await Faq.find(); 

        res.render('rwanda-safaris', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            rwandaWildlifeSafaris,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* Tours in Rwanda */
router.get('/rwanda-tours', async (req, res) => {
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const rwandaTours = await Tour.aggregate([
            { $match: { country: 'Rwanda' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, preview: 1, days: 1, price: 1 } },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        for (const tour of rwandaTours) {
            if (tour.image && tour.image.data && tour.image.contentType) {
                tour.image.data = tour.image.data.toString('base64');
            }
        }

        const count = await Tour.countDocuments({ country: 'Rwanda' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const locals = {
            title: 'Tours in Rwanda',
            description: 'Tour packages in Rwanda'
        };

        const allPackages = await getAllPackages();
        const faqs = await Faq.find(); 

        res.render('rwanda-tours', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            rwandaTours,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* Activities in Rwanda */
router.get('/rwanda-activities', async (req, res) => {
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const rwandaActivities = await Activity.aggregate([
            { $match: { country: 'Rwanda' } },
            { $project: { _id: 1, title: 1, createdAt: 1, image: 1, description: 1, price: 1 } },
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]);

        for (const activity of rwandaActivities) {
            if (activity.image && activity.image.data && activity.image.contentType) {
                activity.image.data = activity.image.data.toString('base64');
            }
        }

        const count = await Activity.countDocuments({ country: 'Rwanda' });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const locals = {
            title: 'Activities in Rwanda',
            description: 'Exciting activities in Rwanda'
        };

        const allPackages = await getAllPackages();
        const faqs = await Faq.find(); 

        res.render('rwanda-activities', {
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            rwandaActivities,
            allPackages,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/* Content */

//Gorilla Safaris
router.get('/content-gs/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const gorillaSafari = await GorillaSafari.findById(slug);

        const locals = {
            title: gorillaSafari.title,
            description: gorillaSafari.preview
        }
    
        // Use $sample stage to select four random documents
        const gorillaSafaris = await GorillaSafari.aggregate([
        { $sample: { size: 4 } }, // Select four random documents
        { $project: { _id: 1, title: 1, createdAt: 1, image:1} },
        { $sort: { createdAt: -1 } }
        ], { allowDiskUse: true });
  
    
        // Count the total number of gorilla safaris.
        const count = await GorillaSafari.countDocuments();
        const faqs = await Faq.find(); 
    

        res.render('content-gs', {
            locals,
            gorillaSafari,
            gorillaSafaris,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//Wildlife Safaris
router.get('/content-ws/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const wildlifeSafari = await WildlifeSafari.findById(slug);

        const locals = {
            title: wildlifeSafari.title,
            description: wildlifeSafari.preview
        }

        const wildlifeSafaris = await WildlifeSafari.aggregate([
            { $sample: { size: 4 } }, // Select four random documents
            { $project: { _id: 1, title: 1, createdAt: 1, image:1} },
            { $sort: { createdAt: -1 } }
            ], { allowDiskUse: true });

        // Count the total number of wildlife safaris.
        const count = await WildlifeSafari.countDocuments();
        const faqs = await Faq.find(); 

        res.render('content-ws', {
            locals,
            wildlifeSafari,
            wildlifeSafaris,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


//Tours
router.get('/content-tours/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const tour = await Tour.findById(slug);

        const locals = {
            title: tour.title,
            description: tour.preview
        }

        const tours = await Tour.aggregate([
        { $sample: { size: 4 } }, // Select four random documents
        { $project: { _id: 1, title: 1, createdAt: 1, image:1} },
        { $sort: { createdAt: -1 } }
        ], { allowDiskUse: true });

        // Count the total number of tours.
        const count = await Tour.countDocuments();
        const faqs = await Faq.find(); 

        res.render('content-tours', {
            locals,
            tour,
            tours,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//destinations
router.get('/content-destinations/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const destination = await Destination.findById(slug);

        const locals = {
            title: destination.title,
            description: destination.preview
        }

        const destinations = await Destination.aggregate([
        { $sample: { size: 4 } }, // Select four random documents
        { $project: { _id: 1, title: 1, createdAt: 1, image:1} },
        { $sort: { createdAt: -1 } }
        ], { allowDiskUse: true });

        // Count the total number of destinations.
        const count = await Destination.countDocuments();
        const faqs = await Faq.find(); 

        res.render('content-destinations', {
            locals,
            destination,
            destinations,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


//Activities
router.get('/content-activities/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const activity = await Activity.findById(slug);

        const locals = {
            title: activity.title,
            description: activity.preview
        }

        const activities = await Activity.aggregate([
            { $sample: { size: 4 } }, // Select four random documents
            { $project: { _id: 1, title: 1, createdAt: 1, image:1} },
            { $sort: { createdAt: -1 } }
            ], { allowDiskUse: true });
        // Count the total number of activities.
        const count = await Activity.countDocuments();
        const faqs = await Faq.find(); 

        res.render('content-activities', {
            locals,
            activity,
            activities,
            faqs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/content-faq/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const faq = await Faq.findById(slug);
        const faqs = await Faq.find(); 

        const locals = {
            title: faq.title,
            description: faq.description
        }

        const allPackages = await getAllPackages();

        res.render('content-faq', {
            locals,
            faq,
            faqs,
            allPackages
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}); 

  



/* About Us */
router.get('/aboutus', async (req, res) => {

    const aboutUsContent = await AboutUs.find();
    const aboutUs = await AboutUs.findById(req.params.id);
    const faqs = await Faq.find(); 

    const locals = {
        title: 'About Us',
        description: 'The official website for Ecowonders Safaris'
    }
    res.render('aboutus', {
        locals,
        aboutUsContent,
        aboutUs,
        faqs
    });
});


/* logics */
/* popular packages */
/* All packages */
const getAllPackages = async () => {
    try {
        const gorillaSafaris = await GorillaSafari.aggregate([{ $sample: { size: 1 } }]).allowDiskUse(true);
        const activities = await Activity.aggregate([{ $sample: { size: 1 } }]).allowDiskUse(true);
        const wildlifeSafaris = await WildlifeSafari.aggregate([{ $sample: { size: 1 } }]).allowDiskUse(true);
        const tours = await Tour.aggregate([{ $sample: { size: 1 } }]).allowDiskUse(true);

        const allPackages = gorillaSafaris.concat(activities, wildlifeSafaris, tours);
        return allPackages;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


// Function to retrieve the most viewed packages
const getPopularPackages = async () => {
    try {
        const gorillaSafaris = await GorillaSafari.aggregate([
            { $sort: { views: -1 } },
            { $limit: 2 }
        ]).allowDiskUse(true);

        const activities = await Activity.aggregate([
            { $sort: { views: -1 } },
            { $limit: 2 }
        ]).allowDiskUse(true);

        const wildlifeSafaris = await WildlifeSafari.aggregate([
            { $sort: { views: -1 } },
            { $limit: 2 }
        ]).allowDiskUse(true);

        const tours = await Tour.aggregate([
            { $sort: { views: -1 } },
            { $limit: 2 }
        ]).allowDiskUse(true);

        const allPackages = gorillaSafaris.concat(activities, wildlifeSafaris, tours);
        allPackages.sort((a, b) => b.views - a.views);

        return allPackages.slice(0, 2);
    } catch (error) {
        console.error(error);
        throw error;
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