require("dotenv").config();

module.exports = {
  api: {
    input: process.env.NEXT_PUBLIC_API_URL + "openapi.json",
    output: {
      mode: "tags-split",
      target: "./lib/api/api.ts",
      schemas: "./lib/api/model",
      client: "react-query",
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
    },
  },
};
