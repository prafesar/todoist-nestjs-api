import { ProjectStatus } from "./project-status.enum";

export interface Project {
  id: string;
  dateCreated: string;
  user_id: string;
  title: string;
  description: string;
  status: ProjectStatus;
}
