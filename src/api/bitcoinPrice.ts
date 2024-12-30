export default async function getBitcoinPrice(): Promise<number> {
  try {
    const URL: string = `https://api.coinbase.com/v2/prices/BTC-USD/buy`;
    const resp = await fetch(URL);
    const json = await resp.json();
    const {
      data: { amount },
    } = json;

    if (amount) {
      return amount;
    } else {
      throw new Error("Data not found");
    }
  } catch (error) {
    console.log("ERROR================>", error);
    return 0;
  }
}
