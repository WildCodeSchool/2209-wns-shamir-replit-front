import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import { ExtProject } from "../interfaces";
import ProjectItem from "../components/ProjectItem";

const Home = () => {
  const [myProjects, setMyProjects] = useState<ExtProject[]>();
  const [sharedProjects, setSharedProjects] = useState<ExtProject[]>();
  // call API pour récupérer liste des projets du user

  useEffect(() => {
    setMyProjects([
      {
        id: 1,
        name: "boloss",
        owner: "Julien VIGNERON",
        description: "lorem",
        languages: ["javascript", "typescript"],
        nb_like: 3,
        nb_views: 12,
        is_public: true,
      },
      {
        id: 2,
        name: "boloss2",
        owner: "Julien VIGNERON",
        description: "lorem",
        languages: ["javascript"],
        nb_like: 12,
        nb_views: 122,
        is_public: true,
      },
    ]);

    setSharedProjects([
      {
        id: 1,
        name: "boloss",
        owner: "Julien VIGNERON",
        description: "lorem",
        languages: ["javascript"],
        nb_like: 3,
        nb_views: 12,
        is_public: true,
      },
      {
        id: 2,
        name: "boloss2",
        owner: "Julien VIGNERON",
        description: "lorem",
        languages: ["javascript"],
        nb_like: 12,
        nb_views: 122,
        is_public: false,
      },
    ]);
  }, []);

  return (
    <div>
      <section className={styles.section}>
        <h2>
          <img
            src="/triangle.svg"
            alt="triangle"
            className={styles.arrowDown}
          />
          <span>My Projects</span>
        </h2>

        <div className={styles.projectsContainer}>
          {myProjects?.map((project) => (
            <ProjectItem key={project.id} project={project} owned={true} />
          ))}
          <article className={styles.newProject}>
            <img src="/add-circle.svg" alt="add" className={styles.addIcon} />
            <span>new project</span>
          </article>
        </div>
      </section>
      <section className={styles.section}>
        <h2>
          <img
            src="/triangle.svg"
            alt="triangle"
            className={styles.arrowDown}
          />
          <span>Projects shared with me</span>
        </h2>
        <div className={styles.projectsContainer}>
          {sharedProjects?.map((project) => (
            <ProjectItem key={project.id} project={project} owned={false} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
