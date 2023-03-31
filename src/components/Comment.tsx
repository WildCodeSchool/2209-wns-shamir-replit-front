import React, { useState } from "react";
import "./Comment.scss";

// interface Comment {
//   text: string;
// }

// const CommentSection = () => {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState("");

//   //const getAllComment = () => {};

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setComments([...comments, { text: newComment }]);
//     setNewComment("");
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <ul>
//           {comments.map((comment, index) => (
//             <li key={index}>{comment.text}</li>
//           ))}
//         </ul>
//         <textarea
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//         />
//         <button type="submit">Ajouter un commentaire</button>
//       </form>
//     </div>
//   );
// };

// export default CommentSection;

interface Comment {
  id: number;
  text: string;
  replies: Comment[];
}

const CommentSection: React.FC<{ comments: Comment[] }> = ({ comments }) => {
  const [newReplyText, setNewReplyText] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [commentsState, setCommentsState] = useState(comments);

<<<<<<< HEAD
  const handleAddComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newComment = {
      id: Math.floor(Math.random() * 10000),
      text: newReplyText,
      replies: [],
    };
    const updatedComments = [...commentsState, newComment];
    setNewReplyText("");
    setCommentsState(updatedComments);
  };
=======
  // const getAllComment = () => {};
>>>>>>> origin/dev

  const handleAddReply = (commentId: number) => {
    const newReply = {
      id: Math.floor(Math.random() * 10000),
      text: newReplyText,
      replies: [],
    };
    const updatedComments = commentsState.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      } else {
        return comment;
      }
    });
    setNewReplyText("");
    setReplyToCommentId(null);
    setCommentsState(updatedComments);
  };

  return (
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
          <p>{comment.text}</p>
          <button onClick={() => setReplyToCommentId(comment.id)}>Reply</button>
          {replyToCommentId === comment.id && (
            <form
              onSubmit={() => handleAddReply(comment.id)}
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
          {comment.replies.length > 0 && (
            <div className="replies">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="comment reply">
                  <p>{reply.text}</p>
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
  );
};

const TestComment = () => {
  const comments = [
    {
      id: 1,
      text: "yo",
      replies: [
        {
          id: 2,
          text: "oy",
          replies: [],
        },
      ],
    },
    {
      id: 3,
      text: "rr.",
      replies: [],
    },
  ];

  return (
    <div className="comment-container">
      <h1>Commentaires</h1>
      <CommentSection comments={comments} />
    </div>
  );
};

export default TestComment;
