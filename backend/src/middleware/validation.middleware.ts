
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const safeErrors = errors.array().map((error) => {
      if (error.type === "field") {
        return {
          type: error.type,
          msg: error.msg,
          path: error.path,
          location: error.location,
        };
      }

      return {
        type: error.type,
        msg: error.msg,
      };
    });

    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: safeErrors,
    });

    return;
  }

  next();
};

export default validationMiddleware;