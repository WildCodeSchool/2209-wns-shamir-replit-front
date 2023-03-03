import { api } from "./_graphQL";
import { gql } from "@apollo/client";
import { IProjectShare } from "../interfaces/IProject";

type CreateProps = {
  projectId: number;
  userId: number;
  comment: boolean;
  write: boolean;
  read: boolean;
};

type UpdateProps = {
  projectShareId: number;
  projectShare: Partial<IProjectShare>;
};

export const projectShareAPI = {
  create: async ({
    projectId,
    userId,
    comment,
    write,
    read,
  }: CreateProps): Promise<number> => {
    const newId = (
      await api.mutate({
        // mutation à refaire lorsque le back sera OP
        mutation: gql`
          mutation Mutation(
            $userId: Float!
            $comment: Boolean!
            $write: Boolean!
            $read: Boolean!
            $projectId: Float!
          ) {
            createProjectShare(
              userId: $userId
              comment: $comment
              write: $write
              read: $read
              projectId: $projectId
            ) {
              id
            }
          }
        `,
        variables: {
          projectId,
          userId,
          comment,
          write,
          read,
        },
      })
    ).data.createProjectShare.id as number;

    return newId;
  },

  update: async ({
    projectShareId,
    projectShare,
  }: UpdateProps): Promise<number> => {
    const updatedId = (
      await api.mutate({
        mutation: gql`
          mutation Mutation(
            $projectShareId: Float!
            $projectShare: iProjectShare!
          ) {
            updateProjectShare(
              ProjectShareId: $projectShareId
              ProjectShare: $projectShare
            ) {
              id
            }
          }
        `,
        variables: {
          projectShareId,
          projectShare,
        },
      })
    ).data.updateProjectShare.id as number;

    return updatedId;
  },
};
