import { useMutation, useLazyQuery } from '@apollo/client';

const [loginUserMutation] = useMutation(LOGIN_USER_MUTATION)

const LOGIN_USER_MUTATION = `
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input){
      token
      errors
    }
  }
`

export const loginUser = async (email, password) => {
  const response = await loginUserMutation({
    variables: { email: email, password: password }
  });
  console.log(response);
}