import React, { useEffect, useState } from "react";
import { commentAPI } from "../api/commentAPI";
import "./Comment.scss";
import {
  IComment,
  ICommentAnswer,
  CreateComment,
  CreateCommentAnswer,
} from "../interfaces/IComment";

type CommentSectionProps = {
  fileID: number;
};

const CommentSection = (props: CommentSectionProps) => {
  const [newReplyText, setNewReplyText] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [commentsState, setCommentsState] = useState<IComment[]>([]);
  const [commentsAnswerState, setCommentsAnswerState] = useState<
    ICommentAnswer[]
  >([]);

  useEffect(() => {
    getAllComment();
  }, []);

  const getAllComment = async () => {
    const comments = await commentAPI.getAllComment(props.fileID);
    const commentsAns: ICommentAnswer[] = [];
    comments.forEach((comment) => {
      comment.commentAnswer.forEach((element) => {
        commentsAns.push({
          answer_date: element.answer_date,
          codeComment: element.codeComment,
          id: element.id,
          comment: element.comment,
          userId: element.userId,
        });
      });
    });
    setCommentsState(comments);
    setCommentsAnswerState(commentsAns);
  };

  const handleAddComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newComment: CreateComment = {
      comment: newReplyText,
      char_length: 5,
      char_number: 5,
      fileId: props.fileID,
      is_report: false,
      line_number: 5,
      resolved: false,
    };
    const createdComment = await commentAPI.create(newComment);
    const updatedComments: IComment[] = [...commentsState, createdComment];
    setNewReplyText("");
    setCommentsState(updatedComments);
  };

  const handleAddReply = async (commentId: number) => {
    const newReply: CreateCommentAnswer = {
      comment: newReplyText,
      codeCommentId: commentId,
    };
    const createdAnswerComment = await commentAPI.createCommentAnswer(
      newReply.comment,
      newReply.codeCommentId
    );
    const updatedCommentsAnswer: ICommentAnswer[] = [
      ...commentsAnswerState,
      createdAnswerComment,
    ];
    setNewReplyText("");
    setCommentsAnswerState(updatedCommentsAnswer);
  };

  return (
    <div className="comment-container">
      <h1>Commentaires</h1>
      {commentsState.length > 0 && (
        <div className="comment-section">
          <h2>Comments</h2>
          <form onSubmit={handleAddComment}>
            <input
              type="text"
              placeholder="Write a comment"
              value={newReplyText}
              onChange={(e) => setNewReplyText(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
          {commentsState.map((comment) => (
            <div key={comment.id} className="comment">
              <p>{comment.comment}</p>
              <button onClick={() => setReplyToCommentId(comment.id)}>
                Reply
              </button>
              {replyToCommentId === comment.id && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault(), handleAddReply(comment.id);
                  }}
                  className="reply-form"
                >
                  <input
                    type="text"
                    placeholder="Write a reply"
                    value={newReplyText}
                    onChange={(e) => setNewReplyText(e.target.value)}
                  />
                  <button type="submit">Submit</button>
                </form>
              )}
              {commentsAnswerState.length > 0 && (
                <div className="replies">
                  {commentsAnswerState.map((reply) => (
                    <div key={reply.codeComment.id} className="comment reply">
                      <p>@{reply.comment}</p>
                      <button onClick={() => setReplyToCommentId(comment.id)}>
                        Reply
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
