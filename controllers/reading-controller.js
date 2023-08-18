import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";


export const readingController = {
  async index(request, response) {
    const stationId = request.params.stationid;
    const readingId = request.params.readingid;
    console.log(`Editing Reading ${readingId} from Station ${stationId}`);
    const viewData = {
      title: "Edit Reading",
      station: await stationStore.getStationById(stationId),
      reading: await readingStore.getReadingById(readingId),
    };
    response.render("reading-view", viewData);
  },

  async update(request, response) {
    const stationId = request.params.stationid;
    const readingId = request.params.readingid;
    const updatedReading = {
      title: request.body.title,
      artist: request.body.artist,
      duration: Number(request.body.duration),
    };
    console.log(`Updating Reading ${readingId} from Station ${stationId}`);
    await readingStore.updateReading(readingId, updatedReading);
    response.redirect("/station/" + stationId);
  },
};
