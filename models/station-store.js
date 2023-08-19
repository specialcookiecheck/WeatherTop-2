import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { readingStore } from "../models/reading-store.js";
import { stationController } from "../controllers/station-controller.js";
import { stationAnalytics } from "../utils/station-analytics.js";

const db = initStore("stations");

export const stationStore = {
  async getAllStations() {
    await db.read();
    return db.data.stations;
  },

  async addStation(station) {
    await db.read();
    station._id = v4();
    db.data.stations.push(station);
    await db.write();
    return station;
  },

  async getStationById(id) {
    await db.read();
    const station = await db.data.stations.find((station) => station._id === id);
    //const list = await db.data.stations.find((station) => station._id === id);
    console.log("Station ID: " + id);
    //await stationAnalytics.setReadings(id);
    station.readings = await readingStore.getReadingsByStationId(station._id);
    //list.readings = await readingStore.getReadingsByStationId(list._id);
    //return list;
    return station;
  },

  async getStationsByUserId(userid) {
    await db.read();
    return db.data.stations.filter((station) => station.userid === userid);
  },

  async deleteStationById(id) {
    await db.read();
    const index = db.data.stations.findIndex((station) => station._id === id);
    db.data.stations.splice(index, 1);
    await db.write();
  },

  async deleteAllStations() {
    db.data.stations = [];
    await db.write();
  },
  
  async updateStation(station) {
    console.log("updating station" + station);
    const stationUpdate= await stationAnalytics.updateStation(station);
    console.log("minTemp update:" + stationUpdate.minTemp);
    /*
    station.minTemp = stationUpdate.minTemp,
    station.maxTemp = stationUpdate.maxTemp,
    station.minWind = stationUpdate.minWind,
    station.maxWind = stationUpdate.maxWind,
    station.minPressure = stationUpdate.minPressure,
    station.maxPressure = stationUpdate.maxPressure,
    station.tempTrend = stationUpdate.tempTrend,
    station.windTrend = stationUpdate.windTrend,
    station.pressureTrend = stationUpdate.pressureTrend,
    */
      
    station.lastCode = stationUpdate.lastCode,
    station.lastTemperature = stationUpdate.lastTemperature,
    station.lastFahrenheitTemp = stationUpdate.lastFahrenheitTemp,
    station.lastWindSpeed = stationUpdate.lastWindSpeed,
    station.lastWindDirection = stationUpdate.lastWindDirection,
    station.lastBeaufortSpeed = stationUpdate.lastBeaufortSpeed,
    station.lastWindCompass = stationUpdate.lastWindCompass,
    station.lastWindChillIndex = stationUpdate.lastWindChillIndex,
    station.lastFormattedRealFeel = stationUpdate.lastFormattedRealFeel,
    station.lastPressure = stationUpdate.lastPressure,
    station.lastWeather = stationUpdate.lastWeather,
    station.lastWeatherIcon = stationUpdate.lastWeatherIcon,
    station.minTemp = stationUpdate.minTemp,
    station.maxTemp = stationUpdate.maxTemp,
    station.minWind = stationUpdate.minWind,
    station.maxWind = stationUpdate.maxWind,
    station.minPressure = stationUpdate.minPressure,
    station.maxPressure = stationUpdate.maxPressure,
    station.tempTrend = stationUpdate.tempTrend,
    station.windTrend = stationUpdate.windTrend,
    station.pressureTrend = stationUpdate.pressureTrend,
    station.tempTrendOutput = stationUpdate.tempTrendOutput,
    station.windTrendOutput = stationUpdate.windTrendOutput,
    station.pressureTrendOutput = stationUpdate.pressureTrendOutput,
    await db.write();
  }
};
