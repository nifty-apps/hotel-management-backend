import {Router} from 'express';
import authRoute from './routes/auth';
import hotelRoute from './routes/hotel';
export default () => {
  const app = Router();
  authRoute(app);
  hotelRoute(app);
  return app;
};
