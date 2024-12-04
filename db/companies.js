import DataLoader from "dataloader";
import { connection } from "./connection.js";

const getCompanyTable = () => connection.table("company");

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

export function createCompanyLoaderInstance() {
  return new DataLoader(async (ids) => {
    console.log("Company loader request", ids);
    const companies = await getCompanyTable().select().whereIn("id", ids);
    return ids.map((id) => companies.find((company) => company.id === id));
  });
}
