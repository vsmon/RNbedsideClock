export default async function getDollarPrice(): Promise<number> {
  try {
    const URL: string = `https://api.coinbase.com/v2/prices/USD-BRL/buy`;
    const resp = await fetch(URL);
    const json = await resp.json();
    const {
      data: { amount },
    } = json;

    if (amount) {
      return Promise.resolve(amount);
    } else {
      throw new Error("Data not found");
    }
  } catch (error) {
    console.log("ERROR================>", error);
    return 0;
  }
}
