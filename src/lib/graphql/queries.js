import { gql, GraphQLClient } from "graphql-request";
import { getAccessToken } from "../auth";

const endpoint = "http://localhost:9000/graphql";
const client = new GraphQLClient(endpoint, {
  headers: () => {
    const token = getAccessToken();
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
    return {}
  },
});

export async function getJobs() {
  const document = gql`
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

  const data = await client.request(document);
  return data.jobs;
}

export async function getJob(jobId) {
  const document = gql`
    query getJob($jobId: ID!) {
      job(id: $jobId) {
        id
        date
        title
        description
        company {
          id
          name
        }
      }
    }
  `;

  const variables = { jobId };

  const data = await client.request(document, variables);

  return data.job;
}

export async function getCompany(companyId) {
  const document = gql`
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
  const data = await client.request(document, variables);

  return data.company;
}

export async function createJob({ title, description }) {
  const document = gql`
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

  const data = await client.request(document, variables);

  return data.job;
}

export async function deleteJob({ title, description }) {
  const document = gql`
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

  const data = await client.request(document, variables);
  return data.job;
}
