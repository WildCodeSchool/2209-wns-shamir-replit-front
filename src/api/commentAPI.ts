import { api } from "./_graphQL";
import { IComment, CreateComment } from "../interfaces/IComment";
import { gql } from "@apollo/client";

export const commentAPI = {
  create: async (comment: CreateComment): Promise<IComment> => {
    const newComment = (
      await api.mutate({
        // mutation à refaire lorsque le back sera OP
        mutation: gql`
          mutation Mutation($data: ICodeComment!) {
            createCodeComment(data: $data) {
              user {
                id
              }
            }
          }
        `,
        variables: {
          data: {
            fileId: comment.fileId,
            comment: comment.comment,
            userId: comment.userId,
            char_length: comment.char_length,
            char_number: comment.char_number,
            is_report: comment.is_report,
            line_number: comment.line_number,
            resolved: comment.resolved,
          },
        },
      })
    ).data.createCodeComment as IComment;

    return { ...newComment, id: newComment.id };
  },
};
