import {Request} from 'express';
import Joi from 'joi';

const bookingValidatior = {

  // validation booking
  validateBooking(req: Request) {
    const schema = Joi.object({
      customer: Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
      }).required(),
      rent: Joi.number().required(),
      checkIn: Joi.date().required(),
      checkOut: Joi.date().required(),
    });
    return schema.validate(req.body).error;
  },
};

export default bookingValidatior;
