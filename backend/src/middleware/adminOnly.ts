import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authRequired.js';

export function adminOnly(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: 'Admin access required.' });
    return;
  }
  next();
}
