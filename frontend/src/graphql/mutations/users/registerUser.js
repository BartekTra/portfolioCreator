import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $email: String!
    $password: String!
    $firstName: String!
    $surname: String!
  ) {
    registerUser(
      email: $email
      password: $password
      passwordConfirmation: $password
      firstName: $firstName
      surname: $surname
    ) {
      errors
    }
  }
`;