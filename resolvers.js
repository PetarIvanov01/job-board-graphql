import { getCompany } from "./db/companies.js";
import { getJob, getJobs, getJobsByCompany } from "./db/jobs.js";

export const resolvers = {
  Query: {
    company: (_, args) => getCompany(args.id),
    job: (_root, args) => getJob(args.id),
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
