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
          mutation Mutation(
            $password: String!
            $login: String!
            $email: String!
          ) {
            createUser(password: $password, login: $login, email: $email) {
              id
            }
          }
        `,
        variables: {
          password: user.password,
          login: user.login,
          email: user.email,
        },
      })
    ).data.createUser as IUser;

    return { ...newUser, id: newUser.id.toString() };
  },

  getAll: async (): Promise<IUser[]> => {
    const users = (
      await api.query({
        // query à refaire lorsque le back sera OP
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
    ).data.getAllUsers as IUser<string>[];

    console.log("getAll users", users);

    return users.map((user) => ({
      ...user,
      id: user.id.toString(),
      date_start_subscription: user.date_start_subscription
        ? new Date(user.date_start_subscription)
        : undefined,
      date_end_subscription: user.date_end_subscription
        ? new Date(user.date_end_subscription)
        : undefined,
    }));
  },
};
