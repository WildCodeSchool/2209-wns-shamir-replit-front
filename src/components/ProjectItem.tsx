import { useNavigate } from "react-router-dom";
import { IProject } from "../interfaces/IProject";
import styles from "./ProjectItem.module.scss";
import ProjectContext from "../contexts/projectContext";
import React, { useContext } from "react";
import { projectAPI } from "../api/projectAPI";
import UserContext from "../contexts/userContext";
import { isLiked } from "../utils/isLiked";
import ShareModalContext from "../contexts/shareModalContext";
import DeleteModalContext from "../contexts/deleteModalContext";
import EditOffIcon from "@mui/icons-material/EditOff";

type ProjectItemProps = {
  project: IProject;
  owned?: boolean;
  getEveryProjects: () => Promise<void>;
};

const ProjectItem = ({
  project,
  owned,
  getEveryProjects,
}: ProjectItemProps) => {
  const { setProject } = useContext(ProjectContext);
  const { user } = useContext(UserContext);
  const { setShareModal } = useContext(ShareModalContext);
  const { setDeleteModal } = useContext(DeleteModalContext);

  const navigate = useNavigate();
  const handleOpenProject = async () => {
    setProject(project);
    projectAPI.addView(project.id);
    navigate("/Edit");
  };

  const handleToggleShareModal = () => {
    const projectId = project.id;

    if (projectId) {
      setProject(project);
      setShareModal({ projectId: parseInt(projectId, 10) });
    }
  };

  const handleToggleDeleteModal = () => {
    const projectId = project.id;

    if (projectId) {
      setProject(project);
      setDeleteModal({ projectId: parseInt(projectId, 10) });
    }
  };

  const toggleLike = async () => {
    const userId = user?.id;

    const alreadyLiked =
      userId !== undefined &&
      (
        project.like?.filter(
          (like) => like.userId.id === parseInt(userId, 10)
        ) || []
      ).length > 0;

    if (!alreadyLiked) await projectAPI.addLike(project.id);
    else await projectAPI.removeLike(project.id);

    await getEveryProjects();
  };

  return (
    <article className={styles.article}>
      <h3>{project.name}</h3>
      <div>
        <div className={styles.content}>
          <p>{project.description}</p>
          <button
            onClick={handleOpenProject}
            className={[styles.button, styles.edit].join(" ")}
          >
            {owned ||
            (project.projectShare?.filter((pshare) => pshare.write).length ||
              []) > 0 ? (
              <img src="/pen.svg" alt="edit" draggable={false} />
            ) : (
              <EditOffIcon />
            )}
          </button>
          {owned === true && (
            <button
              onClick={handleToggleDeleteModal}
              className={[styles.button, styles.delete].join(" ")}
            >
              <img src="/trash.svg" alt="delete" draggable={false} />
            </button>
          )}
          {/* <div className={styles.languagesContainer}>
            {project.languages.map((lan) => (
              <div>
                <img src={`/${lan}.svg`} alt={lan} draggable={false} />
              </div>
            ))}
          </div> */}
        </div>

        <div className={styles.footer}>
          {owned === true ? (
            <button
              onClick={handleToggleShareModal}
              className={[styles.button, styles.share].join(" ")}
            >
              <img src="/share.svg" alt="share" draggable={false} />
            </button>
          ) : (
            <div className={styles.hiddenButton} />
          )}

          <div>
            <img src="/eye.svg" alt="views" draggable={false} />
            {project?.nb_views}
          </div>

          <div className={styles.like} onClick={toggleLike}>
            <img
              src={isLiked(project, user, "src")}
              alt={isLiked(project, user, "alt")}
              draggable={false}
            />
            {project.like?.length || 0}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectItem;
