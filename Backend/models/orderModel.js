import mongoose from "mongoose";

const paymentDetailsSchema = new mongoose.Schema({
  paymentId: String,
  paymentMethod: String,
  paymentAmount: Number,
  paymentStatus: String,
  customerEmail: String,
  customerName: String,
  paidAt: Date,
  failureReason: String,
  expiredAt: Date
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "processing", enum: ["processing", "confirmed", "preparing", "ready", "picked_up", "out_for_delivery", "delivered", "cancelled"] },
  date: { type: Date, default: Date.now },
  Payment: { type: Boolean, default: false },
  paymentDetails: paymentDetailsSchema,
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'driver' },
  estimatedDeliveryTime: { type: Date },
  actualDeliveryTime: { type: Date },
  trackingUpdates: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    location: {
      latitude: Number,
      longitude: Number
    },
    message: { type: String }
  }]
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
