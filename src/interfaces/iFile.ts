import { IUser } from "./IUser";

export type IFileData = {
  id: number;
  id_storage_file: string;
  name: string;
  language: string;
  user: IUser;
  projectId?: number;
};

export type IFileCodeData = {
  id: number;
  projectId: number;
  name: string;
  language: string;
  code: string;
};
