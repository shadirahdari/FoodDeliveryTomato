import Stripe from 'stripe';
import orderModel from '../models/orderModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      try {
        // Update order status in database
        const order = await orderModel.findOneAndUpdate(
          { _id: session.metadata.orderId },
          { 
            Payment: true,
            status: "Paid",
            paymentDetails: {
              paymentId: session.payment_intent,
              paymentMethod: session.payment_method_types[0],
              paymentAmount: session.amount_total,
              paymentStatus: session.payment_status,
              customerEmail: session.customer_details.email,
              customerName: session.customer_details.name,
              paidAt: new Date(session.created * 1000)
            }
          },
          { new: true }
        );

        if (!order) {
          console.error('❌ Order not found for session:', session.id);
          return res.status(404).json({ error: 'Order not found' });
        }

        console.log('✅ Payment successful for order:', order._id);
      } catch (error) {
        console.error('❌ Error updating order:', error);
        return res.status(500).json({ error: 'Error updating order' });
      }
      break;

    case 'checkout.session.expired':
      try {
        const expiredSession = event.data.object;
        await orderModel.findOneAndUpdate(
          { _id: expiredSession.metadata.orderId },
          { 
            status: "Payment Failed",
            paymentDetails: {
              failureReason: "Session Expired",
              expiredAt: new Date(expiredSession.expires_at * 1000)
            }
          }
        );
      } catch (error) {
        console.error('❌ Error handling expired session:', error);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}; 