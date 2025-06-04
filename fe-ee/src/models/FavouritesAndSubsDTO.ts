import { CourseModel } from "./CourseModel";

export interface FavouritesAndSubsDTO {
  id: string;
  createdAt: string;
  boughtPrice:number|0;
  isAvailable:boolean|true;
  status:string;
  course?:CourseModel
}
