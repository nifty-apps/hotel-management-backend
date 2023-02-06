import {Request} from 'express';
import Joi from 'joi';

const roomValidator = {

  // Registration validation
  validateRoom(req: Request) {
    const schema = Joi.object({
      floor: Joi.string().required(),
      number: Joi.string().required(),
      roomType: Joi.string().required(),
      rent: Joi.number().required(),
    });
    return schema.validate({
      floor: req.body.floor,
      number: req.body.number,
      roomType: req.body.roomType,
      rent: req.body.rent,
    }).error;
  },

};

export default roomValidator;
