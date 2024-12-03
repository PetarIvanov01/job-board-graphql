import { useParams } from "react-router";

import { useEffect, useState } from "react";
import { getCompany } from "../lib/graphql/queries";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();

  const [state, setState] = useState({
    company: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const company = await getCompany(companyId + "1");
        setState({ company, loading: false, error: null });
      } catch (error) {
        setState({ company: null, loading: true, error });
      }
    })();
  }, [companyId]);

  const { company, error, loading } = state;

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
