import axios from 'axios';

export interface Lecturer {
  lecturerId: number;
  firstName: string;
  lastName: string;
  departmentId: number;
}

export const getLecturerById = async (lecturerId: number): Promise<Lecturer> => {
  const response = await axios.get(`/lecturers/${lecturerId}`);
  return response.data as Lecturer;
};
