import React, { useState } from "react";

interface Comment {
  text: string;
}

const CommentSection = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // const getAllComment = () => {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComments([...comments, { text: newComment }]);
    setNewComment("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment.text}</li>
          ))}
        </ul>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit">Ajouter un commentaire</button>
      </form>
    </div>
  );
};

export default CommentSection;
