import fetch from 'node-fetch';

async function testOrdersForDrivers() {
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

    if (!loginData.success) {
      console.log('❌ Admin login failed');
      return;
    }

    // Get orders list
    const ordersResponse = await fetch('http://localhost:4001/api/order/all', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    const ordersData = await ordersResponse.json();
    console.log('Orders Response Status:', ordersResponse.status);
    console.log('Orders Response:', ordersData);

    if (ordersData.success && ordersData.data) {
      console.log(`Total orders: ${ordersData.data.length}`);

      // Filter orders that should show in drivers panel
      const availableForDrivers = ordersData.data.filter(order =>
        (order.status === 'processing' || order.status === 'confirmed') && !order.driverId
      );

      console.log(`Orders available for driver assignment: ${availableForDrivers.length}`);

      availableForDrivers.forEach(order => {
        console.log(`- Order ${order._id.slice(-6)}: Status=${order.status}, Amount=$${order.amount}, Driver=${order.driverId || 'None'}`);
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOrdersForDrivers();