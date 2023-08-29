import express from "express";
import { startController } from "./controllers/start-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { stationController } from "./controllers/station-controller.js";
import { readingController } from "./controllers/reading-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { historyController } from "./controllers/history-controller.js";
import { weatherInfoController } from "./controllers/weatherInfo-controller.js";

export const router = express.Router();

router.get("/", startController.index);

router.get("/login", accountsController.login);
router.get("/signup", accountsController.signup);
router.get("/logout", accountsController.logout);
router.get("/account/:id", accountsController.index);
router.post("/register", accountsController.register);
router.post("/authenticate", accountsController.authenticate);
router.post("/account/:userid/updateuser", accountsController.updateUser);
router.get("/account/:userid/deleteuser", accountsController.deleteUser);

router.get("/dashboard", dashboardController.index);
router.post("/dashboard/addstation", dashboardController.addStation);
router.get("/dashboard/deletestation/:id", dashboardController.deleteStation);
router.get("/station/:id", stationController.index);
router.post("/station/:id/addreading", stationController.addReading);
router.get(
  "/station/:stationid/deletereading/:readingid",
  stationController.deleteReading
);
router.get(
  "/station/:stationid/editreading/:readingid",
  readingController.index
);

router.get("/about", aboutController.index);
router.get("/history", historyController.index);
router.get("/weatherinfo", weatherInfoController.index);
router.get("/logout", accountsController.logout);

router.post("/station/:id/addreport", stationController.addReport);
