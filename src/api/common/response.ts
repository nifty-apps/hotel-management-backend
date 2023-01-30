import {Response} from 'express';

export interface ISuccessData {
  res: Response;
  message?: string;
  data?: object;
  statusCode?: number;
}
export interface IErrorData {
  res: Response;
  errorMessage: string;
  statusCode?: number;
}
export function successRes(response: ISuccessData): Response {
  return response.res.status(response.statusCode ?? 200).json({
    message: response.message,
    data: response.data,

  });
}
export function errorRes(response: IErrorData): Response {
  return response.res.status(response.statusCode ?? 500).json({
    errorMessage: response.errorMessage,
  });
}


