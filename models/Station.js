import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Station name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: -180,
    max: 180
  },
  chargerType: {
    type: String,
    enum: ['Level 1', 'Level 2', 'DC Fast Charging', 'Tesla Supercharger'],
    required: true
  },
  chargingSpeed: {
    type: Number,
    required: true,
    description: 'kW rating'
  },
  price: {
    type: Number,
    required: true,
    description: 'Price per kWh in dollars'
  },
  totalChargers: {
    type: Number,
    required: true,
    min: 1
  },
  availableChargers: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(v) {
        return v <= this.totalChargers;
      },
      message: 'Available chargers cannot exceed total chargers'
    }
  },
  queueTime: {
    type: Number,
    default: 0,
    description: 'Estimated queue time in minutes'
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'offline'],
    default: 'active'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.0
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for geospatial queries
stationSchema.index({ latitude: 1, longitude: 1 });

export default mongoose.model('Station', stationSchema);
