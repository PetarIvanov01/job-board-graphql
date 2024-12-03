import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/formatters";
import { useEffect, useState } from "react";
import { getJob } from "../lib/graphql/queries";

function JobPage() {
  const { jobId } = useParams();

  const [job, setJobs] = useState({});

  useEffect(() => {
    (async () => {
      const data = await getJob(jobId);
      console.log(data);

      setJobs(data);
    })();
  }, [jobId]);

  return (
    <div>
      <h1 className="title is-2">{job.title}</h1>
      <h2 className="subtitle is-4">
        <Link to={`/companies/${job?.company?.id}`}>{job?.company?.name}</Link>
      </h2>
      <div className="box">
        <div className="block has-text-grey">
          Posted: {job.date && formatDate(job.date, "long")}
        </div>
        <p className="block">{job.description}</p>
      </div>
    </div>
  );
}

export default JobPage;
