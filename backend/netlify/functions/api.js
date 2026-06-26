import serverless from 'serverless-http';
import app from '../../src/app.js';

// Ini memungkinkan Express app berjalan sebagai Netlify Function
export const handler = serverless(app);
