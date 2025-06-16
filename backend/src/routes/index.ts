import express, { NextFunction, Request, Response } from "express";
import apiRouter from './api'

const router = express.Router();

router.use('/api', apiRouter);

router.get("/api/csrf/restore", (req: Request, res: Response, _next: NextFunction) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

export default router;
