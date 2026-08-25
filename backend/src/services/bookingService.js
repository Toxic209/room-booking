import Booking from '../models/Booking.js';

class BookingService {
  static getAll() {
    return Booking.find().sort({ checkIn: 1, createdAt: -1 });
  }

  static getById(id) {
    return Booking.findById(id);
  }

  static create(data) {
    return Booking.create(data);
  }

  static update(id, data) {
    return Booking.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  static remove(id) {
    return Booking.findByIdAndDelete(id);
  }
}

export default BookingService;
