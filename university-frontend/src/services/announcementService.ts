import axios from 'axios';
import { Announcement } from '../types/Announcement';

export async function getAnnouncements(): Promise<Announcement[]> {
  const response = await axios.get('/announcements');
  return response.data;
}
