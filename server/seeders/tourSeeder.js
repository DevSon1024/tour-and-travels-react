import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TourPackage from '../models/TourPackage.js';
import connectDB from '../config/db.js';

dotenv.config();

const tours = [
  {
    title: "Rajasthan Royal Heritage Tour",
    description: "Experience the royal grandeur of Rajasthan with visits to magnificent palaces, forts, and cultural sites. Discover the rich heritage of the Pink City Jaipur, the Blue City Jodhpur, and the Golden City Jaisalmer.",
    location: "Rajasthan, India",
    price: 2500,
    duration: 7,
    maxGroupSize: 15,
    images: [
      "https://images.unsplash.com/photo-1599661046827-dacde6976549?q=80&w=2070&auto=format&fit=crop", // Hawa Mahal, Jaipur
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop", // Amber Fort
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop", // Jaisalmer Fort
      "https://images.unsplash.com/photo-1609920658906-8223bd289001?q=80&w=2070&auto=format&fit=crop"  // Mehrangarh Fort, Jodhpur
    ],
    transportType: ['bus'],
    departureTime: '6:00 AM',
    availableSeats: 12,
    amenities: ['WiFi', 'Meals', 'Guide', 'Hotel Pickup', 'AC Transport'],
    featured: true,
    popularity: 95,
    itinerary: [
      {
        day: 1,
        title: "Arrival in Jaipur - The Pink City",
        description: "Arrive in Jaipur, check into hotel, evening visit to local markets",
        activities: ["Hotel check-in", "City Palace visit", "Local market exploration"]
      },
      {
        day: 2,
        title: "Jaipur Sightseeing",
        description: "Full day exploring Amber Fort, Hawa Mahal, and Jantar Mantar",
        activities: ["Amber Fort", "Hawa Mahal", "Jantar Mantar", "City Palace"]
      },
      {
        day: 3,
        title: "Jaipur to Jodhpur",
        description: "Travel to Jodhpur, the Blue City, evening at leisure",
        activities: ["Travel to Jodhpur", "Hotel check-in", "Clock Tower market visit"]
      },
      {
        day: 4,
        title: "Jodhpur Exploration",
        description: "Visit Mehrangarh Fort and Jaswant Thada",
        activities: ["Mehrangarh Fort", "Jaswant Thada", "Umaid Bhawan Palace"]
      },
      {
        day: 5,
        title: "Jodhpur to Jaisalmer",
        description: "Journey to the Golden City of Jaisalmer",
        activities: ["Travel to Jaisalmer", "Hotel check-in", "Sunset at Gadisar Lake"]
      },
      {
        day: 6,
        title: "Jaisalmer Desert Experience",
        description: "Explore Jaisalmer Fort and enjoy desert safari",
        activities: ["Jaisalmer Fort", "Patwon Ki Haveli", "Desert Safari", "Cultural evening"]
      },
      {
        day: 7,
        title: "Departure",
        description: "Final shopping and departure",
        activities: ["Shopping", "Check-out", "Departure"]
      }
    ],
    availableDates: [
      new Date('2024-03-15'),
      new Date('2024-04-10'),
      new Date('2024-05-05'),
      new Date('2024-10-15'),
      new Date('2024-11-10'),
      new Date('2024-12-05')
    ],
    inclusions: [
      "6 nights accommodation in heritage hotels",
      "All meals (breakfast, lunch, dinner)",
      "AC transportation throughout",
      "Professional guide",
      "All entrance fees",
      "Desert safari with cultural program",
      "Airport/railway station transfers"
    ],
    exclusions: [
      "Flight tickets",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
      "Any additional activities not mentioned"
    ],
    difficulty: "Easy",
    rating: 4.8,
    reviewCount: 156
  },
  {
    title: "Kerala Backwaters & Hill Stations",
    description: "Discover the serene backwaters of Alleppey and the misty hill stations of Munnar in God's Own Country.",
    location: "Kerala, India",
    price: 1800,
    duration: 5,
    maxGroupSize: 20,
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop", // Kerala backwaters
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop", // Tea plantations
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070&auto=format&fit=crop", // Houseboat
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop"  // Munnar hills
    ],
    transportType: ['bus'],
    departureTime: '7:00 AM',
    availableSeats: 18,
    amenities: ['WiFi', 'Meals', 'Guide', 'Hotel Pickup'],
    featured: true,
    popularity: 88,
    difficulty: "Easy",
    rating: 4.6,
    reviewCount: 203
  },
  {
    title: "Goa Beach Paradise",
    description: "Relax on pristine beaches, enjoy water sports, and experience the vibrant nightlife of Goa.",
    location: "Goa, India",
    price: 1200,
    duration: 4,
    maxGroupSize: 25,
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2070&auto=format&fit=crop", // Goa beach
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop", // Beach activities
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070&auto=format&fit=crop", // Goa church
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2070&auto=format&fit=crop"  // Sunset beach
    ],
    transportType: ['bus'],
    departureTime: '8:00 AM',
    availableSeats: 22,
    amenities: ['WiFi', 'Meals', 'Guide', 'Hotel Pickup'],
    featured: false,
    popularity: 82,
    difficulty: "Easy",
    rating: 4.4,
    reviewCount: 178
  },
  {
    title: "Himalayan Adventure Trek",
    description: "Challenge yourself with breathtaking treks through the majestic Himalayas and experience mountain culture.",
    location: "Himachal Pradesh, India",
    price: 3200,
    duration: 10,
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop", // Mountain landscape
      "https://images.unsplash.com/photo-1464822759844-d150baec4e84?q=80&w=2070&auto=format&fit=crop", // Trekking
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=2070&auto=format&fit=crop", // Mountain peaks
      "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=2070&auto=format&fit=crop"  // Mountain village
    ],
    transportType: ['bus'],
    departureTime: '5:00 AM',
    availableSeats: 8,
    amenities: ['Guide', 'Trekking Equipment', 'Meals', 'First Aid'],
    featured: true,
    popularity: 91,
    difficulty: "Challenging",
    rating: 4.9,
    reviewCount: 89
  },
  {
    title: "Golden Triangle Classic",
    description: "Explore India's most famous tourist circuit covering Delhi, Agra, and Jaipur with iconic monuments.",
    location: "Delhi-Agra-Jaipur, India",
    price: 2200,
    duration: 6,
    maxGroupSize: 18,
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2070&auto=format&fit=crop", // Taj Mahal
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop", // Red Fort Delhi
      "https://images.unsplash.com/photo-1599661046827-dacde6976549?q=80&w=2070&auto=format&fit=crop", // Hawa Mahal
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2070&auto=format&fit=crop"  // India Gate
    ],
    transportType: ['train'],
    departureTime: '6:30 AM',
    availableSeats: 15,
    amenities: ['WiFi', 'Meals', 'Guide', 'Hotel Pickup', 'AC Transport'],
    featured: true,
    popularity: 94,
    difficulty: "Easy",
    rating: 4.7,
    reviewCount: 267
  },
  {
    title: "Spiritual Varanasi Experience",
    description: "Witness the spiritual heart of India with Ganga Aarti, ancient temples, and cultural immersion.",
    location: "Varanasi, India",
    price: 1500,
    duration: 3,
    maxGroupSize: 16,
    images: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2070&auto=format&fit=crop", // Varanasi ghats
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop", // Ganga Aarti
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070&auto=format&fit=crop", // Boat on Ganges
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"  // Temple
    ],
    transportType: ['train'],
    departureTime: '7:30 AM',
    availableSeats: 14,
    amenities: ['Guide', 'Meals', 'Boat Ride', 'Temple Visits'],
    featured: false,
    popularity: 76,
    difficulty: "Easy",
    rating: 4.3,
    reviewCount: 134
  }
];

const seedTours = async () => {
  try {
    await connectDB();
    
    // Clear existing tours
    await TourPackage.deleteMany({});
    console.log('🗑️  Existing tours cleared');
    
    // Insert new tours
    const createdTours = await TourPackage.insertMany(tours);
    console.log(`✅ ${createdTours.length} tours seeded successfully`);
    
    console.log('🎯 Tours seeded:');
    createdTours.forEach(tour => {
      console.log(`   - ${tour.title} (${tour.location}) - ₹${tour.price}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding tours:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (process.argv[2] === '--seed') {
  seedTours();
}

export default seedTours;
