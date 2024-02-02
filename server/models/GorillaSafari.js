const mongoose = require('mongoose');

const gorillaSafariSchema = new mongoose.Schema({
    country: {
        type: String,
        required: Boolean
    },
    title: {
        type: String,
        required: Boolean
    },
    overview: {
        type: String,
        required: Boolean
    },
    days: {
        type: String,
        required: Boolean
    },
    price: {
        type: String,
        required: Boolean
    },
    disclaimer: {
        type: String,
        required: Boolean
    },
    details: {
        type: String,
        required: Boolean
    },
    when: {
        type: String,
        required: Boolean
    },
    accommodation: {
        type: String,
        required: Boolean
    },
    preview: {
        type: String,
        required: Boolean
    },
    itinerary: {
        type: String,
        required: Boolean
    },
    headerImage: {
        type: String, 
        required: Boolean,
    },
    image: { 
        type: String, 
        required: Boolean, 
      },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const GorillaSafari = mongoose.model('GorillaSafari', gorillaSafariSchema);

module.exports = GorillaSafari;