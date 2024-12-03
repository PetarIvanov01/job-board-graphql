import { gql, GraphQLClient } from "graphql-request";

const endpoint = "http://localhost:9000/graphql";
const client = new GraphQLClient(endpoint);

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
