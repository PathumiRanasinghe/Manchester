import axios from 'axios';
import { Announcement } from '../types/Announcement';

export async function getAnnouncements(): Promise<Announcement[]> {
  const response = await axios.get('/api/announcements');
  return response.data;
}

export async function postAnnouncement(announcement: Partial<Announcement>): Promise<void> {
  await axios.post('/api/announcements', announcement);
}
