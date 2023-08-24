import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
import { stationAnalytics } from "../utils/station-analytics.js";
import axios from "axios";

const apiKey = "e644bcef67d3a0eb9e11fd75e93a3e20";

export const stationController = {
  async index(request, response) {
    console.log("stationController index started");
    const stationId = request.params.id;
    const station = await stationStore.getStationById(stationId);
    console.log(
      "Station Readings for station " + stationId + ": " + station.readings
    );
    console.log("Readings set: " + station.readings);
    await stationStore.updateStation(station);
    const updatedStation = await stationStore.getStationById(stationId);
    console.log("Loading viewData");
    const viewData = {
      title: updatedStation.location,
      station: updatedStation,
      userId: request.cookies.weathertop2,
    };
    response.render("station-view", viewData);
  },

  async addReading(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const newReading = {
      time: Date(),
      code: Number(request.body.code),
      temperature: Number(request.body.temperature),
      windSpeed: Number(request.body.windSpeed),
      windDirection: Number(request.body.windDirection),
      pressure: Number(request.body.pressure),
    };
    console.log(`adding reading with code: ${newReading.code}`);
    await readingStore.addReading(station._id, newReading);
    //await stationStore.updateStation(station);
    response.redirect("/station/" + station._id);
  },

  async deleteReading(request, response) {
    const stationId = request.params.stationid;
    const readingId = request.params.readingid;
    console.log(`Deleting Reading ${readingId} from Station ${stationId}`);
    await readingStore.deleteReading(readingId);
    //console.log(`Updating station ${stationId}`);
    //await stationStore.updateStation(await stationStore.getStationById(stationId));
    response.redirect("/station/" + stationId);
  },

  async deleteAllReadingsFromStation(request, response) {
    const stationId = request.params.id;
    console.log(`deleting all readings associated with station ${stationId}:`);
    const station = await stationStore.getStationById(stationId);
    for (let i = 0; i < station.readings.length; i++) {
      const readingId = station.readings[i]._id;
      console.log(`ReadingId: ${readingId}`);
      console.log(`deleting reading ${readingId} from station ${stationId}`);
      await readingStore.deleteReading(readingId);
      console.log(`reading ${readingId} deleted`);
    }
  },

  async deleteAllReadingsFromStationByStationId(stationId) {
    // const stationId = request.params.id;
    console.log(`deleting all readings associated with station ${stationId}:`);
    const station = await stationStore.getStationById(stationId);
    for (let i = 0; i < station.readings.length; i++) {
      const readingId = station.readings[i]._id;
      console.log(`ReadingId: ${readingId}`);
      console.log(`deleting reading ${readingId} from station ${stationId}`);
      await readingStore.deleteReading(readingId);
      console.log(`reading ${readingId} deleted`);
    }
  },

  async addReport(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    let report = {};
    const result = await axios.get(stationController.oneCallRequest(station));
    if (result.status == 200) {
      const reading = result.data.current;
      (report.time = Date()),
        (report.code = stationAnalytics.openWeatherCodeConverter(
          reading.weather[0].id
        ));
      report.temperature = Math.round(reading.temp * 2) / 2;
      report.windSpeed = Math.round(reading.wind_speed * 2) / 2;
      report.pressure = reading.pressure;
      report.windDirection = reading.wind_deg;
    }
    // console.log(`adding reading with code: ${newReading.code}`);
    await readingStore.addReading(station._id, report);
    //await stationStore.updateStation(station);
    response.redirect("/station/" + station._id);
  },

  oneCallRequest(station) {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${station.latitude}&lon=${station.longitude}&units=metric&appid=${apiKey}`;
  },
};
