import {gql} from "@apollo/client";

export interface ILoginUserResponse{
    login: {
        jwt: string
    }
}

export interface ILoginUserVariables{
    identifier: string
    password: string 
}

export const loginUserMutation = gql`
mutation userLogin($identifier: String!, $password: String!) {
  login(input: { identifier: $identifier, password: $password }) {
    jwt
  }
}
`