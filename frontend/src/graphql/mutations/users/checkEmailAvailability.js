import { gql } from "@apollo/client";

export const CHECK_EMAIL_AVAILABILITY = gql`
query CheckEmailAvailability($email: String!) {
    checkEmailAvailability(email: $email)
}
`;
