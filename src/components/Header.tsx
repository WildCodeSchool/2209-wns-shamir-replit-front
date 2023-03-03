import React, { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import ProjectContext from "../contexts/projectContext";
import UserContext from "../contexts/userContext";
import { projectAPI } from "../api/projectAPI";
import { ILike } from "../interfaces/IProject";
import ShareModalContext from "../contexts/shareModalContext";
import { isLiked } from "../utils/isLiked";
import { Avatar, Tooltip } from "@mui/material";
import { userAPI } from "../api/userAPI";
import ForceProjectListUpdateContext from "../contexts/forceProjectListUpdateContext";

const Header = () => {
  const { project, setProject } = useContext(ProjectContext);
  const { user, setUser } = useContext(UserContext);
  const { setShareModal } = useContext(ShareModalContext);
  const { setForceProjectListUpdate } = useContext(
    ForceProjectListUpdateContext
  );
  // const client = useApolloClient();
  const navigate = useNavigate();

  // const token = localStorage.getItem("token");
  // const userId = localStorage.getItem("userId");

  const handleToggleModal = () => {
    const projectId = project.id;

    if (projectId) setShareModal({ projectId: parseInt(projectId, 10) });
  };

  const getInitialFromLogin = (login: string | undefined) => {
    if (!login) return " ";

    const splitted = login.split(" ");

    if (splitted.length > 1) {
      return splitted
        .map((split) => split[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    } else return login.slice(0, 2).toUpperCase();
  };

  const toggleLike = async () => {
    const userId = user?.id;
    const projectLike = project.like;

    const alreadyLiked =
      userId !== undefined &&
      (
        projectLike?.filter(
          (like) => like.userId.id === parseInt(userId, 10)
        ) || []
      ).length > 0;

    const projectId = project.id;

    if (projectId && userId) {
      if (!alreadyLiked) {
        await projectAPI.addLike(projectId);

        const newLike: ILike = { id: -1, userId: { id: parseInt(userId, 10) } };

        setProject({
          ...project,
          like: projectLike ? [...projectLike, newLike] : [newLike],
        });
      } else {
        await projectAPI.removeLike(projectId);

        setProject({
          ...project,
          like: projectLike
            ? projectLike.filter(
                (like) => like.userId.id !== parseInt(userId, 10)
              )
            : [],
        });
      }
    }
  };

  const signOut = async () => {
    localStorage.setItem("token", "");
    localStorage.setItem("userId", "");
    setUser({});
    setProject({});
    setForceProjectListUpdate(true);

    navigate("/login");
  };

  const updateUserContext = async () => {
    const localStorageUserId = localStorage.getItem("userId");

    if (user.login === undefined && localStorageUserId) {
      const reqUser = (await userAPI.getAll()).filter(
        (u) => u.id === localStorageUserId
      )[0];

      setUser({ ...reqUser, id: localStorageUserId });
    }
  };

  useEffect(() => {
    updateUserContext();
  }, [user]);

  return (
    <>
      <header className={styles.container}>
        {project.name && (
          <div className={[styles.header, styles.headerLeft].join(" ")}>
            <img
              src="/list.svg"
              alt="list"
              draggable={false}
              className={styles.img}
            />
            <h2>{project.name}</h2>
            <img
              src="/share.svg"
              alt="people-group"
              draggable={false}
              className={styles.img}
              onClick={handleToggleModal}
            />
            <img
              src={isLiked(project, user, "src")}
              alt={isLiked(project, user, "alt")}
              draggable={false}
              className={styles.img}
              onClick={toggleLike}
            />
          </div>
        )}

        <h1 className={styles.middle}>
          <img
            src="/wildcodeonline.webp"
            alt="Wild Code Online logo"
            draggable={false}
          />
        </h1>

        <div className={[styles.header, styles.headerRight].join(" ")}>
          <button onClick={signOut}>Logout</button>
          <NavLink to="/Profil">
            <Tooltip title={`logged in as ${user.login}`} arrow>
              <Avatar
                sx={{
                  bgcolor: "red",
                  width: 26,
                  height: 26,
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                <div>{getInitialFromLogin(user.login)}</div>
              </Avatar>
            </Tooltip>
          </NavLink>

          {/* <NavLink to="/Profil">
          <img
            src="/people.svg"
            alt="people"
            draggable={false}
            className={styles.img}
          />
        </NavLink> */}

          <NavLink to="/Settings">
            <img
              src="/settings.svg"
              alt="settings"
              draggable={false}
              className={styles.img}
            />
          </NavLink>

          <NavLink to="/">
            <img
              src="/home.svg"
              alt="home"
              draggable={false}
              className={styles.img}
            />
          </NavLink>
        </div>
      </header>
    </>
  );
};

export default Header;
