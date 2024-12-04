import { useMutation, useQuery } from "@apollo/client";

import {
  companyByIdQuery,
  createJobMutation,
  jobByIdQuery,
  jobsQuery,
} from "./queries";

export function useCompany(companyId) {
  const { data, error, loading } = useQuery(companyByIdQuery, {
    variables: { companyId },
  });
  return { company: data?.company, error: Boolean(error), loading };
}

export function useJob(jobId) {
  const { data, error, loading } = useQuery(jobByIdQuery, {
    variables: { jobId },
  });
  return { job: data?.job, error: Boolean(error), loading };
}

export function useJobs(limit, offset) {
  const { data, error, loading } = useQuery(jobsQuery, {
    fetchPolicy: "network-only",
    variables: {
      limit,
      offset,
    },
  });
  return {
    totalCount: data?.jobs.totalCount,
    jobs: data?.jobs.items,
    error: Boolean(error),
    loading,
  };
}

export function useCreateJob() {
  const [mutate, { loading }] = useMutation(createJobMutation);

  const createJob = async (title, description) => {
    const { data } = await mutate({
      variables: { input: { title, description } },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });

    return { job: data.job };
  };

  return {
    createJob,
    loading,
  };
}
