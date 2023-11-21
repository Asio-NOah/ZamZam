const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    
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
    details: {
        type: String,
        required: Boolean
    },
    when: {
        type: String,
        required: Boolean
    },
    headerImage: {
        data: Buffer, 
        contentType: String, 
        required: Boolean,
    },
    image: {
        data: Buffer, 
        contentType: String, 
        required: Boolean,
    }
});

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;
