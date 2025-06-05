import { FavouritesAndSubsDTO } from "./FavouritesAndSubsDTO";

export interface RefundRequestModel {
  id: number;
  status: string;
  userReason: string;
  createdAt: string;      
  updateAt: string;     
  adminReason: string;
  subscription: FavouritesAndSubsDTO;
}