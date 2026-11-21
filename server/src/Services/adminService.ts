import { readDb, writeDb } from './articleService.js';
import { type Admin } from '../Models/admin.js';

export const loginAdmin = (email: string, password: string): Admin | undefined => {
  const db = readDb();
  return db.admins.find((admin) => admin.email === email && admin.password === password);
}

export const changeAdminPassword = (adminId: string, newPassword: string): boolean => {
  const db = readDb();
  const adminIndex = db.admins.findIndex((admin) => admin.id === adminId);
    if (adminIndex === -1) return false;
    const admin = db.admins[adminIndex];
    if (!admin) return false;
    admin.password = newPassword;
    writeDb(db);
    return true;
}