import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    roomNo: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
    },
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
  },
  { timestamps: true }
);

bookingSchema.path('checkOut').validate(function (value) {
  return !this.checkIn || value > this.checkIn;
}, 'Check-out must be after check-in');

export default mongoose.model('Booking', bookingSchema);
