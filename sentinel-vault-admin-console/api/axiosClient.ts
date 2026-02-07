
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sentinel_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.request.use(async (config) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  if (config.url === '/auth/login' && config.method === 'post') {
    const { email } = config.data;
    config.adapter = async () => ({
      data: {
        token: 'MOCK_JWT_TOKEN_' + Date.now(),
        role: email.includes('admin') ? 'admin' : (email.includes('police') ? 'police' : 'health'),
        email
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    });
  }

  if (config.url === '/auth/signup' && config.method === 'post') {
    config.adapter = async () => ({
      data: { message: 'verification_code_sent' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    });
  }

  if (config.url === '/auth/verify-email' && config.method === 'post') {
    config.adapter = async () => ({
      data: { message: 'verified' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    });
  }

  if (config.url === '/requests' && config.method === 'get') {
    config.adapter = async () => ({
      data: [
        { id: 'REQ-101', status: 'CRITICAL', needs: 'Rescue, Medical', peopleCount: '6-10', loc: '23.2156,72.6369', timestamp: new Date().toISOString() },
        { id: 'REQ-102', status: 'URGENT', needs: 'Food, Water', peopleCount: '2-4', loc: '23.2324,72.6511', timestamp: new Date().toISOString() },
        { id: 'REQ-103', status: 'SAFE', needs: 'Transportation', peopleCount: '1', loc: '23.1950,72.6200', timestamp: new Date().toISOString() },
        { id: 'REQ-104', status: 'CRITICAL', needs: 'Heavy Excavation', peopleCount: '12+', loc: '23.2450,72.6600', timestamp: new Date().toISOString() },
      ],
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    });
  }

  // Handle allocation
  if (config.url?.match(/^\/requests\/.*\/allocate$/) && config.method === 'post') {
     config.adapter = async () => ({
      data: { message: 'Resources allocated successfully' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    });
  }

  if (config.url === '/inventory' && config.method === 'get') {
    config.adapter = async () => ({
      data: [
        { name: 'Boats', quantity: 5, unit: 'units' },
        { name: 'Food Kits', quantity: 300, unit: 'kits' },
        { name: 'Life Jackets', quantity: 150, unit: 'units' },
        { name: 'Flashlights', quantity: 80, unit: 'units' },
      ],
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    });
  }

  if (config.url === '/health-inventory' && config.method === 'get') {
    config.adapter = async () => ({
      data: [
        { name: 'First Aid Kits', available: 50, needed: 80, unit: 'kits' },
        { name: 'IV Fluids', available: 120, needed: 200, unit: 'bags' },
        { name: 'Antibiotics', available: 500, needed: 500, unit: 'doses' },
        { name: 'Oxygen Tanks', available: 10, needed: 25, unit: 'cylinders' },
      ],
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    });
  }

  if (config.url?.startsWith('/chat') && config.method === 'get') {
    config.adapter = async () => ({
      data: [
        { from: 'admin', text: 'Route is clear to Sector 21.', timestamp: '2026-02-06T16:10:00Z' },
        { from: 'police', text: 'Need 2 boats near Sector 21 bridge.', timestamp: '2026-02-06T16:11:00Z' },
      ],
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    });
  }

  if (config.url === '/chat' && config.method === 'post') {
    config.adapter = async () => ({
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    });
  }

  return config;
});

export default api;
