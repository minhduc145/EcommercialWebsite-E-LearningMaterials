export interface CourseFileModel {
    id: string;
    name: string;
    createdAt: string;
    type: string;       
    extension: string; 
    authorId: string;
    url:string|"";
    // containerId:string|null;
  }