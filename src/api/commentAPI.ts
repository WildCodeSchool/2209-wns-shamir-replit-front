import { api } from "./_graphQL";
import {
  IComment,
  CreateComment,
  ICommentAnswer,
} from "../interfaces/IComment";
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
            fileCodeId: comment.fileId,
            comment: comment.comment,
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
  createCommentAnswer: async (
    comment: string,
    codeCommentId: number
  ): Promise<ICommentAnswer> => {
    console.log(comment, codeCommentId);
    const newCommentAnswer = (
      await api.mutate({
        mutation: gql`
          mutation CreateCommentAnswer(
            $comment: String!
            $codeCommentId: Float!
          ) {
            createCommentAnswer(
              comment: $comment
              codeCommentId: $codeCommentId
            ) {
              id
              comment
              answer_date
              codeComment {
                id
              }
              user {
                id
              }
            }
          }
        `,
        variables: {
          comment: comment,
          codeCommentId: codeCommentId,
        },
      })
    ).data.createCommentAnswer as ICommentAnswer;

    return { ...newCommentAnswer, id: newCommentAnswer.id };
  },
  getAllComment: async (fileId: number): Promise<IComment[]> => {
    try {
      const comments = (
        await api.query({
          query: gql`
            query GetAllCodeComment($fileId: Float!) {
              getAllCodeComment(fileId: $fileId) {
                char_length
                char_number
                comment
                commentAnswer {
                  codeComment {
                    id
                    comment
                  }
                  id
                  answer_date
                  comment
                  user {
                    id
                  }
                }
                comment_date
                fileCode {
                  id
                }
                is_report
                line_number
                resolved
                user {
                  id
                }
                id
              }
            }
          `,
          variables: { fileId },
        })
      ).data.getAllCodeComment as IComment[];

      return comments;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
};
