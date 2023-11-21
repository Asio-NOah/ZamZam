const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema({
  responsibleTravelPolicy: {
    type: String,
    required: true
  },
  helpAndFAQ: {
    type: String,
    required: true
  },
  whyTravelWonders: {
    type: String,
    required: true
  },
  contactUs: {
    type: String,
    required: true
  },
  privacyPolicy: {
    type: String,
    required: true
  },
  newNormsAndSafariGuides: {
    type: String,
    required: true
  }
});

const AboutUs = mongoose.model('AboutUs', aboutUsSchema);

module.exports = AboutUs;
