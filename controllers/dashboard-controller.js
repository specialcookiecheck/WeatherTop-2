import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationAnalytics } from "../utils/station-analytics.js";
import { readingStore } from "../models/reading-store.js";


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
      mapSrc: await stationAnalytics.setMapSrc(latitude, longitude),
      userid: loggedInUser._id,
      lastWeather: "No valid reading entered",
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
    };
    console.log(`adding station ${newStation.location}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

  async deleteStation(request, response) {
    const stationId = request.params.id;
    //readingStore.deleteAllReadingsFromStation(stationStore.getStationById(stationId));
    console.log(`Deleting Station ${stationId}`);
    await stationStore.deleteStationById(stationId);
    response.redirect("/dashboard");
  },
};
