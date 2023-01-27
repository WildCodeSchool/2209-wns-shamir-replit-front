import { createContext, useState, useMemo, ReactNode } from "react";
import { IProject } from "../interfaces/IProject";

const initProject: Partial<IProject> = {
  id: undefined,
  id_storage_number: undefined,
  name: undefined,
  description: undefined,
  isPublic: undefined,
  nb_likes: undefined,
  nb_views: undefined,
  file: [],
};

type ProjectContextProviderProps = { children: ReactNode };
type TypeContext = {
  project: Partial<IProject>;
  setProject: (c: Partial<IProject>) => void;
};

const ProjectContext = createContext<TypeContext>({
  project: initProject,
  setProject: () => {},
});

export function ProjectContextProvider({
  children,
}: ProjectContextProviderProps) {
  const [project, setProject] = useState<Partial<IProject>>(initProject);
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
