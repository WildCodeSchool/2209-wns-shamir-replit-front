export type CreateComment = {
  fileId: number;
  comment: string;
  userId: number;
  char_length: number;
  char_number: number;
  is_report: number;
  line_number: number;
  resolved: boolean;
};

export type IComment = {
  id: number;
  fileId: number;
  comment: string;
  userId: number;
  char_length: number;
  char_number: number;
  is_report: number;
  line_number: number;
  resolved: boolean;
  comment_date: Date;
};
