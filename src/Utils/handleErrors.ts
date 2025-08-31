import { deleteAllData, getStoredData, storeData } from "../database";

export default async function handleErrors(errorMessage: string) {
  const errors = await getStoredData("errorList");

  const errorList = errors.errorList ? errors.errorList : [];

  /* Error list is limited at 30 records */

  if (errors.errorList?.length === 30) {
    errorList.shift();
  }

  errorList.push({ date: new Date(), message: errorMessage });

  await storeData("errorList", { errorList });
}
