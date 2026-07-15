import express from 'express';
import Station from '../models/Station.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stations - Get all stations
router.get('/', async (req, res) => {
  try {
    const { status, chargerType, minSpeed, maxPrice } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (chargerType) filter.chargerType = chargerType;
    if (minSpeed) filter.chargingSpeed = { $gte: Number(minSpeed) };
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };

    const stations = await Station.find(filter).sort({ name: 1 });
    res.json({ stations, count: stations.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/stations/recommend - Smart recommendation algorithm
router.get('/recommend', protect, async (req, res) => {
  try {
    const { battery = 50, latitude, longitude } = req.query;
    const userLat = parseFloat(latitude) || 40.7128;
    const userLng = parseFloat(longitude) || -74.006;
    const currentBattery = Math.max(0, Math.min(100, parseFloat(battery)));

    const stations = await Station.find({ status: 'active' });

    if (stations.length === 0) {
      return res.json({ recommendation: null, message: 'No active stations found' });
    }

    // Calculate score for each station
    const scoredStations = stations.map(station => {
      const latDiff = station.latitude - userLat;
      const lngDiff = station.longitude - userLng;
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111.32; // km

      // Normalize factors (0-1 scale)
      const distanceScore = Math.max(0, 1 - distance / 100);
      const queueScore = Math.max(0, 1 - station.queueTime / 60);
      const priceScore = Math.max(0, 1 - station.price / 1.0);
      const availabilityScore = station.availableChargers / station.totalChargers;
      const speedScore = Math.min(1, station.chargingSpeed / 350);

      // Weights
      const wDistance = 0.30;
      const wQueue = 0.25;
      const wPrice = 0.20;
      const wAvailability = 0.15;
      const wSpeed = 0.10;

      // Battery urgency multiplier - lower battery = higher urgency
      const urgencyMultiplier = 1 + (1 - currentBattery / 100) * 0.5;

      const score = (
        wDistance * distanceScore +
        wQueue * queueScore +
        wPrice * priceScore +
        wAvailability * availabilityScore +
        wSpeed * speedScore
      ) * urgencyMultiplier;

      return {
        ...station.toObject(),
        distance: Math.round(distance * 100) / 100,
        score: Math.round(score * 1000) / 1000
      };
    });

    // Sort by score descending
    scoredStations.sort((a, b) => b.score - a.score);

    res.json({
      recommendation: scoredStations[0],
      alternatives: scoredStations.slice(1, 4),
      allStations: scoredStations,
      userBattery: currentBattery
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/stations/:id
router.get('/:id', async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.json({ station });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/stations - Create station (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const station = await Station.create(req.body);
    res.status(201).json({ station });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/stations/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const station = await Station.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.json({ station });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/stations/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const station = await Station.findByIdAndDelete(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.json({ message: 'Station deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
