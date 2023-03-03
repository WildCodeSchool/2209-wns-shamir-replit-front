import {
  Autocomplete,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import React, {
  BaseSyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import ProjectContext from "../contexts/projectContext";
import styles from "./ShareModal.module.scss";
import modalStyles from "../styles/modal.module.scss";
import { userAPI } from "../api/userAPI";
import { IUser } from "../interfaces/IUser";
import { projectShareAPI } from "../api/projectShareAPI";
import { IProject, IProjectShare } from "../interfaces/IProject";
import UserContext from "../contexts/userContext";
import { projectAPI } from "../api/projectAPI";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EditIcon from "@mui/icons-material/Edit";

type ShareModalProps = {
  closeShareModal: () => void;
};

const ShareModal = ({ closeShareModal }: ShareModalProps) => {
  const { project, setProject } = useContext(ProjectContext);
  const { user } = useContext(UserContext);
  const [userList, setUserList] = useState<IUser[]>([]);
  const [selectValue, setSelectValue] = useState("");

  const handleUpdateSharingMode = async (
    e: React.MouseEvent<HTMLElement>,
    rawShareValue: string[],
    projectShareId: number
  ) => {
    let shareValue = rawShareValue;
    if (rawShareValue.includes("write") && !rawShareValue.includes("comment"))
      shareValue = ["read"];
    if (rawShareValue.includes("comment") && !rawShareValue.includes("read"))
      shareValue = ["read"];

    const projectShare: Partial<IProjectShare> = {};

    projectShare.write = shareValue.includes("write");
    projectShare.comment = projectShare.write || shareValue.includes("comment");
    projectShare.read = projectShare.comment || shareValue.includes("read");

    await projectShareAPI.update({ projectShareId, projectShare });

    setProject({
      ...project,
      projectShare: project.projectShare?.map((pshare) =>
        pshare.id === projectShareId ? { ...pshare, ...projectShare } : pshare
      ),
    });
  };

  const handleAddUser = async (
    event: React.SyntheticEvent,
    newValue: string | null
  ) => {
    if (newValue) {
      const projectId = project.id;

      const userListFiltered = userList.filter(
        (user) => user.email === newValue || user.login === newValue
      );

      if (projectId && userListFiltered.length) {
        const { id: userId, login, email } = userListFiltered[0];

        const id = await projectShareAPI.create({
          projectId: parseInt(projectId, 10),
          userId: parseInt(userId, 10),
          comment: false,
          write: false,
          read: false,
        });

        const projectProjectShare = project.projectShare;
        const projectShare: IProjectShare[] = [
          ...(projectProjectShare !== undefined ? projectProjectShare : []),
          {
            id,
            userId: {
              id: parseInt(userId, 10),
              login,
              email,
            },
            comment: false,
            read: false,
            write: false,
          },
        ];
        if (projectProjectShare !== undefined)
          setProject({ ...project, projectShare });
      }

      setSelectValue("");
    }
  };

  const togglePublic = async () => {
    const updatedProject: Partial<IProject> = {
      isPublic: !project.isPublic,
    };
    const projectId = project.id;
    if (projectId !== undefined) {
      await projectAPI.update(projectId, updatedProject);
      setProject({ ...project, isPublic: !project.isPublic });
    }
  };

  const getUserList = () => {
    const projectProjectShare = project.projectShare;

    let alreadySharedWithIds: string[] = [];
    if (projectProjectShare)
      alreadySharedWithIds = projectProjectShare.map((pshare) =>
        pshare.userId.id.toString()
      );

    return userList
      .filter((u) => u.id !== user.id && !alreadySharedWithIds.includes(u.id))
      .map((user) => user.login);
  };

  const getAllUsers = async () => {
    const allUsers = await userAPI.getAll();
    setUserList(allUsers);
  };

  const handleModalClick = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className={modalStyles.modalBackground} onClick={closeShareModal}>
      <div className={modalStyles.modalContainer} onClick={handleModalClick}>
        <h3>Partager le projet [{project.name}]</h3>
        <div className={styles.flexRow}>
          <Switch
            checked={project.isPublic}
            onChange={togglePublic}
            name="public private swtich"
            defaultChecked
          />
          <h4 onClick={togglePublic}>
            Projet {project.isPublic ? "public" : "privé"}
          </h4>
        </div>
        <div>
          <h4>Liste des partages</h4>
          {project.projectShare && project.projectShare.length > 0 ? (
            <table className={styles.table}>
              <tr>
                <td></td>
                <td></td>
              </tr>
              {project.projectShare?.map((share) => (
                <tr key={share.id}>
                  <td>{share.userId.login}</td>
                  <td>
                    <ToggleButtonGroup
                      value={(
                        ["read", "comment", "write"] as (keyof IProjectShare)[]
                      ).filter((sh) => share[sh] === true || sh === "read")}
                      onChange={(e, val) =>
                        handleUpdateSharingMode(e, val, share.id)
                      }
                      aria-label="text alignment"
                    >
                      <ToggleButton value="read" aria-label="read">
                        <Tooltip title="lecture" arrow>
                          <VisibilityIcon />
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton value="comment" aria-label="comment">
                        <Tooltip title="commentaires" arrow>
                          <ChatBubbleOutlineIcon />
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton value="write" aria-label="write">
                        <Tooltip title="modification" arrow>
                          <EditIcon />
                        </Tooltip>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </td>
                </tr>
              ))}
            </table>
          ) : (
            "< ce projet n'a pas été partagé >"
          )}
        </div>
        <div>
          <h4>Ajouter un utilisateur</h4>
          <Autocomplete
            value={selectValue}
            onChange={handleAddUser}
            size="small"
            options={getUserList()}
            sx={{
              width: "auto",
              height: "auto",
              fontSize: "12px",
              font: "initial",
              backgroundColor: "white",
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="recherche"
                data-testid={`autoCompleteTextField`}
              />
            )}
            ListboxProps={{ style: { fontSize: "12px" } }}
            data-testid={`autoComplete`}
          />
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
