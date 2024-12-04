import { useParams } from "react-router";
import { useCompany } from "../lib/graphql/hooks";

import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();

  const { company, error, loading } = useCompany(companyId);

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
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
