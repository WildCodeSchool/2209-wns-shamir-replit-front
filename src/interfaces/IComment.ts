import { IUser } from "./IUser";

export type CreateComment = {
  fileId: number;
  comment: string;
  char_length: number | null;
  char_number: number | null;
  is_report: boolean | null;
  line_number: number | null;
  resolved: boolean | null;
  id?: number;
  userId?: number;
  comment_date?: string;
  commentAnswer?: IComment[];
};

export type IComment = {
  id: number;
  fileId: number;
  comment: string;
  userId: IUser;
  char_length: number;
  char_number: number;
  is_report: number;
  line_number: number;
  resolved: boolean;
  comment_date: Date;
  commentAnswer: ICommentAnswer[];
};

export type CreateCommentAnswer = {
  comment: string;
  codeCommentId: number;
};

export type ICommentAnswer = {
  id: number;
  comment: string;
  answer_date: Date;
  userId: IUser;
  codeComment: IComment;
};
