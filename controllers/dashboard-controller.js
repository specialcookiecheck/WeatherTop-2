import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationAnalytics } from "../utils/station-analytics.js";


export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const viewData = {
      title: "Station Dashboard",
      stations: await stationStore.getStationsByUserId(loggedInUser._id),
    };
    console.log("dashboard rendering");
    response.render("dashboard-view", viewData);
  },

  async addStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    let latitude = request.body.latitude;
    let longitude = request.body.longitude;
    const newStation = {
      location: request.body.location,
      latitude: latitude,
      longitude: longitude,
      mapSrc: stationAnalytics.getMapSrc(latitude, longitude),
      userid: loggedInUser._id,
    };
    console.log(`adding station ${newStation.location}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

  async deleteStation(request, response) {
    const stationId = request.params.id;
    console.log(`Deleting Station ${stationId}`);
    await stationStore.deleteStationById(stationId);
    response.redirect("/dashboard");
  },
};
