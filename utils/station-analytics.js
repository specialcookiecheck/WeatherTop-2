import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

let readings = stationStore.getAllStations();

let name;
let latitude;
let longitude;

let minTemp;
let maxTemp;
let minWind;
let maxWind;
let minPressure;
let maxPressure;

let tempTrend;
let windTrend;
let pressureTrend;

let mapSrc;

export const stationAnalytics = {
  /*
  getShortestTrack(station) {
    let shortestTrack = null;
    if (playlist.tracks.length > 0) {
      shortestTrack = playlist.tracks[0];
      for (let i = 1; i < playlist.tracks.length; i++) {
        if (playlist.tracks[i].duration < shortestTrack.duration) {
          shortestTrack = playlist.tracks[i];
        }
      }
    }
    return shortestTrack;
  },
  */
  
  // returns the last Reading for a Station (and creates a placeholder Reading if no Readings exist)
    getLastReading(readings) {
      console.log("Getting last reading");
        let lastReading;
        if (readings.length > 0) {
            lastReading = readings[readings.length - 1];
          console.log("Last Reading ID: " + lastReading._id); 
          console.log("Last Reading Code: " + lastReading.code);
          console.log("Last Reading Temp: " + lastReading.temperature);
          console.log("Last Reading WindSp: " + lastReading.windSpeed);
          console.log("Last Reading WindDir: " + lastReading.windDirection);
          console.log("Last Reading Press: " + lastReading.pressure);
        } else {
            //lastReading = new Reading(); // generates an empty reading to act as a placeholder
          console.log("No reading found")
        }
      console.log("Returning last reading")
        return lastReading;
    },

    // sets the min and max weather values for a Station, and clears them if all readings have been deleted
    setStationMinMax() {
        console.log("Setting StationMinMax");
        let minTemp = 0;
        let maxTemp = 0;
        let minWind = 0;
        let maxWind = 0;
        let minPressure = 0;
        let maxPressure = 0;

        if (readings.size() > 0) {
            for (let i = 0; i < readings.size(); i++) {
                console.log("Reading" + i + readings.get(i));

                console.log("Reading Temp: " + readings.get(i).temperature);
                console.log("Current minTemp: " + minTemp);
                if (minTemp > readings.get(i).temperature || minTemp == 0) {
                    minTemp = readings.get(i).temperature;
                }
                console.log("Current maxTemp: " + maxTemp);
                if (maxTemp < readings.get(i).temperature) {
                    maxTemp = readings.get(i).temperature;
                }

                console.log("Reading WindSpeed: " + readings.get(i).windSpeed);
                console.log("Current minWind: " + minWind);
                if (minWind > readings.get(i).windSpeed || minWind == 0) {
                    minWind = readings.get(i).windSpeed;
                }
                console.log("Current maxWind: " + maxWind);
                if (maxWind < readings.get(i).windSpeed) {
                    maxWind = readings.get(i).windSpeed;
                }

                console.log("Reading Pressure: " + readings.get(i).pressure);
                console.log("Current minPressure: " + minPressure);
                if (minPressure > readings.get(i).pressure || minPressure == 0) {
                    minPressure = readings.get(i).pressure;
                }
                console.log("Current maxPressure: " + maxPressure);
                if (maxPressure < readings.get(i).pressure) {
                    maxPressure = readings.get(i).pressure;
                }
            }
        }
    },

    // activates setters for all trends
    setTrends() {
        if (readings.size() > 2) {
            console.log("Setting trends");
            setTempTrend();
            setWindTrend();
            setPressureTrend();
        }
    },

    // calculates and sets the temperature trend
    setTempTrend() {
        console.log("Setting temp trend");

        let currentReading = readings.get(readings.size() - 1);
        let previousReading = readings.get(readings.size() - 2);
        let twoToLastReading = readings.get(readings.size() - 3);

        let currentTemp = currentReading.temperature;
        let previousTemp = previousReading.temperature;
        let twoToLastTemp = twoToLastReading.temperature;

        if (currentTemp > previousTemp && previousTemp > twoToLastTemp) {
            tempTrend = "Up";
        } else if (currentTemp < previousTemp && previousTemp < twoToLastTemp) {
            tempTrend = "Down";
        } else {
            tempTrend = "Neutral";
        }
    },

    // calculates and sets the wind trend
    setWindTrend() {
        console.log("Setting wind trend");

        let currentReading = readings.get(readings.size() - 1);
        let previousReading = readings.get(readings.size() - 2);
        let twoToLastReading = readings.get(readings.size() - 3);

        let currentWind = currentReading.windSpeed;
        let previousWind = previousReading.windSpeed;
        let twoToLastWind = twoToLastReading.windSpeed;

        console.log(String.valueOf(currentWind));
        console.log(String.valueOf(previousWind));
        console.log(String.valueOf(twoToLastWind));

        if (currentWind > previousWind && previousWind > twoToLastWind) {
            windTrend = "Up";
        } else if (currentWind < previousWind && previousWind < twoToLastWind) {
            windTrend = "Down";
        } else {
            windTrend = "Neutral";
        }
    },

    // calculates and sets the pressure trend
    setPressureTrend() {
        console.log("Setting pressure trend");

        let currentReading = readings.get(readings.size() - 1);
        let previousReading = readings.get(readings.size() - 2);
        let twoToLastReading = readings.get(readings.size() - 3);

        let currentPressure = currentReading.pressure;
        let previousPressure = previousReading.pressure;
        let twoToLastPressure = twoToLastReading.pressure;

        if (currentPressure > previousPressure && previousPressure > twoToLastPressure) {
            pressureTrend = "Up";
        } else if (currentPressure < previousPressure && previousPressure < twoToLastPressure) {
            pressureTrend = "Down";
        } else {
            pressureTrend = "Neutral";
        }
    },

    // returns trend icon class for temperature trend
    outputTempTrend() {
        if (readings.size() > 2) {
            if (tempTrend.equals("Up")) {
                return "fas fa-arrow-trend-up has-text-danger";
            } else if (tempTrend.equals("Down")) {
                return "fas fa-arrow-trend-down has-text-info";
            } else {
                return "fas fa-grip-lines";
            }
        } else {
            return "fas fa-grip-lines";
        }
    },

    // returns trend icon class for wind trend
    outputWindTrend() {
        if (readings.size() > 2) {
            if (windTrend.equals("Up")) {
                return "fas fa-arrow-trend-up has-text-black-bis";
            } else if (windTrend.equals("Down")) {
                return "fas fa-arrow-trend-down has-text-grey-light";
            } else {
                return "fas fa-grip-lines";
            }
        } else {
            return "fas fa-grip-lines";
        }
    },

    // returns trend icon class for pressure trend
    outputPressureTrend() {
        if (readings.size() > 2) {
            if (pressureTrend.equals("Up")) {
                return "fas fa-arrow-trend-up has-text-danger";
            } else if (pressureTrend.equals("Down")) {
                return "fas fa-arrow-trend-down has-text-info";
            } else {
                return "fas fa-grip-lines";
            }
        } else {
            return "fas fa-grip-lines";
        }
    },

    // sets the map src if none is present
    getMapSrc(latitude, longitude) {
        if (mapSrc == null) {
            mapSrc = "https://maps.google.com/maps?q=" + latitude + ", " + longitude + "&z=10" + "&output=embed";
        }
      return mapSrc;
    }
};
