import fetch from 'node-fetch';

async function testAdminLogin() {
  try {
    const response = await fetch('http://localhost:4001/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin12345'
      })
    });

    const data = await response.json();
    console.log('Admin Login Response:', data);

    if (data.success && data.token) {
      console.log('✅ Admin login successful!');
      console.log('Token:', data.token.substring(0, 50) + '...');

      // Test getting drivers
      const driversResponse = await fetch('http://localhost:4001/api/driver/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });

      const driversData = await driversResponse.json();
      console.log('Drivers Response:', driversData);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminLogin();