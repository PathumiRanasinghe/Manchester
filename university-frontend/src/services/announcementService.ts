import api from './api';
import { Announcement } from '../types/Announcement';


export async function getAnnouncementsByDepartmentId(departmentId: number): Promise<Announcement[]> {
  const response = await api.get(`/departments/${departmentId}/announcements`);
  return response.data;
}

export async function deleteAnnouncement(id: number): Promise<void> {
  await api.delete(`/announcements/${id}`);
}

export async function postAnnouncement(announcement: Partial<Announcement>): Promise<void> {
  await api.post('/announcements', announcement);
}

export async function getAnnouncementsByLecturerId(lecturerId: number): Promise<Announcement[]> {
  const response = await api.get(`/lecturers/${lecturerId}/announcements`);
  return response.data;
}
