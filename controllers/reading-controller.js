import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";


export const readingController = {
  
  // renders the reading-view for a station
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
};
