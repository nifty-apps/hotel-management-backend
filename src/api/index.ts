import {Router} from 'express';
import authRoute from './routes/auth';
import hotelRoute from './routes/hotel';
import roomRoute from './routes/room';
export default () => {
  const app = Router();
  authRoute(app);
  hotelRoute(app);
  roomRoute(app);
  return app;
};
