import { IUser } from "./IUser";

// export type IUserId = {
//   id: number;
//   login: string;
//   email: string;
// };

export type ILike = {
  id: number;
  user: IUser;
};

export type IProjectShare = {
  id: number;
  user: IUser;
  comment: boolean;
  read: boolean;
  write: boolean;
};

export type IProject = {
  id: number;
  id_storage_number: string;
  name: string;
  description: string;
  isPublic: boolean;
  like?: ILike[];
  projectShare?: IProjectShare[];
  nb_views: number;
  file: { language: string }[];
  user?: IUser;
};

export type CreateProject = {
  name: string;
  description: string;
  isPublic: boolean;
};

export type UpdateProject = {
  name: string;
  description: string;
  public: boolean;
};
