require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');
const Show = require('../models/Show');
const Booking = require('../models/Booking');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cinebook');
    console.log('[Seed] Database connected successfully.');
  } catch (err) {
    console.error('[Seed Error] Failed to connect to DB:', err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Screen.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});

    console.log('[Seed] Creating demo users...');
    const adminUser = await User.create({
      name: 'Vikramaditya Singhania (Admin)',
      email: 'admin@cinebook.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 98201 98201',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    });

    const standardUser = await User.create({
      name: 'Aanya Sharma',
      email: 'user@cinebook.com',
      password: 'User@123',
      role: 'user',
      phone: '+91 98112 45890',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    });

    console.log('[Seed] Users created:');
    console.log('   Admin: admin@cinebook.com / Admin@123');
    console.log('   User:  user@cinebook.com / User@123');

    console.log('[Seed] Seeding Indian & Global Blockbuster Movies...');
    const moviesData = [
      {
        title: 'Kalki 2898 AD',
        description:
          'Set in the post-apocalyptic city of Kasi in the year 2898 AD, a modern avatar of Vishnu descends to Earth to protect the world from evil forces led by Supreme Yaskin in the ultimate battle of prophecy.',
        duration: 181,
        genres: ['Action', 'Sci-Fi', 'Mythology'],
        language: 'Hindi',
        releaseDate: new Date('2024-06-27'),
        certificate: 'U/A',
        rating: 8.4,
        votesCount: 290000,
        posterUrl: 'https://image.tmdb.org/t/p/w780/9yauU22b3780P6ZJ8E0LqC4tX4K.jpg',
        backdropUrl: 'https://image.tmdb.org/t/p/original/mKOBdGiiB9gD94J4d5i473M1tVn.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=kQDd1AhGIHk',
        formats: ['2D', '3D', 'IMAX', 'Dolby Cinema'],
        director: 'Nag Ashwin',
        isFeatured: true,
        cast: [
          { name: 'Prabhas', role: 'Bhairava', photo: '' },
          { name: 'Amitabh Bachchan', role: 'Ashwatthama', photo: '' },
          { name: 'Deepika Padukone', role: 'SUM-80', photo: '' },
          { name: 'Kamal Haasan', role: 'Supreme Yaskin', photo: '' },
        ],
      },
      {
        title: 'Pushpa 2: The Rule',
        description:
          'Pushpa Raj rises from a humble laborer to the supreme kingpin of the red sanders syndicate, clashing fiercely with SP Bhanwar Singh Shekhawat in an explosive duel of power and vengeance.',
        duration: 195,
        genres: ['Action', 'Crime', 'Drama'],
        language: 'Telugu',
        releaseDate: new Date('2024-12-05'),
        certificate: 'A',
        rating: 8.7,
        votesCount: 185000,
        posterUrl: 'https://image.tmdb.org/t/p/w780/bQ2wVf4z28C2XqZ1bC9mK7tL3E4.jpg',
        backdropUrl: 'https://image.tmdb.org/t/p/original/uLqP8M3yq4n7N1vO4u0rK8bX1vQ.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=g3JUbgOHgdw',
        formats: ['2D', 'IMAX', '4DX'],
        director: 'Sukumar',
        isFeatured: true,
        cast: [
          { name: 'Allu Arjun', role: 'Pushpa Raj', photo: '' },
          { name: 'Rashmika Mandanna', role: 'Srivalli', photo: '' },
          { name: 'Fahadh Faasil', role: 'SP Bhanwar Singh Shekhawat', photo: '' },
        ],
      },
      {
        title: 'Dune: Part Two',
        description:
          'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between love and the fate of the universe, he strives to prevent a terrible future.',
        duration: 166,
        genres: ['Action', 'Adventure', 'Sci-Fi'],
        language: 'English',
        releaseDate: new Date('2024-03-01'),
        certificate: 'U/A',
        rating: 8.6,
        votesCount: 480200,
        posterUrl: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5200SV.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
        formats: ['2D', 'IMAX', '4DX', 'Dolby Cinema'],
        director: 'Denis Villeneuve',
        isFeatured: true,
        cast: [
          { name: 'Timothée Chalamet', role: 'Paul Atreides', photo: '' },
          { name: 'Zendaya', role: 'Chani', photo: '' },
          { name: 'Austin Butler', role: 'Feyd-Rautha Harkonnen', photo: '' },
        ],
      },
      {
        title: 'Stree 2: Sarkate Ka Aatank',
        description:
          'The town of Chanderi is haunted once again by a terrifying headless entity known as Sarkate. Vicky, Bittu, Jana and Rudra team up with the mysterious woman to save the women of their beloved town.',
        duration: 147,
        genres: ['Comedy', 'Horror'],
        language: 'Hindi',
        releaseDate: new Date('2024-08-15'),
        certificate: 'U/A',
        rating: 8.1,
        votesCount: 160000,
        posterUrl: 'https://image.tmdb.org/t/p/w780/m2zTtuwA29uD9V5eC5OQ6a1bC9m.jpg',
        backdropUrl: 'https://image.tmdb.org/t/p/original/y4aO1V9eM7tL3E4mK7tL3E4bC9m.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=KVn5i9p8eEw',
        formats: ['2D'],
        director: 'Amar Kaushik',
        isFeatured: false,
        cast: [
          { name: 'Rajkummar Rao', role: 'Vicky', photo: '' },
          { name: 'Shraddha Kapoor', role: 'The Mystery Woman', photo: '' },
          { name: 'Pankaj Tripathi', role: 'Rudra Bhaiya', photo: '' },
        ],
      },
      {
        title: 'Interstellar',
        description:
          'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft with a team of researchers through a wormhole to find humanity a new home.',
        duration: 169,
        genres: ['Adventure', 'Drama', 'Sci-Fi'],
        language: 'English',
        releaseDate: new Date('2014-11-07'),
        certificate: 'U/A',
        rating: 8.7,
        votesCount: 980000,
        posterUrl: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdropUrl: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        formats: ['2D', 'IMAX', 'Dolby Cinema'],
        director: 'Christopher Nolan',
        isFeatured: false,
        cast: [
          { name: 'Matthew McConaughey', role: 'Cooper', photo: '' },
          { name: 'Anne Hathaway', role: 'Brand', photo: '' },
        ],
      },
      {
        title: 'RRR (Rise Roar Revolt)',
        description:
          'A fearless revolutionary and an officer in the British force, who are unaware of each other\'s true identities, forge an intense friendship before discovering they are destined to fight on opposing sides.',
        duration: 187,
        genres: ['Action', 'Drama'],
        language: 'Telugu',
        releaseDate: new Date('2022-03-25'),
        certificate: 'U/A',
        rating: 8.8,
        votesCount: 420000,
        posterUrl: 'https://image.tmdb.org/t/p/w780/wE0noFU2ETvi8Gq7tL63Jq9N8eM.jpg',
        backdropUrl: 'https://image.tmdb.org/t/p/original/7c4E2e9l7M1nK8vO4u0rK8bX1vQ.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=NgBoMJy386M',
        formats: ['2D', '3D', 'IMAX', 'Dolby Cinema'],
        director: 'S.S. Rajamouli',
        isFeatured: false,
        cast: [
          { name: 'N.T. Rama Rao Jr.', role: 'Komaram Bheem', photo: '' },
          { name: 'Ram Charan', role: 'Alluri Sitarama Raju', photo: '' },
          { name: 'Alia Bhatt', role: 'Sita', photo: '' },
        ],
      },
    ];

    const createdMovies = await Movie.insertMany(moviesData);
    console.log(`[Seed] Seeded ${createdMovies.length} movies.`);

    console.log('[Seed] Seeding Top Indian Multiplex Theatres across Major Cities...');
    const theatresData = [
      // 1. Mumbai
      {
        name: 'PVR INOX: Maison Luxe, Jio World Drive',
        city: 'Mumbai',
        address: 'Jio World Drive, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051',
        zipCode: '400051',
        amenities: ['IMAX Laser', 'Dolby Atmos', 'Maison Luxe Recliners', 'Gourmet Lounge by Chef', 'Valet Parking'],
        phone: '+91 (022) 6982 4000',
      },
      {
        name: 'PVR ICON: Infiniti Mall, Andheri West',
        city: 'Mumbai',
        address: 'Infiniti Mall, Link Road, Andheri West, Mumbai, Maharashtra 400053',
        zipCode: '400053',
        amenities: ['4DX', 'Dolby Atmos 7.1', 'Gold Class Recliners', 'Food Court & Café'],
        phone: '+91 (022) 6675 3300',
      },
      // 2. Delhi-NCR
      {
        name: "PVR Director's Cut: Ambience Mall, Vasant Kunj",
        city: 'Delhi-NCR',
        address: 'Ambience Mall, Nelson Mandela Marg, Vasant Kunj, New Delhi, Delhi 110070',
        zipCode: '110070',
        amenities: ['Director\'s Cut Ultra Luxury', 'Dolby Atmos', 'Pushback Velvet Recliners', 'Fine Dining In-Seat'],
        phone: '+91 (011) 4087 0000',
      },
      {
        name: 'PVR Superplex: Logix City Centre, Noida',
        city: 'Delhi-NCR',
        address: 'Logix City Centre, Sector 32, Noida, Uttar Pradesh 201301',
        zipCode: '201301',
        amenities: ['IMAX with Laser', '4DX Motion', 'PlayHouse', 'Gold Class'],
        phone: '+91 (0120) 613 2000',
      },
      // 3. Bengaluru
      {
        name: 'PVR INOX: The Forum Mall, Koramangala',
        city: 'Bengaluru',
        address: 'The Forum Mall, Hosur Road, Koramangala, Bengaluru, Karnataka 560095',
        zipCode: '560095',
        amenities: ['IMAX Laser 4K', 'Dolby Atmos', 'Recliner Seating', 'Live Kitchen'],
        phone: '+91 (080) 2206 7777',
      },
      {
        name: 'PVR Superplex: Vega City Mall, Bannerghatta',
        city: 'Bengaluru',
        address: 'Vega City Mall, Bannerghatta Main Road, BTM 2nd Stage, Bengaluru, Karnataka 560076',
        zipCode: '560076',
        amenities: ['4DX Motion', 'IMAX', 'Gold Class', 'Dolby Atmos 64-Channel'],
        phone: '+91 (080) 6743 1111',
      },
      // 4. Hyderabad
      {
        name: 'Prasads Multiplex: Large Screen & IMAX',
        city: 'Hyderabad',
        address: 'Prasads IMAX, NTR Gardens, Necklace Road, Hyderabad, Telangana 500063',
        zipCode: '500063',
        amenities: ['India\'s Largest Screen', 'Dual 4K Laser Projection', 'Dolby Atmos', 'Gaming Zone & Food Court'],
        phone: '+91 (040) 2344 8888',
      },
      {
        name: 'AMB Cinemas (Mahesh Babu): Gachibowli',
        city: 'Hyderabad',
        address: 'Sarath City Capital Mall, Gachibowli - Miyapur Rd, Whitefields, Kondapur, Hyderabad 500084',
        zipCode: '500084',
        amenities: ['Laser 4K Projection', 'M-Lounge VIP Recliners', 'Dolby Atmos Sound', 'Executive Lounge'],
        phone: '+91 (040) 6815 4444',
      },
      // 5. Chennai
      {
        name: 'PVR INOX: Sathyam Cinemas, Royapettah',
        city: 'Chennai',
        address: '8, Thiru Vi Ka Rd, Royapettah, Chennai, Tamil Nadu 600014',
        zipCode: '600014',
        amenities: ['Legendary Sathyam Popcorn', 'RDX 4K Projection', 'Dolby Atmos', 'Wheelchair Friendly'],
        phone: '+91 (044) 4392 0200',
      },
      // 6. Kolkata
      {
        name: 'INOX: South City Mall, Prince Anwar Shah Rd',
        city: 'Kolkata',
        address: 'South City Mall, 375 Prince Anwar Shah Rd, Jadavpur, Kolkata, West Bengal 700068',
        zipCode: '700068',
        amenities: ['IMAX Laser', 'INSIGNIA 7-Star Luxe', 'Macarons & Gourmet Kitchen', 'Dolby Atmos'],
        phone: '+91 (033) 4007 2222',
      },
      // 7. Pune
      {
        name: 'Cinépolis: Seasons Mall, Magarpatta City',
        city: 'Pune',
        address: 'Seasons Mall, Magarpatta City, Hadapsar, Pune, Maharashtra 411028',
        zipCode: '411028',
        amenities: ['VIP Recliner Service', '4DX Motion', 'Macro XE Giant Screen', 'Dolby Atmos'],
        phone: '+91 (020) 6723 3333',
      },
      // 8. Ahmedabad
      {
        name: 'PVR: Acropolis Mall, Thaltej',
        city: 'Ahmedabad',
        address: 'Acropolis Mall, Sarkhej - Gandhinagar Hwy, Thaltej, Ahmedabad, Gujarat 380054',
        zipCode: '380054',
        amenities: ['Dolby Atmos', 'Gold Class Recliners', 'Café & Snack Bar', 'Laser 4K'],
        phone: '+91 (079) 4022 1100',
      },
    ];

    const createdTheatres = await Theatre.insertMany(theatresData);
    console.log(`[Seed] Seeded ${createdTheatres.length} Indian multiplex theatres across 8 cities.`);

    console.log('[Seed] Seeding Screens for each Indian multiplex...');
    const screensToInsert = [];

    createdTheatres.forEach((theatre) => {
      // Screen 1: IMAX Laser / Large Screen
      screensToInsert.push({
        theatreId: theatre._id,
        name: 'Screen 1 — IMAX Laser Experience',
        screenType: 'IMAX',
        soundSystem: 'IMAX 12-Channel Surround Audio',
        seatLayout: {
          totalRows: 8,
          totalCols: 12,
          aisleColumns: [4, 8],
          tiers: [
            { name: 'VIP Recliner', rows: ['A', 'B'], priceMultiplier: 1.6 },
            { name: 'Premium', rows: ['C', 'D', 'E'], priceMultiplier: 1.25 },
            { name: 'Classic', rows: ['F', 'G', 'H'], priceMultiplier: 1.0 },
          ],
        },
        totalSeats: 96,
      });

      // Screen 2: Dolby Atmos INSIGNIA / Gold Class
      screensToInsert.push({
        theatreId: theatre._id,
        name: 'Screen 2 — Dolby Atmos Gold Lounge',
        screenType: 'Dolby Cinema',
        soundSystem: 'Dolby Atmos 64-Channel Spatial Audio',
        seatLayout: {
          totalRows: 7,
          totalCols: 10,
          aisleColumns: [3, 7],
          tiers: [
            { name: 'VIP Recliner', rows: ['A'], priceMultiplier: 1.6 },
            { name: 'Premium', rows: ['B', 'C', 'D'], priceMultiplier: 1.25 },
            { name: 'Classic', rows: ['E', 'F', 'G'], priceMultiplier: 1.0 },
          ],
        },
        totalSeats: 70,
      });

      // Screen 3: Standard Multiplex
      screensToInsert.push({
        theatreId: theatre._id,
        name: 'Screen 3 — Laser 4K Cinema',
        screenType: 'Standard',
        soundSystem: 'Dolby 7.1 Surround',
        seatLayout: {
          totalRows: 6,
          totalCols: 10,
          aisleColumns: [5],
          tiers: [
            { name: 'Premium', rows: ['A', 'B', 'C'], priceMultiplier: 1.25 },
            { name: 'Classic', rows: ['D', 'E', 'F'], priceMultiplier: 1.0 },
          ],
        },
        totalSeats: 60,
      });
    });

    const createdScreens = await Screen.insertMany(screensToInsert);
    console.log(`[Seed] Seeded ${createdScreens.length} screens across all Indian multiplexes.`);

    console.log('[Seed] Seeding Shows for next 5 days with Indian Rupee (₹) pricing...');
    const showtimes = [
      { start: '10:15 AM', end: '01:00 PM' },
      { start: '01:45 PM', end: '04:30 PM' },
      { start: '05:30 PM', end: '08:15 PM' },
      { start: '09:00 PM', end: '11:45 PM' },
    ];

    const formatDate = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const showsToInsert = [];
    const now = new Date();

    // Generate dynamic shows for today and next 4 days
    for (let dayOffset = 0; dayOffset <= 4; dayOffset++) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() + dayOffset);
      const dateStr = formatDate(targetDate);

      createdScreens.forEach((screen, screenIndex) => {
        const movie = createdMovies[screenIndex % createdMovies.length];
        const theatre = createdTheatres.find((t) => t._id.equals(screen.theatreId));

        // 2 show slots per screen per day
        const dailySlots = [showtimes[screenIndex % 2], showtimes[2 + (screenIndex % 2)]];

        dailySlots.forEach((slot, slotIndex) => {
          const sampleBooked = [];
          if (dayOffset === 0 && slotIndex === 0) {
            sampleBooked.push('B4', 'B5', 'C6', 'C7', 'D5');
          } else if (dayOffset === 0 && slotIndex === 1) {
            sampleBooked.push('A5', 'A6', 'B5', 'B6');
          }

          // Authentic Indian ticket pricing in ₹:
          // VIP Recliner: ₹580, Premium: ₹320, Classic: ₹190
          showsToInsert.push({
            movieId: movie._id,
            theatreId: theatre._id,
            screenId: screen._id,
            showDate: dateStr,
            startTime: slot.start,
            endTime: slot.end,
            format: screen.screenType === 'IMAX' ? 'IMAX' : screen.screenType === 'Dolby Cinema' ? 'Dolby Cinema' : '2D',
            language: movie.language,
            tierPricing: [
              { tierName: 'VIP Recliner', price: 580 },
              { tierName: 'Premium', price: 320 },
              { tierName: 'Classic', price: 190 },
            ],
            bookedSeats: sampleBooked,
          });
        });
      });
    }

    const createdShows = await Show.insertMany(showsToInsert);
    console.log(`[Seed] Seeded ${createdShows.length} dynamic shows across 5 days.`);

    // Sample booking in Indian Rupees (₹)
    console.log('[Seed] Seeding sample booking for demo user in ₹...');
    const sampleShow = createdShows[0];
    const sampleMovie = createdMovies.find((m) => m._id.equals(sampleShow.movieId));
    const sampleTheatre = createdTheatres.find((t) => t._id.equals(sampleShow.theatreId));
    const sampleScreen = createdScreens.find((s) => s._id.equals(sampleShow.screenId));

    const sampleBooking = await Booking.create({
      bookingId: 'CB-IND8892',
      userId: standardUser._id,
      showId: sampleShow._id,
      movieId: sampleMovie._id,
      theatreId: sampleTheatre._id,
      screenId: sampleScreen._id,
      seats: [
        { seatNumber: 'B4', row: 'B', col: 4, tier: 'VIP Recliner', price: 580 },
        { seatNumber: 'B5', row: 'B', col: 5, tier: 'VIP Recliner', price: 580 },
      ],
      pricingSummary: {
        subtotal: 1160,
        convenienceFee: 70, // ₹35 per ticket * 2
        tax: 208, // 18% GST (9% CGST + 9% SGST)
        totalAmount: 1438,
      },
      paymentDetails: {
        status: 'PAID',
        method: 'Simulated UPI (Google Pay / PhonePe)',
        transactionId: 'TXN-UPI-IND-749204',
        paidAt: new Date(),
        isSimulated: true,
      },
      bookingStatus: 'CONFIRMED',
      qrPayload: JSON.stringify({
        bookingId: 'CB-IND8892',
        user: standardUser.email,
        seats: ['B4', 'B5'],
        theatre: sampleTheatre.name,
        amount: '₹1,438',
        verified: true,
      }),
    });

    console.log(`[Seed] Sample Booking created: ${sampleBooking.bookingId} (₹1,438)`);
    console.log('----------------------------------------------------');
    console.log('✅ ALL INDIAN CITIES & MULTIPLEXES SEEDED SUCCESSFULLY!');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedData();
