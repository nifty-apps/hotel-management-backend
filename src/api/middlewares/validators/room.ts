import {Request} from 'express';
import Joi from 'joi';

const roomValidator = {

  // Registration validation
  validateRoom(req: Request) {
    const schema = Joi.object({
      number: Joi.string().required(),
    });
    return schema.validate({
      number: req.body.number,
    }).error;
  },

};

export default roomValidator;
