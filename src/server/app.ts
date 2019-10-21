import express from "express";
import "reflect-metadata";
import {createConnection} from "typeorm";
import {Area} from "./orm/Area";

// https://developer.okta.com/blog/2019/05/07/nodejs-typescript-api
const app = express();
const port = 8080 || process.env.PORT;

app.get("/availableAreas", async (req, res) => {

  const dbConnection = await createConnection();
  const areas = await dbConnection.manager.find(Area);

  res.send(areas);
});

app.get("/menus/areaId/:areaId/weekNumber/:weekNumber", (req, res) => {
  // http://localhost:8080/menus/areaName/vastraHamnen/weekNumber/201943
  const areaId = req.params['areaId'];
  const weekNumber = req.params["weekNumber"];

  res.send("NOT IMPLEMENTED");
});






app.get("/admin/initializeAndSetupDb", async (req, res) => {

  const connection = await createConnection();
  const area = new Area();

  area.Name = "Västra Hamnen";

  await connection.manager.save(area);
  const areas = await connection.manager.find(Area);

  res.send(areas);
});

app.get("/admin/performMenuFetching/all", async (req, res) => {

  res.send("NOT IMPLEMENTED");
});

app.get("/admin/performMenuFetching/areaId/:areaId", async (req, res) => {

  res.send("NOT IMPLEMENTED");
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
