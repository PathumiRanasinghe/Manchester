import api from './api';
import { Admin } from '../types/Admin';

export const getAdminById = async (adminId:number): Promise<Admin> => {
    const response = await api.get(`/admins/${adminId}`);
    return response.data as Admin;
};

export const getAdminByEmail = async (email: string): Promise<Admin> => {
    const response = await api.get(`/admins/by-email?email=${encodeURIComponent(email)}`);
    return response.data as Admin;
};





