require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const { app, server } = require('../server');

const BASE_URL = 'http://localhost:5001';

const runE2ETests = async () => {
  console.log('====================================================');
  console.log('🚀 RUNNING CINEBOOK COMPLETE E2E INTEGRATION SUITE');
  console.log('====================================================');

  try {
    // Helper fetch wrapper
    const request = async (path, options = {}) => {
      const url = `${BASE_URL}${path}`;
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        },
        ...options,
      });
      const data = await res.json().catch(() => null);
      return { status: res.status, ok: res.ok, data };
    };

    // 1. Health check
    console.log('\n[1/12] Testing Health Check API...');
    const health = await request('/api/health');
    console.log(`Status: ${health.status}, Response:`, health.data);
    if (health.status !== 200 || health.data.status !== 'online') throw new Error('Health check failed');
    console.log('✅ Health check passed.');

    // 2. Fetch Movies
    console.log('\n[2/12] Testing Movie Listings API...');
    const moviesRes = await request('/api/movies');
    console.log(`Status: ${moviesRes.status}, Found ${moviesRes.data?.movies?.length} movies.`);
    if (moviesRes.status !== 200 || !moviesRes.data?.movies?.length) throw new Error('Movies API failed');
    const targetMovie = moviesRes.data.movies[0];
    console.log(`✅ Movies listing passed. Target: "${targetMovie.title}" (${targetMovie._id})`);

    // 3. Fetch Theatres & Cities
    console.log('\n[3/12] Testing Theatres & Cities API...');
    const theatresRes = await request('/api/theatres');
    const citiesRes = await request('/api/theatres/cities');
    console.log(`Theatres: ${theatresRes.data?.count}, Cities: ${citiesRes.data?.cities?.join(', ')}`);
    if (theatresRes.status !== 200 || citiesRes.status !== 200) throw new Error('Theatres API failed');
    console.log('✅ Theatres API passed.');

    // 4. Fetch Shows for Target Movie
    console.log('\n[4/12] Testing Shows API for Target Movie...');
    const showsRes = await request(`/api/movies/${targetMovie._id}/shows`);
    if (showsRes.status !== 200) throw new Error('Movie shows API failed');
    const firstTheatreWithShows = showsRes.data.theatres[0];
    const targetShow = firstTheatreWithShows?.shows[0];
    if (!targetShow) throw new Error('No shows found for target movie');
    console.log(`Found show on ${targetShow.showDate} at ${targetShow.startTime} (ID: ${targetShow._id})`);
    console.log('✅ Movie Shows API passed.');

    // 5. Fetch Show Details with Seat Layout
    console.log('\n[5/12] Testing Show Details & Seat Grid API...');
    const showDetailRes = await request(`/api/shows/${targetShow._id}`);
    if (showDetailRes.status !== 200 || !showDetailRes.data?.show?.screenId?.seatLayout) {
      throw new Error('Show details / seat layout API failed');
    }
    console.log(`Screen: "${showDetailRes.data.show.screenId.name}", Total Seats: ${showDetailRes.data.show.screenId.totalSeats}`);
    console.log('✅ Show Details API passed.');

    // 6. User Authentication (Login)
    console.log('\n[6/12] Testing User Authentication (Login as user@cinebook.com)...');
    const userLogin = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@cinebook.com', password: 'User@123' }),
    });
    if (userLogin.status !== 200 || !userLogin.data?.token) throw new Error('User login failed');
    const userToken = userLogin.data.token;
    console.log(`Logged in as: ${userLogin.data.user.name} (${userLogin.data.user.role})`);
    console.log('✅ User Login passed.');

    // 7. Atomic Seat Booking
    console.log('\n[7/12] Testing Atomic Booking Creation...');
    const testSeats = [
      { seatNumber: 'E1', row: 'E', col: 1, tier: 'Classic', price: 190 },
      { seatNumber: 'E2', row: 'E', col: 2, tier: 'Classic', price: 190 },
    ];
    const bookingRes = await request('/api/bookings', {
      method: 'POST',
      token: userToken,
      body: JSON.stringify({
        showId: targetShow._id,
        seats: testSeats,
        paymentMethod: 'Simulated UPI (Google Pay)',
      }),
    });
    console.log(`Booking Status: ${bookingRes.status}, Booking ID: ${bookingRes.data?.booking?.bookingId}`);
    if (bookingRes.status !== 201 || !bookingRes.data?.booking?.bookingId) {
      throw new Error(`Booking creation failed: ${JSON.stringify(bookingRes.data)}`);
    }
    const createdBooking = bookingRes.data.booking;
    console.log('✅ Booking successfully created with unique ID:', createdBooking.bookingId);

    // 8. Double Booking Prevention Test (Conflict 409)
    console.log('\n[8/12] Testing Double Booking Prevention (Attempting to book duplicate seat E1)...');
    const conflictRes = await request('/api/bookings', {
      method: 'POST',
      token: userToken,
      body: JSON.stringify({
        showId: targetShow._id,
        seats: [{ seatNumber: 'E1', row: 'E', col: 1, tier: 'Classic', price: 190 }],
        paymentMethod: 'Simulated UPI (Google Pay)',
      }),
    });
    console.log(`Conflict Attempt Status: ${conflictRes.status}, Message: ${conflictRes.data?.message}`);
    if (conflictRes.status !== 409) {
      throw new Error(`Double booking prevention failed! Expected 409, got ${conflictRes.status}`);
    }
    console.log('✅ Concurrency Guard Verified: Duplicate booking rejected with 409 Conflict!');

    // 9. User Booking History
    console.log('\n[9/12] Testing User Booking History...');
    const myBookingsRes = await request('/api/bookings/my-bookings', { token: userToken });
    console.log(`User has ${myBookingsRes.data?.count} bookings.`);
    if (myBookingsRes.status !== 200 || !myBookingsRes.data?.bookings?.length) throw new Error('My Bookings API failed');
    console.log('✅ User Bookings History API passed.');

    // 10. Cancellation & Seat Release
    console.log('\n[10/12] Testing Booking Cancellation & Atomic Seat Release...');
    const cancelRes = await request(`/api/bookings/${createdBooking.bookingId}/cancel`, {
      method: 'POST',
      token: userToken,
    });
    console.log(`Cancellation Status: ${cancelRes.status}, Message: ${cancelRes.data?.message}`);
    if (cancelRes.status !== 200 || cancelRes.data?.booking?.bookingStatus !== 'CANCELLED') {
      throw new Error('Booking cancellation failed');
    }

    // Verify seats E1, E2 are no longer in bookedSeats
    const verifyShow = await request(`/api/shows/${targetShow._id}`);
    const remainingBooked = verifyShow.data?.show?.bookedSeats || [];
    if (remainingBooked.includes('E1') || remainingBooked.includes('E2')) {
      throw new Error('Seats were not released upon cancellation!');
    }
    console.log('✅ Booking cancellation and atomic seat release verified.');

    // 11. Admin Authentication & Metrics
    console.log('\n[11/12] Testing Admin Authentication & Dashboard Stats...');
    const adminLogin = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@cinebook.com', password: 'Admin@123' }),
    });
    if (adminLogin.status !== 200 || adminLogin.data?.user?.role !== 'admin') {
      throw new Error('Admin login failed');
    }
    const adminToken = adminLogin.data.token;
    const adminStats = await request('/api/admin/stats', { token: adminToken });
    console.log('Admin Stats:', adminStats.data?.stats);
    if (adminStats.status !== 200 || !adminStats.data?.stats) throw new Error('Admin stats API failed');
    console.log('✅ Admin Console & Stats verified.');

    // 12. Admin Movie CRUD
    console.log('\n[12/12] Testing Admin Movie CRUD...');
    const newTestMovie = {
      title: 'Blade Runner 2099 (Test)',
      description: 'A futuristic neo-noir thriller set in neon Los Angeles.',
      duration: 140,
      genres: ['Sci-Fi', 'Thriller'],
      language: 'English',
      releaseDate: '2026-11-20',
      certificate: 'R',
      rating: 8.8,
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600',
      backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200',
      formats: ['2D', 'IMAX'],
      director: 'Denis Villeneuve',
    };
    const createMovieRes = await request('/api/admin/movies', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify(newTestMovie),
    });
    if (createMovieRes.status !== 201) throw new Error('Admin create movie failed');
    const createdMovieId = createMovieRes.data.movie._id;
    console.log('Created Movie ID:', createdMovieId);

    // Clean up created test movie
    await request(`/api/admin/movies/${createdMovieId}`, {
      method: 'DELETE',
      token: adminToken,
    });
    console.log('✅ Admin Movie CRUD verified.');

    console.log('\n====================================================');
    console.log('🎉 ALL 12 END-TO-END INTEGRATION TESTS PASSED 100%!');
    console.log('====================================================');

    if (server && server.close) server.close();
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ E2E TEST FAILED:', err.message);
    if (server && server.close) server.close();
    await mongoose.connection.close();
    process.exit(1);
  }
};

runE2ETests();
