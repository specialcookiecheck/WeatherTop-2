import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationAnalytics } from "../utils/station-analytics.js";
import { readingStore } from "../models/reading-store.js";
import { stationController } from "./station-controller.js";
import { userStore } from "../models/user-store.js";

export const dashboardController = {
  
  // renders the logged in user's dashboard
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    console.log("logged in user: " + loggedInUser);
    const stationList = await stationStore.getStationsByUserId(
      loggedInUser._id
    );
    await stationList.sort((a, b) => {
      let stationA = a.location.toUpperCase(); // ignore upper and lowercase
      let stationB = b.location.toUpperCase(); // ignore upper and lowercase
      if (stationA < stationB) {
        return -1; //stationA comes first
      }
      if (stationA > stationB) {
        return 1; // stationB comes first
      }
      return 0; // stations are equal
    });
    const viewData = {
      title: "Station Dashboard",
      stations: stationList,
      userId: loggedInUser._id,
    };
    console.log("dashboard rendering");
    response.render("dashboard-view", viewData);
  },
  
  // adds a station to the dashboard
  async addStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    let latitude = request.body.latitude;
    let longitude = request.body.longitude;
    const newStation = {
      location: request.body.location,
      latitude: latitude,
      longitude: longitude,
      mapSrc: await stationAnalytics.setMapSrc(latitude, longitude),
      userid: loggedInUser._id,
      lastWeather: "No valid reading entered",
    };
    console.log(`adding station ${newStation.location}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },
  
  // deletes a station from the dashboard based on the browser request
  async deleteStation(request, response) {
    const stationId = request.params.id;
    console.log(`Deleting Station ${stationId}`);
    console.log(`Delete readings from station ${stationId}`);
    await stationController.deleteAllReadingsFromStation(request, response);
    await stationStore.deleteStationById(stationId);
    console.log(`station ${stationId} deleted`);
    response.redirect("/dashboard");
  },
  
  // deletes a station based on the station ID
  async deleteStationByStationId(stationId) {
    console.log(`Deleting Station ${stationId}`);
    console.log(`Delete readings from station ${stationId}`);
    await stationController.deleteAllReadingsFromStationByStationId(stationId);
    await stationStore.deleteStationById(stationId);
    console.log(`station ${stationId} deleted`);
  },
};
