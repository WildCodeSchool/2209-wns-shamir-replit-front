/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./_graphQL";
import { fileRequest } from "./fileRequest";
import { IFileData, IFileCodeData } from "../interfaces/iFile";
import { gql } from "@apollo/client";

export type updateRes = {
  success: boolean;
};

type ResGetFilesAndCode = {
  getFilesByProjectId: IFileData[];
  getCodeFiles: IFileCodeData[];
};

export const fileAPI = {
  getAllFilesByProjectId: async (projectId: number): Promise<any> => {
    const { data } = await api.query({
      query: gql`
        query GetFilesByProjectId($projectId: Float!) {
          getFilesByProjectId(projectId: $projectId) {
            id
            name
            id_storage_file
            language
          }
          getCodeFiles(projectId: $projectId) {
            code
            language
            name
            projectId
          }
        }
      `,
      variables: { projectId },
    });

    const allProjectFiles: ResGetFilesAndCode = {
      getFilesByProjectId: data.getFilesByProjectId,
      getCodeFiles: data.getCodeFiles,
    };

    return allProjectFiles;
  },
  updateFileOnline: async (
    codeToPush: string,
    fileId: number,
    projectId: number,
    socketIds: string[],
    updatedLines: number[]
  ) => {
    try {
      const { data } = await api.mutate({
        mutation: fileRequest.updateCodeFile,
        variables: {
          contentData: codeToPush,
          fileId: fileId,
          projectId: projectId,
          socketIds: JSON.stringify(socketIds),
          updatedLines: JSON.stringify(updatedLines),
        },
      });
      return JSON.parse(data.updateCodeFile) as updateRes;
    } catch (err) {
      console.error(err);
    }
  },
};
