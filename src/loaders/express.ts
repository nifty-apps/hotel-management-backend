
import {Application, json} from 'express';
import morgan from 'morgan';
import apiRoutes from '../api';

export default async (app: Application) => {
  app.use(json());
  app.use(morgan('dev'));
  app.use('/api', apiRoutes());
};
