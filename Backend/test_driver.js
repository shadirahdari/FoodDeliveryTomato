import fetch from 'node-fetch';

async function testDriverLogin() {
  try {
    const response = await fetch('http://localhost:4001/api/driver/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'john.driver@fooddelivery.com',
        password: 'driver123'
      })
    });

    const data = await response.json();
    console.log('Login Response:', data);

    if (data.success && data.token) {
      console.log('✅ Driver login successful!');
      console.log('Token:', data.token.substring(0, 50) + '...');

      // Test getting driver profile
      const profileResponse = await fetch('http://localhost:4001/api/driver/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });

      const profileData = await profileResponse.json();
      console.log('Profile Response:', profileData);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDriverLogin();