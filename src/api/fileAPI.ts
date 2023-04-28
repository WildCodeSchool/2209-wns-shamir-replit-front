import { api } from "./_graphQL";
import { fileRequest } from "./fileRequest";
import { IFiles, FilesCodeData } from "../interfaces/iFile";

export type updateRes = {
  success: boolean;
};

type ResGetFilesAndCode = {
  getFilesByProjectId: IFiles[];
  getCodeFiles: FilesCodeData[];
};

export const fileAPI = {
  getAllFilesByProjectId: async (
    projectId: string
  ): Promise<ResGetFilesAndCode> => {
    try {
      const allProjectFiles = (
        await api.query({
          query: fileRequest.getFilesByProjectId,
          variables: {
            projectId: projectId,
            getCodeFilesProjectId2: projectId,
          },
        })
      ).data as ResGetFilesAndCode;
      return allProjectFiles;
    } catch (err) {
      throw new Error("Erreur getAllFilesByProjectId");
    }
  },
  updateFileOnline: async (
    codeToPush: string,
    fileId: number,
    projectId: number,
    socketIds: string[]
  ) => {
    try {
      const { data } = await api.mutate({
        mutation: fileRequest.updateCodeFile,
        variables: {
          contentData: codeToPush,
          fileId: fileId,
          projectId: projectId,
          socketIds: JSON.stringify(socketIds),
        },
      });
      return JSON.parse(data.updateCodeFile) as updateRes;
    } catch (err) {
      console.error(err);
    }
  },
};
