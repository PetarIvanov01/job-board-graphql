import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from "./db/jobs.js";

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
      return job;
    },

    jobs: () => getJobs(),
  },

  Mutation: {
    createJob: (_, { input }) => {
      // Todo change hardcoded companyId
      const { description, title } = input;
      return createJob({
        companyId: "FjcJCHJALA4i",
        description,
        title,
      });
    },
    updateJob: (_, { input }) => {
      const { jobId, description, title } = input;
      return updateJob({ id: jobId, title, description });
    },
    deleteJob: (_, { input: { jobId } }) => deleteJob(jobId),
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },

  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => job.createdAt.slice(0, "yyyy-mm-dd".length),
  },
};
