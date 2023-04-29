import { gql } from "@apollo/client";

const fileRequest = {
  getFilesByProjectId: gql`
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
  updateCodeFile: gql`
    mutation Mutation(
      $socketIds: String!
      $fileId: Float!
      $projectId: Float!
      $contentData: String!
      $updatedLines: String!
    ) {
      updateCodeFile(
        socketIds: $socketIds
        fileId: $fileId
        projectId: $projectId
        contentData: $contentData
        updatedLines: $updatedLines
      )
    }
  `,
};

export { fileRequest };
