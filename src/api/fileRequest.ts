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
    mutation UpdateCodeFile(
      $contentData: String!
      $fileId: Float!
      $projectId: Float!
    ) {
      updateCodeFile(
        contentData: $contentData
        fileId: $fileId
        projectId: $projectId
      )
    }
  `,
};

export { fileRequest };
