export type IUserId = {
  id: number;
  login: string;
  email: string;
};

export type ILike = {
  id: number;
  userId: Pick<IUserId, "id">;
};

export type IProjectShare = {
  id: number;
  userId: IUserId;
  comment: boolean;
  read: boolean;
  write: boolean;
};

export type IProject = {
  id: string;
  id_storage_number: string;
  name: string;
  description: string;
  isPublic: boolean;
  like?: ILike[];
  projectShare?: IProjectShare[];
  nb_views: number;
  file: { language: string }[];
  userId?: Omit<IUserId, "email">;
};

export type CreateProject = {
  userId: number;
  name: string;
  description: string;
  isPublic: boolean;
};

export type UpdateProject = {
  name: string;
  description: string;
  public: boolean;
};
