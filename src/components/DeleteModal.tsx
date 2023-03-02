import React, { BaseSyntheticEvent, useContext } from "react";
import modalStyles from "../styles/modal.module.scss";
import DeleteModalContext from "../contexts/deleteModalContext";
import ProjectContext from "../contexts/projectContext";
import { Button } from "@mui/material";
import { projectAPI } from "../api/projectAPI";

type DeleteModalProps = {
  closeDeleteModal: () => void;
  getEveryProjects: () => Promise<void>;
};

const DeleteModal = ({
  closeDeleteModal,
  getEveryProjects,
}: DeleteModalProps) => {
  const { setDeleteModal } = useContext(DeleteModalContext);
  const { project } = useContext(ProjectContext);

  const handleModalClick = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
  };

  const handleDelete = async () => {
    const projectId = project.id;
    if (projectId) {
      await projectAPI.delete(projectId);
      await getEveryProjects();
      setDeleteModal({});
    }
  };

  return (
    <div className={modalStyles.modalBackground} onClick={closeDeleteModal}>
      <div className={modalStyles.modalContainer} onClick={handleModalClick}>
        <h3>Effacer un projet</h3>
        Etes vous sur de vouloir rééllement effacer le projet {project.name} ?
        <div className={modalStyles.buttonContainer}>
          <Button variant="contained" onClick={handleDelete} color="error">
            Effacer
          </Button>
          <Button variant="contained" onClick={closeDeleteModal}>
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
