import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("readings");

export const readingStore = {
  
  // returns all readings in the database
  async getAllReadings() {
    await db.read();
    return db.data.readings;
  },

  // adds a station reading to the database
  async addReading(stationId, reading) {
    await db.read();
    reading._id = v4();
    reading.stationid = stationId;
    db.data.readings.push(reading);
    console.log("attempting to add to Database");
    await db.write();
    console.log("write to Database completed, returning reading");
    return reading;
  },

  // returns all readings associated with a station
  async getReadingsByStationId(id) {
    console.log("Getting Readings by Station ID");
    await db.read();
    console.log("Returning Readings by Station ID");
    return db.data.readings.filter((reading) => reading.stationid === id);
  },

  // returns a reading based on the reading ID
  async getReadingById(id) {
    await db.read();
    return db.data.readings.find((reading) => reading._id === id);
  },

  // deletes a reading based on the reading ID
  async deleteReading(id) {
    await db.read();
    const index = db.data.readings.findIndex((reading) => reading._id === id);
    db.data.readings.splice(index, 1);
    await db.write();
  },

  // deletes all readings in the database
  async deleteAllReadings() {
    db.data.readings = [];
    await db.write();
  },
};
