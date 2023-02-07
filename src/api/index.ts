import {Router} from 'express';
import authRoutes from './routes/auth';
import bookingRoutes from './routes/booking';
import dashboardRoutes from './routes/dashboard';
import hotelRoutes from './routes/hotel';
import roomRoutes from './routes/room';

export default () => {
  const app = Router();
  authRoutes(app);
  hotelRoutes(app);
  roomRoutes(app);
  dashboardRoutes(app);
  bookingRoutes(app);
  return app;
};
