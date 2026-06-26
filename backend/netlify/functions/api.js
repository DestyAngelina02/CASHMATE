import serverless from 'serverless-http';
import app from '../../src/app.js';

const serverlessHandler = serverless(app);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const handler = async (event, context) => {
  // Handle CORS preflight (OPTIONS) secara eksplisit
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  // Jalankan Express app untuk semua request lainnya
  const response = await serverlessHandler(event, context);

  // Pastikan header CORS selalu ada di semua response
  response.headers = {
    ...response.headers,
    ...CORS_HEADERS,
  };

  return response;
};
