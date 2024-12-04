import { useState } from "react";
import JobList from "../components/JobList.js";
import { useJobs } from "../lib/graphql/hooks.js";
import PaginationBar from "../components/PaginationBar.js";

const JOBS_PER_PAGE = 5;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);

  const offset = (currentPage - 1) * JOBS_PER_PAGE;

  const { jobs, totalCount, loading, error } = useJobs(JOBS_PER_PAGE, offset);

  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);

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
      <div>
        <span> {`${currentPage} of ${totalPages}`} </span>
      </div>
      <PaginationBar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
      />
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
