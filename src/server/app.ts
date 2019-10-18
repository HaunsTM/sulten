import express from "express";

// https://developer.okta.com/blog/2019/05/07/nodejs-typescript-api
const app = express();
const port = 8080 || process.env.PORT;

app.get("/", (req, res) => {
  res.send("His!");
});

app.get("/get", (req, res) => {
  res.send("His get");
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
