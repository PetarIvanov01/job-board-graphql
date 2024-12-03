import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import { getJob, getJobs, getJobsByCompany } from "./db/jobs.js";

export const resolvers = {
  Query: {
    company: async (_, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw new GraphQLError("No Company found with id " + id, {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }
      return company;
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw new GraphQLError("No Job found with id " + id, {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }
    },

    jobs: () => getJobs(),
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },

  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => job.createdAt.slice(0, "yyyy-mm-dd".length),
  },
};
