import JobList from "../components/JobList.js";
import { useJobs } from "../lib/graphql/hooks.js";

function HomePage() {
  const { jobs, loading, error } = useJobs();

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
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
