import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $password: String!, $passwordConfirmation: String!) {
    registerUser(
      email: $email, 
      password: $password, 
      passwordConfirmation: $passwordConfirmation 
    ) {
      user {
        id
        email
      }
      errors
    }
  }`