import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/formatters";
import { useEffect, useState } from "react";
import { getJob } from "../lib/graphql/queries";

function JobPage() {
  const { jobId } = useParams();

  const [state, setState] = useState({
    job: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const job = await getJob(jobId);
        setState({ job, loading: false, error: null });
      } catch (error) {
        setState({ company: null, loading: true, error });
      }
    })();
  }, [jobId]);

  const { job, error, loading } = state;

  if (error) {
    return (
      <div
        style={{
          color: "red",
        }}
      >
        Error occur while fetching!
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="title is-2">{job.title}</h1>
      <h2 className="subtitle is-4">
        <Link to={`/companies/${job.company.id}`}>{job?.company?.name}</Link>
      </h2>
      <div className="box">
        <div className="block has-text-grey">
          Posted: {formatDate(job.date, "long")}
        </div>
        <p className="block">{job.description}</p>
      </div>
    </div>
  );
}

export default JobPage;
