import express from "express";
import "reflect-metadata";

// https://developer.okta.com/blog/2019/05/07/nodejs-typescript-api
const app = express();
const port = 8080 || process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hi!");
});


app.get("/get/menus/areaName/:areaName/weekNumber/:weekNumber", (req, res) => {
  // http://localhost:8080/get/menus/areaName/vastraHamnen/weekNumber/201943
  const areaName = req.params['areaName'];
  const weekNumber = req.params["weekNumber"];

  res.json({areaNames : `"${areaName}"`});
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
 