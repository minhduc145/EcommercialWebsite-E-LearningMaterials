import { UserModel } from './UserModel';
import { CategoryModel } from './CategoryModel';
import { CourseReviewModel } from './CourseReviewModel';

export interface CourseModel {
  id: number;
  createdAt: string;
  description: string;
  isAvailable: boolean;
  price: number | 0;
  status: string;
  thumbnailUrl: string;
  title: string;
  creator: UserModel;
  category: CategoryModel;
  reviews: CourseReviewModel[] | null
  subscriberNumber: number | 0
}
