import {Request} from 'express';
import Joi from 'joi';

const authValidator = {

  // Registration validation
  validateRegistration(req: Request) {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
      phone: Joi.string(),
      address: Joi.string(),
    });
    return schema.validate({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      phone: req.body.phone,
      address: req.body.address,
    }).error;
  },

  // Login validation
  validateLogin(req: Request) {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    return schema.validate({
      email: req.body.email,
      password: req.body.password,
    }).error;
  },
};

export default authValidator;
