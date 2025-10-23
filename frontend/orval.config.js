require("dotenv").config();

module.exports = {
  api: {
    input: process.env.NEXT_PUBLIC_API_URL + "openapi.json",
    output: {
      mode: "tags-split",
      target: "./app/lib/api.ts",
      schemas: "./app/lib/model",
      client: "react-query",
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
    },
  },
};
