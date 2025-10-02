import { gql } from "@apollo/client";

export const CHECK_TOKENS = gql`
  query CurrentUser {
    currentUser {
      confirmedAt
      createdAt
      email
      id
      image
      name
      nickname
      provider
      uid
      updatedAt
    }
  }
`;
