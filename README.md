# Food Delivery Tomato 🍅

A modern food delivery application built with React and Node.js.

## Features

- 🔐 User Authentication
- 🍔 Food Item Browsing & Search
- 🛒 Shopping Cart
- 💳 Secure Payment Processing
- 📦 Order Tracking
- 👤 User Profile Management
- 📱 Responsive Design

## Tech Stack

### Frontend
- React
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Stripe Payment

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/shadirahdari/FoodDeliveryTomato.git
cd FoodDeliveryTomato
```

2. Install dependencies
```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# Backend (.env)
PORT=4001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key

# Frontend (.env)
REACT_APP_API_URL=http://localhost:4001
```

4. Run the application
```bash
# Run backend
cd Backend
npm start

# Run frontend (in a new terminal)
cd frontend
npm start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/) 