import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $email: String!
    $password: String!
    $passwordConfirmation: String!
    $firstName: String!
    $surname: String!
    $image: Upload
  ) {
    registerUser(
      email: $email
      password: $password
      passwordConfirmation: $passwordConfirmation
      firstName: $firstName
      surname: $surname
      image: $image
    ) {
      errors
    }
  }
`;