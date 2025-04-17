import {UserModel} from "./UserModel"

export interface CourseReviewModel {
  id: number;
  comment: string;
  starRate: number;
  createdAt: string; 
  user: UserModel;
}