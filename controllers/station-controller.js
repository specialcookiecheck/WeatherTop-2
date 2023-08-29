import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
import { stationAnalytics } from "../utils/station-analytics.js";
import axios from "axios";

export const stationController = {
  
  // renders the station-view
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

  // adds a reading to a station
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
    response.redirect("/station/" + station._id);
  },
  
  // deletes a reading
  async deleteReading(request, response) {
    const stationId = request.params.stationid;
    const readingId = request.params.readingid;
    console.log(`Deleting Reading ${readingId} from Station ${stationId}`);
    await readingStore.deleteReading(readingId);
    response.redirect("/station/" + stationId);
  },
  
  // deletes all readings associated with a station based on the browser request
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
  
  // deletes all readings associated with a station based on the station ID
  async deleteAllReadingsFromStationByStationId(stationId) {
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
  
  // adds an auto-generated weather report (reading) to a station
  async addReport(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    let report = {};
    const result = await axios.get(stationAnalytics.oneCallRequest(station));
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
      console.log(report);
    }
    await readingStore.addReading(station._id, report);
    response.redirect("/station/" + station._id);
  },
};
