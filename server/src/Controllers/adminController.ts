import { type Request, type Response } from 'express';
import * as adminService from '../Services/adminService.js';

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }
  const admin = adminService.loginAdmin(email, password);
  if (!admin) {
    res.status(401).json({ message: 'Wrong email or password' });
    return;
  }
  res.json(admin);
};

export const changePassword = (req: Request, res: Response) => {
  const { newPassword } = req.body;
  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters' });
    return;
  }
  if (!adminService.changeAdminPassword(String(req.params.id), newPassword)) {
    res.status(404).json({ message: 'Admin not found' });
    return;
  }
  res.status(204).send();
};