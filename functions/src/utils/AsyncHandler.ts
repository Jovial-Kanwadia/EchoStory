// middleware/asyncHandler.ts
import type { RequestHandler, Request, Response, NextFunction } from 'express';

const asyncHandler = (requestHandler: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
