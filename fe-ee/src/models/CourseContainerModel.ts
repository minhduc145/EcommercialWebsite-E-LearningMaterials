import { CourseFileModel } from "./CourseFileModel";

export interface CourseContainerModel {
    id: string;
    name: string;
    createdAt: string;
    files: CourseFileModel[] | [];
  }