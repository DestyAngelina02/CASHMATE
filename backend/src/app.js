import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import productRoutes from './routes/productRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import stockRoutes from './routes/stockRoutes.js';

dotenv.config();

const app = express();

// CORS — izinkan semua origin (aman untuk Netlify)
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check / default route
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Cashmate API v2.0.0 is running!' });
});

// API Router (digunakan oleh lokal dan Netlify Functions)
const apiRouter = express.Router();

apiRouter.use('/users', userRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/suppliers', supplierRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/transactions', transactionRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/customers', customerRoutes);
apiRouter.use('/settings', settingRoutes);
apiRouter.use('/stock', stockRoutes);

// Mount untuk lokal (http://localhost:5000/api/...)
app.use('/api', apiRouter);

// Mount untuk Netlify Functions (/.netlify/functions/api/...)
app.use('/.netlify/functions/api', apiRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

export default app;
