import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("readings");

export const readingStore = {
  async getAllReadings() {
    await db.read();
    return db.data.readings;
  },

  async addReading(stationId, reading) {
    await db.read();
    reading._id = v4();
    reading.stationid = stationId;
    db.data.readings.push(reading);
    console.log("attempting to add to Database")
    await db.write();
    console.log("write to Database completed, returning reading")
    return reading;
  },

  async getReadingsByStationId(id) {
    console.log("Getting Readings by Station ID");
    await db.read();
    console.log("Returning Readings by Station ID")
    return db.data.readings.filter((reading) => reading.stationid === id);
  },

  async getReadingById(id) {
    await db.read();
    return db.data.readings.find((reading) => reading._id === id);
  },

  async deleteReading(id) {
    await db.read();
    const index = db.data.readings.findIndex((reading) => reading._id === id);
    db.data.readings.splice(index, 1);
    await db.write();
  },
  
  async deleteAllReadingsFromStation(station) {
    console.log("deleting all readings associated with station " + station);
    await db.read();
    for (let i = 0; i < station.readings.length; i++) {
      if (station.id === station.readings[i]) {
        station.readings.splice(i, 1);
      }
    }
    console.log("readings deleted");
    await db.write();
  },

  async deleteAllReadings() {
    db.data.readings = [];
    await db.write();
  },

  async updateReading(readingId, updatedReading) {
    const reading = await this.getReadingById(readingId);
    reading.title = updatedReading.title;
    reading.artist = updatedReading.artist;
    reading.duration = updatedReading.duration;
    await db.write();
  },
};
