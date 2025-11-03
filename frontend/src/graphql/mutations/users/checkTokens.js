import { gql } from "@apollo/client";

export const CHECK_TOKENS = gql`
  query CurrentUser {
    currentUser {
      confirmedAt
      createdAt
      email
      id
      firstName
      surname
      nickname
      provider
      uid
      updatedAt
    }
  }
`;
