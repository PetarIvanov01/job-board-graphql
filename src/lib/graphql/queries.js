import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  concat,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { getAccessToken } from "../auth";

const endpoint = "http://localhost:9000/graphql";

const httpLink = createHttpLink({ uri: endpoint });
const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken();
  if (token) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return forward(operation);
});
const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `;

  const { data } = await apolloClient.query({ query });
  return data.jobs;
}

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    description
    company {
      id
      name
    }
  }
`;

const jobByIdQuery = gql`
  query getJob($jobId: ID!) {
    job(id: $jobId) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export async function getJob(jobId) {
  const { data } = await apolloClient.query({
    query: jobByIdQuery,
    variables: { jobId },
  });
  return data.job;
}

export async function getCompany(companyId) {
  const query = gql`
    query getCompany($companyId: ID!) {
      company(id: $companyId) {
        name
        description
        jobs {
          id
          date
          title
        }
      }
    }
  `;

  const variables = { companyId };

  const { data } = await apolloClient.query({ query, variables });

  return data.company;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation createJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${jobDetailFragment}
  `;

  const variables = {
    input: {
      title,
      description,
    },
  };

  const { data } = await apolloClient.mutate({
    mutation,
    variables,
    update: (cache, { data }) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  });

  return data.job;
}

export async function deleteJob({ title, description }) {
  const mutation = gql`
    mutation createJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `;

  const variables = {
    input: {
      title,
      description,
    },
  };

  const { data } = await apolloClient.mutate({ mutation, variables });

  return data.job;
}
