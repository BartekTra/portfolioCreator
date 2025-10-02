import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import { SetContextLink } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql",
})

const authLink = new SetContextLink((_, {headers}) => {
  const accessToken = localStorage.getItem('accessToken');
  const authorization = localStorage.getItem('authorization');
  const client = localStorage.getItem('client');

  return {
    headers: {
      ...headers,
      ...(accessToken && { 'accessToken': accessToken }), // jeśli chcesz własny header
      ...(authorization && { Authorization: authorization }),
      ...(client && { 'client': client }),
    },
  };
});



const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;