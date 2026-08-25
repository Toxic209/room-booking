import mongoose from 'mongoose';
import BookingService from '../services/bookingService.js';

class BookingController {
  static async getAll(req, res, next) {
    try {
      res.json(await BookingService.getAll());
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid booking id' });
      }
      const booking = await BookingService.getById(req.params.id);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      res.json(booking);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const booking = await BookingService.create(req.body);
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid booking id' });
      }
      const booking = await BookingService.update(req.params.id, req.body);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      res.json(booking);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid booking id' });
      }
      const booking = await BookingService.remove(req.params.id);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default BookingController;
