import { getStoredData, storeData } from "../database";

export default async function handleErrors(errorMessage: string) {
  const errors = await getStoredData("errorList");

  const errorList = errors.errorList ? errors.errorList : [];

  errorList.push({ date: new Date(), message: errorMessage });

  await storeData("errorList", { errorList });
}
