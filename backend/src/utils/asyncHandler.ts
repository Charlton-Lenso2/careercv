import { NextFunction, Request, RequestHandler, Response } from "express";

// Lets controllers be `async` and still send errors to our error handler.
export function asyncHandler(
  fn: (req: Request, res: Response) => Promise<void>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };
}