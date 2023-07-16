import { GetHoyabitPrice, GetMaxPrice } from "../price";
import { accSub } from "../acc";

export const Price = async () => {
  const hoyaprice = Number.parseFloat(await GetHoyabitPrice()).toFixed(3);
  const maxprice = Number.parseFloat(await GetMaxPrice()).toFixed(3);
  const diff = await accSub(maxprice,hoyaprice);
  return new Response(
    JSON.stringify(
      {
        hoyaprice: hoyaprice,
        maxprice: maxprice,
        diff: diff,
      }
    ),
    {
      status: 200,
      headers: {
        "content-type": "application/json;charset=UTF-8",
      }
    }
  );
}
