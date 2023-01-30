import {Request} from 'express';
import Joi from 'joi';

const authValidator = {

  // Registration validation
  validateRegistration(req: Request) {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
    });
    return schema.validate({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      role: req.body.role,
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
