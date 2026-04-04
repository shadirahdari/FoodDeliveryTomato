import mongoose from 'mongoose';
import dotenv from 'dotenv';
import driverModel from './models/driverModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDrivers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing drivers
    await driverModel.deleteMany({});
    console.log('🧹 Cleared existing drivers');

    // Sample driver data
    const drivers = [
      {
        name: "John Smith",
        email: "john.driver@fooddelivery.com",
        password: await bcrypt.hash("driver123", 10),
        phone: "+1234567890",
        vehicleType: "bike",
        licenseNumber: "DRV001",
        isActive: true,
        currentLocation: {
          latitude: 40.7128,
          longitude: -74.0060,
          lastUpdated: new Date()
        }
      },
      {
        name: "Sarah Johnson",
        email: "sarah.driver@fooddelivery.com",
        password: await bcrypt.hash("driver123", 10),
        phone: "+1234567891",
        vehicleType: "car",
        licenseNumber: "DRV002",
        isActive: true,
        currentLocation: {
          latitude: 40.7589,
          longitude: -73.9851,
          lastUpdated: new Date()
        }
      },
      {
        name: "Mike Wilson",
        email: "mike.driver@fooddelivery.com",
        password: await bcrypt.hash("driver123", 10),
        phone: "+1234567892",
        vehicleType: "scooter",
        licenseNumber: "DRV003",
        isActive: true,
        currentLocation: {
          latitude: 40.7505,
          longitude: -73.9934,
          lastUpdated: new Date()
        }
      }
    ];

    // Insert drivers
    const createdDrivers = await driverModel.insertMany(drivers);
    console.log(`✅ Created ${createdDrivers.length} drivers`);

    // Display created drivers
    createdDrivers.forEach(driver => {
      console.log(`👤 ${driver.name} - ${driver.email} (${driver.vehicleType})`);
    });

    console.log('\n🚀 Driver seeding completed successfully!');
    console.log('📝 Driver login credentials:');
    console.log('   Email: john.driver@fooddelivery.com | Password: driver123');
    console.log('   Email: sarah.driver@fooddelivery.com | Password: driver123');
    console.log('   Email: mike.driver@fooddelivery.com | Password: driver123');

  } catch (error) {
    console.error('❌ Error seeding drivers:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seed function
seedDrivers();