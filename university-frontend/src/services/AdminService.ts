import api from './api';
import { Admin } from '../types/Admin';
import { Lecturer } from '../types/Lecturer';

export const getAdminById = async (adminId:number): Promise<Admin> => {
    const response = await api.get(`/admins/${adminId}`);
    return response.data as Admin;
};

export const getAdminByEmail = async (email: string): Promise<Admin> => {
    const response = await api.get(`/admins/by-email?email=${encodeURIComponent(email)}`);
    return response.data as Admin;
};

export async function createLecturer({ firstName, lastName, email, password, departmentId }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    departmentId: number;
}): Promise<Lecturer> {
        const response = await api.post("/admins/lecturers", { firstName, lastName, email, password, departmentId });
        return response.data as Lecturer;
}



