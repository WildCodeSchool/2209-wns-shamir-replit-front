import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";
import ProjectContext from "../contexts/projectContext";

const Header = () => {
  const { project } = useContext(ProjectContext);

  return (
    <header className={styles.container}>
      {project.name && (
        <div className={[styles.header, styles.headerLeft].join(" ")}>
          <img
            src="/list.svg"
            alt="list"
            draggable={false}
            className={styles.img}
          />
          <h2>Titre du projet</h2>
          <img
            src="/people-group.svg"
            alt="people-group"
            draggable={false}
            className={styles.img}
          />
          <img
            src="/heart-empty.svg"
            alt="heart-empty"
            draggable={false}
            className={styles.img}
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
        <img
          src="/people.svg"
          alt="people"
          draggable={false}
          className={styles.img}
        />
        <img
          src="/settings.svg"
          alt="settings"
          draggable={false}
          className={styles.img}
        />

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
  );
};

export default Header;
