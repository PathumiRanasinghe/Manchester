import api from './api';
import { Admin } from '../types/Admin';

export const getAdminById = async (adminId:number): Promise<Admin> => {
    const response = await api.get(`/admins/${adminId}`);
    return response.data as Admin;
};



