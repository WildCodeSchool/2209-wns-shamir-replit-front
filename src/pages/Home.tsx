import React, { useContext, useEffect, useState } from "react";
import styles from "./Home.module.scss";
import ProjectItem from "../components/ProjectItem";
import { useNavigate } from "react-router-dom";
import { projectAPI } from "../api/projectAPI";
import { IProject, CreateProject } from "../interfaces/IProject";
import NewProjectModal from "../components/NewProjectModal";
import UserContext from "../contexts/userContext";
import ProjectContext from "../contexts/projectContext";
import { Autocomplete, TextField } from "@mui/material";
import DeleteModalContext from "../contexts/deleteModalContext";
import DeleteModal from "../components/DeleteModal";
import ForceProjectListUpdateContext from "../contexts/forceProjectListUpdateContext";

const Home = () => {
  const [myProjects, setMyProjects] = useState<IProject[]>();
  const [sharedProjects, setSharedProjects] = useState<IProject[]>();
  const [publicProjects, setPublicProjects] = useState<IProject[]>();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showMyProjectList, setShowMyProjectList] = useState(true);
  const [showSharedProjectList, setShowSharedProjectList] = useState(true);
  const [showAllProjectList, setShowAllProjectList] = useState(true);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
  const { user } = useContext(UserContext);
  const { setProject } = useContext(ProjectContext);
  const { deleteModal, setDeleteModal } = useContext(DeleteModalContext);
  const { forceProjectListUpdate, setForceProjectListUpdate } = useContext(
    ForceProjectListUpdateContext
  );

  const navigate = useNavigate();

  const openNewProjectModal = () => {
    setShowNewProjectModal(true);
  };

  const closeNewProjectModal = () => {
    setShowNewProjectModal(false);
  };

  const closeDeleteModal = () => {
    setDeleteModal({});
  };

  const token = localStorage.getItem("token");

  const handleArrowClick = (
    list: "myProjects" | "sharedProjects" | "allProjects"
  ) => {
    if (list === "myProjects") setShowMyProjectList(!showMyProjectList);
    if (list === "sharedProjects")
      setShowSharedProjectList(!showSharedProjectList);
    if (list === "allProjects") setShowAllProjectList(!showAllProjectList);
  };

  const handleSearch = (
    event: React.SyntheticEvent,
    newValue: string | null
  ) => {
    setSearchValue(newValue || undefined);
  };

  const getMyProjects = async () => {
    const projects = await projectAPI.getAll();
    setMyProjects(projects);
  };

  const getSharedProjects = async () => {
    const projects = await projectAPI.getSharedWithMe();
    setSharedProjects(projects);
  };

  const getPublicProjects = async () => {
    const projects = await projectAPI.getPublic();

    setPublicProjects(projects);
  };

  const createNewProject = async (project: Omit<CreateProject, "userId">) => {
    setShowNewProjectModal(false);
    await projectAPI.create(project);
    await getEveryProjects();
  };

  const getEveryProjects = async () => {
    console.log("getEveryProjects");

    await getMyProjects();
    await getSharedProjects();
    await getPublicProjects();
    if (forceProjectListUpdate === true) setForceProjectListUpdate(false);
  };

  const filterBySearch = (project: IProject) => {
    if (!searchValue) return true;

    const description = project.description.toLowerCase();
    const name = project.name.toLowerCase();
    const rawLogin = project.userId?.login;
    let login: string | undefined = undefined;
    if (rawLogin) login = project.userId?.login.toLowerCase();

    return (
      login?.includes(searchValue) ||
      name.includes(searchValue) ||
      description.includes(searchValue)
    );
  };

  const getSearchFields = () => {
    if (myProjects && sharedProjects && publicProjects) {
      return [
        ...new Set(
          [...myProjects, ...sharedProjects, ...publicProjects]
            .map((pro) => [
              pro.name,
              ...pro.description.split(" "),
              pro.userId?.login,
            ])
            .flat()
            .filter((word) => word && word.length > 2)
            .map((word) => (word ? word.toLowerCase() : word)) as string[]
        ),
      ].sort((wordA, wordB) => (wordA > wordB ? 1 : wordA < wordB ? -1 : 0));
    }

    return [];
  };

  useEffect(() => {
    // console.log("useEffect");
    if (!token) {
      navigate("/login");
    }
  });

  useEffect(() => {
    console.log("useEffect[]");

    setForceProjectListUpdate(true);
    setProject({});
  }, []);

  useEffect(() => {
    console.log("useEffect[forceProjectListUpdate]");
    if (forceProjectListUpdate === true) getEveryProjects();
  }, [forceProjectListUpdate]);

  return (
    <>
      <div>
        <div>
          <Autocomplete
            value={searchValue}
            onChange={handleSearch}
            size="small"
            options={getSearchFields()}
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

        <section className={styles.section}>
          <h2 onClick={() => handleArrowClick("myProjects")}>
            <img
              src="/triangle.svg"
              alt="triangle"
              className={[
                styles.arrowDown,
                showMyProjectList ? null : styles.arrowLeft,
              ].join(" ")}
            />
            <span>My Projects</span>
          </h2>

          <div className={styles.projectsContainer}>
            {showMyProjectList === true && (
              <>
                {myProjects &&
                  myProjects.length > 0 &&
                  myProjects
                    ?.filter(filterBySearch)
                    .map((project) => (
                      <ProjectItem
                        key={project.id}
                        project={project}
                        owned={true}
                        getEveryProjects={getEveryProjects}
                      />
                    ))}
                <article
                  className={styles.newProject}
                  onClick={openNewProjectModal}
                >
                  <img
                    src="/add-circle.svg"
                    alt="add"
                    className={styles.addIcon}
                  />
                  <span>new project</span>
                </article>
              </>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2 onClick={() => handleArrowClick("sharedProjects")}>
            <img
              src="/triangle.svg"
              alt="triangle"
              className={[
                styles.arrowDown,
                showSharedProjectList ? null : styles.arrowLeft,
              ].join(" ")}
            />
            <span>Projects shared with me</span>
          </h2>
          {showSharedProjectList &&
            sharedProjects &&
            sharedProjects.length > 0 && (
              <div className={styles.projectsContainer}>
                {sharedProjects?.filter(filterBySearch).map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    owned={false}
                    getEveryProjects={getEveryProjects}
                  />
                ))}
              </div>
            )}
        </section>

        <section className={styles.section}>
          <h2 onClick={() => handleArrowClick("allProjects")}>
            <img
              src="/triangle.svg"
              alt="triangle"
              className={[
                styles.arrowDown,
                showAllProjectList ? null : styles.arrowLeft,
              ].join(" ")}
            />
            <span>All public projects</span>
          </h2>
          {showAllProjectList &&
            publicProjects &&
            publicProjects.length > 0 && (
              <div className={styles.projectsContainer}>
                {publicProjects
                  ?.filter(filterBySearch)
                  .filter((project) => project.userId?.id !== user.id)
                  .map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      owned={false}
                      getEveryProjects={getEveryProjects}
                    />
                  ))}
              </div>
            )}
        </section>
      </div>
      {showNewProjectModal === true && (
        <NewProjectModal
          createNewProject={createNewProject}
          closeNewProjectModal={closeNewProjectModal}
        />
      )}
      {deleteModal.projectId !== undefined && (
        <DeleteModal
          closeDeleteModal={closeDeleteModal}
          getEveryProjects={getEveryProjects}
        />
      )}
    </>
  );
};

export default Home;
