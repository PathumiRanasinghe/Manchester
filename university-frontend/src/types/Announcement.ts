import { Lecturer } from './Lecturer';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  postedAt: string;
  lecturer: Lecturer;
}