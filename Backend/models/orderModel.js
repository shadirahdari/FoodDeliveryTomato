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
  status: { type: String, default: "Food Processing" },
  date: { type: Date, default: Date.now },
  Payment: { type: Boolean, default: false },
  paymentDetails: paymentDetailsSchema
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
