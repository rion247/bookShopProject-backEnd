import { Request, Response } from 'express';
import status from 'http-status';

const notFound = (req: Request, res: Response) => {
  return res.status(status.NOT_FOUND).json({
    success: false,
    message: 'Sorry!!! API Not Found!!!',
    error: '',
  });
};

export default notFound;
