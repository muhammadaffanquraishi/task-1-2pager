const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  keywords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Keyword',  // Reference to Keyword model
  }],
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;