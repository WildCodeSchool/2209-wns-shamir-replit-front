import { api } from "./_graphQL";
import { gql } from "@apollo/client";

type GetToken = {
  token: string;
  userId: number;
};

type GetTokenReturn = {
  status: number;
  data: GetToken | undefined;
};

export const authAPI = {
  getToken: async (
    email: string,
    password: string
  ): Promise<GetTokenReturn> => {
    try {
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
      ) as GetToken;

      return {
        status: 200,
        data: getTokenReturn,
      };
    } catch (error) {
      return {
        status: 500,
        data: undefined,
      };
    }
  },
};
