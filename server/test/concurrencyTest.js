require('dotenv').config();
const mongoose = require('mongoose');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const User = require('../models/User');

const runConcurrencyTest = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cinebook');
  console.log('[Test] Connected to MongoDB for concurrency test.');

  try {
    const user = await User.findOne({ email: 'user@cinebook.com' });
    const show = await Show.findOne({ isActive: true });

    if (!user || !show) {
      console.error('User or Show not found for test');
      process.exit(1);
    }

    const testSeat = 'H12';
    console.log(`[Test] Target Seat for race condition: ${testSeat} on Show ${show._id}`);

    // Ensure testSeat is not already booked
    await Show.findByIdAndUpdate(show._id, { $pull: { bookedSeats: testSeat } });

    // Simulate two concurrent requests trying to reserve testSeat at the same instant
    const attemptBooking = async (reqId) => {
      // Atomic query identical to bookingController
      const updatedShow = await Show.findOneAndUpdate(
        {
          _id: show._id,
          bookedSeats: { $nin: [testSeat] },
          isActive: true,
        },
        {
          $push: { bookedSeats: testSeat },
        },
        { new: true }
      );

      if (!updatedShow) {
        return { reqId, status: 409, message: 'Conflict: Seat already booked' };
      }

      return { reqId, status: 201, message: 'Success: Seat acquired' };
    };

    console.log('[Test] Firing 2 simultaneous concurrent booking requests...');
    const results = await Promise.all([attemptBooking('Client_A'), attemptBooking('Client_B')]);

    console.log('[Test Results]:', results);

    const successCount = results.filter((r) => r.status === 201).length;
    const conflictCount = results.filter((r) => r.status === 409).length;

    if (successCount === 1 && conflictCount === 1) {
      console.log('✅ ATOMIC CONCURRENCY TEST PASSED: Exactly 1 client won the lock, and 1 client received 409 Conflict!');
    } else {
      console.error('❌ RACE CONDITION FAILURE: Expected 1 success and 1 conflict, got:', results);
      process.exit(1);
    }

    // Clean up test seat
    await Show.findByIdAndUpdate(show._id, { $pull: { bookedSeats: testSeat } });
    console.log('[Test] Cleaned up test seat.');
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
};

runConcurrencyTest();
