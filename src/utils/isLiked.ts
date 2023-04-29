import { IProject } from "../interfaces/IProject";
import { IUser } from "../interfaces/IUser";

export const isLiked = (
  project: Partial<IProject>,
  user: Partial<IUser>,
  target: "src" | "alt"
) => {
  // Récupérer le tableau des "likes" pour le projet donné
  const projectLikes = project.like;
  // Récupérer l'ID de l'utilisateur

  // Initialiser la variable de réponse à false
  let isLiked = false;

  // Vérifier si le projet a été aimé par l'utilisateur
  if (projectLikes?.length && user.id !== undefined) {
    isLiked = projectLikes.some((like) => like.user.id === user.id);
  }

  if (target === "src") return isLiked ? "/heart-full.svg" : "/heart-empty.svg";
  if (target === "alt") return isLiked ? "heart-full" : "heart-empty";
};

// export const isLiked = (
//   project: IProject,
//   user: Partial<IUser>,
//   target: "src" | "alt"
// ) => {
//   const projectLike = project.like;
//   const _userId = user.id;

//   let isLiked = false;

//   if (projectLike && projectLike.length && _userId !== undefined) {
//     isLiked =
//       projectLike.filter((like) => like.userId.id === parseInt(_userId, 10))
//         .length > 0;
//   }

//   if (target === "src") return isLiked ? "/heart-full.svg" : "/heart-empty.svg";
//   if (target === "alt") return isLiked ? "heart-full" : "heart-empty";
// };
