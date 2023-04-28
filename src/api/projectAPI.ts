import { api } from "./_graphQL";
import { IProject, CreateProject } from "../interfaces/IProject";
import { gql } from "@apollo/client";
import { api as apiREST } from "./_REST";

export const projectAPI = {
  create: async (project: Omit<CreateProject, "userId">): Promise<IProject> => {
    const newProject = (
      await api.mutate({
        // mutation à refaire lorsque le back sera OP
        mutation: gql`
          mutation CreateProject(
            $isPublic: Boolean!
            $description: String!
            $name: String!
          ) {
            createProject(
              isPublic: $isPublic
              description: $description
              name: $name
            ) {
              description
              like {
                id
                userId {
                  id
                  login
                }
              }
              projectShare {
                userId {
                  login
                  email
                  id
                }
                id
                comment
                read
                write
              }
              id
              id_storage_number
              isPublic
              name
              nb_views
            }
          }
        `,
        variables: {
          isPublic: project.isPublic,
          description: project.description,
          name: project.name,
        },
      })
    ).data.createProject as IProject;

    return { ...newProject, id: newProject.id.toString() };
  },

  getAll: async (): Promise<IProject[]> => {
    try {
      const projects = (
        await api.query({
          query: gql`
            query Query {
              getAllProjects {
                description
                like {
                  id
                  userId {
                    id
                  }
                }
                projectShare {
                  userId {
                    login
                    email
                    id
                  }
                  id
                  comment
                  read
                  write
                }
                id
                id_storage_number
                isPublic
                name
                nb_views
                userId {
                  id
                  login
                }
              }
            }
          `,
        })
      ).data.getAllProjects as IProject[];

      return (
        projects?.map((projects) => ({
          ...projects,
          id: projects.id.toString(),
        })) || []
      );
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getSharedWithMe: async (): Promise<IProject[]> => {
    try {
      const projects = (
        await api.query({
          query: gql`
            query getSharedWithMeProjects {
              getSharedWithMeProjects {
                description
                like {
                  id
                  userId {
                    id
                  }
                }
                projectShare {
                  userId {
                    login
                    email
                    id
                  }
                  id
                  comment
                  read
                  write
                }
                id
                id_storage_number
                isPublic
                name
                nb_views
                userId {
                  id
                  login
                }
              }
            }
          `,
        })
      ).data.getSharedWithMeProjects as IProject[];

      return (
        projects?.map((projects) => ({
          ...projects,
          id: projects.id.toString(),
        })) || []
      );
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  deleteProject: async (projectId: string): Promise<IProject> => {
    const project = (
      await api.mutate({
        mutation: gql`
          mutation Mutation($projectId: Float!) {
            deleteProject(projectId: $projectId) {
              id
            }
          }
        `,
        variables: { projectId },
      })
    ).data.deleteProject as IProject;

    return { ...project, id: project.id.toString() };
  },

  getPublic: async (): Promise<IProject[]> => {
    try {
      const projects = (
        await api.query({
          query: gql`
            query Query {
              getPublicProjects {
                id
                name
                description
                id_storage_number
                isPublic
                nb_views
                like {
                  id
                  userId {
                    id
                  }
                }
                projectShare {
                  userId {
                    login
                    email
                    id
                  }
                  id
                  read
                  comment
                  write
                }
                userId {
                  id
                  login
                }
              }
            }
          `,
        })
      ).data.getPublicProjects as IProject[];

      return (
        projects?.map((projects) => ({
          ...projects,
          id: projects.id.toString(),
        })) || []
      );
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  addView: async (rawProjectId: number | string): Promise<number> => {
    const projectId =
      typeof rawProjectId === "string" ? parseInt(rawProjectId) : rawProjectId;

    const updatedProject = (
      await api.mutate({
        mutation: gql`
          mutation Mutation($projectId: Float!) {
            addView(projectId: $projectId) {
              nb_views
            }
          }
        `,
        variables: {
          projectId,
        },
      })
    ).data.addView as IProject[];

    return updatedProject[0]?.nb_views;
  },

  addLike: async (rawProjectId: number | string): Promise<number> => {
    const projectId =
      typeof rawProjectId === "string" ? parseInt(rawProjectId) : rawProjectId;

    const updatedProject = (
      await api.mutate({
        mutation: gql`
          mutation Mutation($projectId: Float!) {
            addLike(projectId: $projectId) {
              description
              like {
                id
                userId {
                  id
                  login
                }
              }
              projectShare {
                userId {
                  login
                  email
                  id
                }
                id
                comment
                read
                write
              }
              id
              id_storage_number
              isPublic
              name
              nb_views
            }
          }
        `,
        variables: {
          projectId,
        },
      })
    ).data.addLike as IProject[];

    return updatedProject[0]?.like?.length || 0;
  },

  removeLike: async (rawProjectId: number | string): Promise<number> => {
    const projectId =
      typeof rawProjectId === "string" ? parseInt(rawProjectId) : rawProjectId;

    const updatedProject = (
      await api.mutate({
        mutation: gql`
          mutation Mutation($projectId: Float!) {
            removeLike(projectId: $projectId) {
              description
              id
              id_storage_number
              isPublic
              like {
                id
                userId {
                  id
                  login
                }
              }
              projectShare {
                userId {
                  login
                  email
                  id
                }
                id
                comment
                read
                write
              }
              name
              nb_views
            }
          }
        `,
        variables: {
          projectId,
        },
      })
    ).data.removeLike as IProject[];

    return updatedProject[0]?.like?.length || 0;
  },

  update: async (
    rawProjectId: number | string,
    project: Partial<IProject>
  ): Promise<number> => {
    const projectId =
      typeof rawProjectId === "string" ? parseInt(rawProjectId) : rawProjectId;

    const updatedProjectId = (
      await api.mutate({
        mutation: gql`
          mutation Mutation($projectId: Float!, $project: iProject!) {
            updateProject(projectId: $projectId, project: $project) {
              id
            }
          }
        `,
        variables: {
          projectId,
          project,
        },
      })
    ).data;

    return updatedProjectId;
  },

  delete: async (rawProjectId: number | string): Promise<number> => {
    const projectId =
      typeof rawProjectId === "string" ? parseInt(rawProjectId) : rawProjectId;

    const deletedProjectId = (
      await api.mutate({
        mutation: gql`
          mutation Mutation($projectId: Float!) {
            deleteProject(projectId: $projectId) {
              id
            }
          }
        `,
        variables: {
          projectId,
        },
      })
    ).data.deleteProject;

    return deletedProjectId;
  },

  downloadProject: async (projectId: number) => {
    try {
      return await apiREST().get(`/download/${projectId}`, {
        responseType: "blob",
      });
    } catch (err) {
      console.error(err);
    }
  },
};
