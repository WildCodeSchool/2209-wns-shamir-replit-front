import { IProject } from "../interfaces/IProject";
import { IUser } from "../interfaces/IUser";

export const isLiked = (
  project: Partial<IProject>,
  user: Partial<IUser>,
  target: "src" | "alt"
) => {
  const projectLike = project.like;
  const userId = user.id;

  let isLiked = false;

  if (projectLike && projectLike.length && userId !== undefined) {
    console.log("YOOOOOO", projectLike);

    isLiked =
      projectLike.filter((like) => like.userId === parseInt(userId, 10))
        .length > 0;
    console.log("HERE", isLiked);
  }

  if (target === "src") return isLiked ? "/heart-full.svg" : "/heart-empty.svg";
  if (target === "alt") return isLiked ? "heart-full" : "heart-empty";
};
