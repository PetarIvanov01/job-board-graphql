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
    createJob: (_, { input }, { user }) => {
      if (!user) {
        throw new GraphQLError("Not Authorized to create a Job");
      }
      const { description, title } = input;
      return createJob({
        companyId: user.companyId,
        description,
        title,
      });
    },
    updateJob: (_, { input }, { user }) => {
      if (!user) {
        throw new GraphQLError("Not Authorized to create a Job");
      }
      const { jobId, description, title } = input;
      const job = updateJob({ id: jobId, title, description }, user.companyId);
      if (!job) {
        throw new GraphQLError("No Job Found");
      }
      return job;
    },

    deleteJob: async (_, { input: { jobId } }, { user }) => {
      if (!user) {
        throw new GraphQLError("Not Authorized to create a Job");
      }
      const job = await deleteJob(jobId);
      if (!job) {
        throw new GraphQLError("No Job Found");
      }
      return job;
    },
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },

  Job: {
    company: (job, _, { companyLoader }) => companyLoader.load(job.companyId),
    date: (job) => job.createdAt.slice(0, "yyyy-mm-dd".length),
  },
};
