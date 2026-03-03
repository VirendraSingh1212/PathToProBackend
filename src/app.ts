import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import corsOptions from './config/cors';
import { errorMiddleware } from './middleware/error.middleware';
import { notFoundMiddleware } from './middleware/notFound.middleware';
import apiRoutes from './routes/index';

// BigInt Serialization Support
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

const app: Application = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root API Routes
app.use('/api', apiRoutes);

// Error Handling Middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
