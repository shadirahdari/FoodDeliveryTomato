import fetch from 'node-fetch';

async function createTestOrder() {
  try {
    // First login as admin to get token
    const loginResponse = await fetch('http://localhost:4001/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin12345'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Admin login:', loginData.success ? '✅ Success' : '❌ Failed');

    if (!loginData.success) return;

    // Create a test order
    const orderResponse = await fetch('http://localhost:4001/api/order/place', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        userId: 'test-user-id',
        items: [
          {
            id: 'test-food-1',
            name: 'Test Pizza',
            price: 15.99,
            quantity: 1
          }
        ],
        amount: 15.99,
        address: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipcode: '12345',
          country: 'Test Country',
          phone: '+1234567890'
        }
      })
    });

    const orderData = await orderResponse.json();
    console.log('Order creation:', orderData.success ? '✅ Success' : '❌ Failed');
    console.log('Order ID:', orderData.orderId);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

createTestOrder();