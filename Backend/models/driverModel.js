import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  currentLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    lastUpdated: { type: Date, default: Date.now }
  },
  assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'order' }],
  totalDeliveries: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0, min: 0, max: 5 },
  vehicleType: { type: String, enum: ['bike', 'car', 'scooter'], default: 'bike' },
  licenseNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { minimize: false });

const driverModel = mongoose.models.driver || mongoose.model("driver", driverSchema);

export default driverModel;