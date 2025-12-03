import axios from 'axios';
import { Admin } from '../types/Admin';

export const getAdminById = async (adminId:number): Promise<Admin> => {
    const response = await axios.get(`/admin/${adminId}`);
    return response.data as Admin;
};



