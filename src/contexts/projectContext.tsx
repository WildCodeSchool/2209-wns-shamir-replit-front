import React, { createContext, useState, useMemo, ReactNode } from "react";
import { IProject } from "../interfaces/IProject";

const initProject: IProject = {
  id: 0,
  id_storage_number: "",
  name: "",
  description: "",
  isPublic: false,
  like: [],
  nb_views: 0,
  file: [],
};

type ProjectContextProviderProps = { children: ReactNode };
type TypeContext = {
  project: IProject;
  setProject: (c: IProject) => void;
};

const ProjectContext = createContext<TypeContext>({
  project: initProject,
  setProject: () => {
    console.warn("setUser has not been implemented");
  },
});

export function ProjectContextProvider({
  children,
}: ProjectContextProviderProps) {
  const [project, setProject] = useState<IProject>(initProject);
  const value = useMemo(
    () => ({
      project,
      setProject,
    }),
    [project]
  );
  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export default ProjectContext;
