import { api } from "./_graphQL";
import { IUser, CreateUser } from "../interfaces/IUser";
import { gql } from "@apollo/client";
// import { logMissingFieldErrors } from "@apollo/client/core/ObservableQuery";

export const userAPI = {
  create: async (user: Partial<CreateUser>): Promise<IUser> => {
    const newUser = (
      await api.mutate({
        // mutation à refaire lorsque le back sera OP
        mutation: gql`
          mutation CreateUser($data: CreateUser!) {
            createUser(data: $data) {
              id
            }
          }
        `,
        variables: {
          data: {
            email: user.email,
            login: user.login,
            password: user.password,
          },
        },
      })
    ).data.createUser as IUser;

    return { ...newUser };
  },

  getAll: async (): Promise<IUser[]> => {
    const users = (
      await api.query({
        query: gql`
          query Query {
            getAllUsers {
              id
              email
              login
              date_end_subscription
              date_start_subscription
            }
          }
        `,
      })
    ).data.getAllUsers as IUser[];

    return users;
  },
  getUserById: async (): Promise<IUser> => {
    const user = (
      await api.query({
        query: gql`
          query Query {
            getUserById {
              id
              email
              login
              date_end_subscription
              date_start_subscription
            }
          }
        `,
      })
    ).data.getUserById as IUser;

    return user;
  },
};
