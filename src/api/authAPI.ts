import { api } from "./_graphQL";
import { gql } from "@apollo/client";

type GetTokenReturn = {
  token: string;
  userId: number;
};

export const authAPI = {
  getToken: async (
    email: string,
    password: string
  ): Promise<GetTokenReturn> => {
    const getTokenReturn = JSON.parse(
      (
        await api.query({
          // query à refaire lorsque le back sera OP
          query: gql`
            query Query($password: String!, $email: String!) {
              getToken(password: $password, email: $email)
            }
          `,
          variables: {
            password,
            email,
          },
        })
      ).data.getToken
    ) as GetTokenReturn;

    return getTokenReturn;
  },
};
