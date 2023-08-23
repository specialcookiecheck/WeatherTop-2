import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationAnalytics } from "../utils/station-analytics.js";
import { readingStore } from "../models/reading-store.js";
import { stationController } from "./station-controller.js";
import { userStore } from "../models/user-store.js";


export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    console.log("logged in user: " + loggedInUser);
    const viewData = {
      title: "Station Dashboard",
      stations: await stationStore.getStationsByUserId(loggedInUser._id),
      userId: loggedInUser._id,
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
      mapSrc: await stationAnalytics.setMapSrc(latitude, longitude),
      userid: loggedInUser._id,
      lastWeather: "No valid reading entered",
      /*
      lastWeatherIcon: "",
      lastTemperature: "",
      minTemp:"",
      maxTemp: "",
      lastWindSpeed: "",
      minWind: "",
      maxWind: "",
      lastWindDirection: "",
      lastPressure: "",
      minPressure: "",
      maxPressure: "",
      tempTrend: "",
      windTrend: "",
      pressureTrend: "",
      fahrenheitTemp: "",
      lastBeaufortSpeed: "",
      lastWindCompass: "",
      lastWindChillIndex: "",
      lastFormattedRealFeel: "",
      tempTrendOutput: "",
      windTrendOutput: "",
      pressureTrendOutput: "",
      */
    };
    console.log(`adding station ${newStation.location}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

  async deleteStation(request, response) {
    const stationId = request.params.id;
    console.log(`Deleting Station ${stationId}`);
    console.log(`Delete readings from station ${stationId}`)
    await stationController.deleteAllReadingsFromStation(request, response);
    await stationStore.deleteStationById(stationId);
    console.log(`station ${stationId} deleted`);
    response.redirect("/dashboard");
  },
  
  async deleteStationByStationId(stationId) {
    // const stationId = request.params.id;
    console.log(`Deleting Station ${stationId}`);
    console.log(`Delete readings from station ${stationId}`)
    await stationController.deleteAllReadingsFromStationByStationId(stationId);
    await stationStore.deleteStationById(stationId);
    console.log(`station ${stationId} deleted`);
    //response.redirect("/dashboard");
  },
  
};
