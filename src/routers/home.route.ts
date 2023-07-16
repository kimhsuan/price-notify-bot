export const Home = async () => {
  return new Response(JSON.stringify({ status: "OK" }), {
    status: 200,
    statusText: "OK",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    }
  });
}
