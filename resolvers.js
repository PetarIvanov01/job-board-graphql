import { getCompany } from "./db/companies.js";
import { getJob, getJobs } from "./db/jobs.js";

export const resolvers = {
  Query: {
    job: (_root, args) => getJob(args.id),
    jobs: () => getJobs(),
  },

  Job: {
    company: async (job) => getCompany(job.companyId),
    date: (job) => job.createdAt.slice(0, "yyyy-mm-dd".length),
  },
};
