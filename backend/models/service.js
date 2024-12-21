const mongoose =require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  professional: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Service = mongoose.model('Service', serviceSchema);

module.exports= Service;