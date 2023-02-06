// import React, { useContext, useState } from "react";
// import { commentAPI } from "../api/commentAPI";
// import  UserContext  from "../contexts/userContext";
// import ProjectContext from "../contexts/projectContext";

// interface Comment {
//   text: string;
// }

const CommentSection = () => {
  //   const [comments, setComments] = useState<Comment[]>([]);
  //   const { user, setUser } = useContext(UserContext);
  //   const [newComment, setNewComment] = useState("");
  //   const [fileID, setFileID] = useState<Number>();
  //   const getAllComment = () => {
  //     const comments = await commentAPI.getAll();
  //     setComments(comments)
  //   };
  //   const getFileIdByUser = () => {
  //     const fileID = await commentAPI.getAll();
  //     setFileID(fileID)
  //   };
  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     const comments = {
  //       fileId: fileID.id;
  //       comment: newComment;
  //       userId: user.id;
  //     }
  //     await commentAPI.create(newComment)
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
};

export default CommentSection;
