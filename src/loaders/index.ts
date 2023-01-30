import {Application} from 'express';
import expressLoader from './express';
import Logger from './logger';
import mongooseLoader from './mongoose';

export default async (app: Application) => {
  await mongooseLoader();
  Logger.info('🔌 DB connected!');
  await expressLoader(app);
  Logger.info('✌️  Express loaded');
};
