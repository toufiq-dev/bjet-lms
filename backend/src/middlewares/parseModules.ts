import { Request, Response, NextFunction } from "express";

export const parseModules = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.modules && typeof req.body.modules === "string") {
    try {
      req.body.modules = JSON.parse(req.body.modules);
    } catch (error) {
      return res.status(400).json({ error: "Invalid modules JSON" });
    }
  }
  next();
};
