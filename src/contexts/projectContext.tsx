import { createContext, useState, useMemo, ReactNode } from "react";
import { ExtProject } from "../interfaces";

const initProject: Partial<ExtProject> = {
  id: undefined,
  name: undefined,
  owner: undefined,
  description: undefined,
  languages: [],
  nb_like: undefined,
  nb_views: undefined,
  is_public: undefined,
};

type ProjectContextProviderProps = { children: ReactNode };
type TypeContext = {
  project: Partial<ExtProject>;
  setProject: (c: Partial<ExtProject>) => void;
};

const ProjectContext = createContext<TypeContext>({
  project: initProject,
  setProject: () => {},
});

export function ProjectContextProvider({
  children,
}: ProjectContextProviderProps) {
  const [project, setProject] = useState<Partial<ExtProject>>(initProject);
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
