import api from './api';
import { AnnouncementDto } from '../types/AnnouncementDto';


export async function getAnnouncementsByDepartmentId(departmentId: number): Promise<AnnouncementDto[]> {
  const response = await api.get(`/departments/${departmentId}/announcements`);
  return response.data;
}

export async function deleteAnnouncement(id: number): Promise<void> {
  await api.delete(`/announcements/${id}`);
}

export async function postAnnouncement(announcement: AnnouncementDto): Promise<void> {
  await api.post('/announcements', announcement);
}

export async function getAnnouncementsByLecturerId(lecturerId: number): Promise<AnnouncementDto[]> {
  const response = await api.get(`/lecturers/${lecturerId}/announcements`);
  return response.data;
}
