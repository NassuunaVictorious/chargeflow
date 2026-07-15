import express from 'express';
import Report from '../models/Report.js';
import Station from '../models/Station.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reports - Get all reports (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('station', 'name address')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ reports, count: reports.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/reports/station/:stationId
router.get('/station/:stationId', async (req, res) => {
  try {
    const reports = await Report.find({ station: req.params.stationId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/reports - Create a report
router.post('/', protect, async (req, res) => {
  try {
    const { station: stationId, type, description } = req.body;

    const station = await Station.findById(stationId);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    const report = await Report.create({
      station: stationId,
      user: req.user._id,
      type,
      description
    });

    const populated = await Report.findById(report._id)
      .populate('station', 'name address')
      .populate('user', 'name');

    // Emit via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('newReport', populated);
    }

    res.status(201).json({ report: populated });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/reports/:id/status - Update report status (admin)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('station', 'name address')
     .populate('user', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ report });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/reports/stats - Report statistics (admin)
router.get('/stats/summary', protect, adminOnly, async (req, res) => {
  try {
    const total = await Report.countDocuments();
    const pending = await Report.countDocuments({ status: 'pending' });
    const resolved = await Report.countDocuments({ status: 'resolved' });
    const byType = await Report.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({ total, pending, resolved, byType });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
