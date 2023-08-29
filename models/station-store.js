import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { readingStore } from "../models/reading-store.js";
import { stationController } from "../controllers/station-controller.js";
import { stationAnalytics } from "../utils/station-analytics.js";

const db = initStore("stations");

export const stationStore = {
  
  // returns all stations in the database
  async getAllStations() {
    await db.read();
    return db.data.stations;
  },

  // adds a station to the database
  async addStation(station) {
    await db.read();
    station._id = v4();
    db.data.stations.push(station);
    await db.write();
    return station;
  },
  
  // returns a station based on the station ID
  async getStationById(id) {
    await db.read();
    const station = await db.data.stations.find(
      (station) => station._id === id
    );
    console.log("Station ID: " + id);
    station.readings = await readingStore.getReadingsByStationId(id);
    return station;
  },
  
  // returns all stations associated with a user
  async getStationsByUserId(userid) {
    await db.read();
    return db.data.stations.filter((station) => station.userid === userid);
  },
  
  // deletes a station from the database
  async deleteStationById(id) {
    await db.read();
    const index = db.data.stations.findIndex((station) => station._id === id);
    db.data.stations.splice(index, 1);
    await db.write();
  },
  
  // deletes all stations from the database
  async deleteAllStations() {
    db.data.stations = [];
    await db.write();
  },
  
  // updates a station in the database
  async updateStation(station) {
    console.log("updating station" + station);
    const stationUpdate = await stationAnalytics.updateStation(station);
    console.log("minTemp update:" + stationUpdate.minTemp);
    (station.lastCode = stationUpdate.lastCode),
      (station.lastTemperature = stationUpdate.lastTemperature),
      (station.lastFahrenheitTemp = stationUpdate.lastFahrenheitTemp),
      (station.lastWindSpeed = stationUpdate.lastWindSpeed),
      (station.lastWindDirection = stationUpdate.lastWindDirection),
      (station.lastBeaufortSpeed = stationUpdate.lastBeaufortSpeed),
      (station.lastWindCompass = stationUpdate.lastWindCompass),
      (station.lastWindChillIndex = stationUpdate.lastWindChillIndex),
      (station.lastFormattedRealFeel = stationUpdate.lastFormattedRealFeel),
      (station.lastPressure = stationUpdate.lastPressure),
      (station.lastWeather = stationUpdate.lastWeather),
      (station.lastWeatherIcon = stationUpdate.lastWeatherIcon),
      (station.minTemp = stationUpdate.minTemp),
      (station.maxTemp = stationUpdate.maxTemp),
      (station.minWind = stationUpdate.minWind),
      (station.maxWind = stationUpdate.maxWind),
      (station.minPressure = stationUpdate.minPressure),
      (station.maxPressure = stationUpdate.maxPressure),
      (station.tempTrend = stationUpdate.tempTrend),
      (station.windTrend = stationUpdate.windTrend),
      (station.pressureTrend = stationUpdate.pressureTrend),
      (station.tempTrendOutput = stationUpdate.tempTrendOutput),
      (station.windTrendOutput = stationUpdate.windTrendOutput),
      (station.pressureTrendOutput = stationUpdate.pressureTrendOutput),
      (station.lastOpenWeatherLabelArray =
        stationUpdate.lastOpenWeatherLabelArray),
      (station.lastOpenWeatherTempTrendArray =
        stationUpdate.lastOpenWeatherTempTrendArray),
      (station.lastOpenWeatherWindTrendArray =
        stationUpdate.lastOpenWeatherWindTrendArray),
      (station.lastOpenWeatherPressureTrendArray =
        stationUpdate.lastOpenWeatherPressureTrendArray),
      await db.write();
  },
};
