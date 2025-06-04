export interface CourseBasicDTO {
  id: number;
  title: string;
  price: number;
  thumbnailUrl: string,
  commentCount: number;
  averageRating: number;
  categoryName: string;
  isFeatured: boolean | false;
}