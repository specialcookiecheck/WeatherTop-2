import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
import { stationAnalytics } from "../utils/station-analytics.js";

//let lastReading;
/*
let date;
let code;
let temperature;
let fahrenheitTemp;
let windSpeed;
let windDirection;
let beaufortSpeed;
let windCompass;
let windChillIndex;
let formattedRealFeel;
let pressure;
let weather;
let weatherIcon;
*/

export const stationController = {
  async index(request, response) {
    console.log("stationController index started");
    const station = await stationStore.getStationById(request.params.id);
    //const shortestTrack = stationAnalytics.getShortestTrack(station);
    console.log("Station Readings for station " + station._id + ": " + station.readings);
    console.log("Readings set: " + station.readings);
    //lastReading = await stationAnalytics.getLastReading(station);
    /*
    stationController.setLastData(lastReading);
    stationAnalytics.setTrends();
    */
    //console.log("Attempting station update");
    //await stationStore.updateStation(await stationStore.getStationById(station._id));
    console.log("Loading viewData");
    const viewData = {
      title: station.location,
      station: station,
      //lastReading: lastReading,
      /*
      weather: weather,
      weatherIcon: weatherIcon,
      fahrenheitTemp: fahrenheitTemp,
      beaufortSpeed: beaufortSpeed,
      windCompass: windCompass,
      windChillIndex: windChillIndex,
      formattedRealFeel: formattedRealFeel,
      tempTrendOutput: stationAnalytics.getTempTrendOutput(station),
      windTrendOutput: stationAnalytics.getWindTrendOutput(station),
      pressureTrendOutput: stationAnalytics.getPressureTrendOutput(station),
      stationMinMax: stationAnalytics.getStationMinMax(station),
      //shortestTrack: shortestTrack,
      */
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
    console.log(`Updating station ${stationId}`);
    await stationStore.updateStation(await stationStore.getStationById(stationId));
    response.redirect("/station/" + stationId);
  },
  
  /*
  setLastData(lastReading) {
    code = lastReading.code;
    temperature = lastReading.temperature;
    windSpeed = lastReading.windSpeed;
    windDirection = lastReading.windDirection;
    pressure = lastReading.pressure;
    stationController.setFahrenheitTemp();
    stationController.setWeather();
    stationController.setBeaufortSpeed();
    stationController.setWindCompass();
    stationController.setWindChillIndex();
    stationController.setRealFeel();
  },
  
  // sets weather condition & icon
    setWeather() {
      console.log("setting weather");
        if (code == 100) {
            weather = "Clear";
            weatherIcon = "fa fa-sun";
        } else if (code == 200) {
            weather = "Partial Clouds";
            weatherIcon = "fa fa-cloud-sun";
        } else if (code == 300) {
            weather = "Cloudy";
            weatherIcon = "fa fa-cloud";
        } else if (code == 400) {
            weather = "Light Showers";
            weatherIcon = "fa fa-cloud-sun-rain";
        } else if (code == 500) {
            weather = "Heavy Showers";
            weatherIcon = "fa fa-cloud-showers-heavy";
        } else if (code == 600) {
            weather = "Rain";
            weatherIcon = "fa fa-cloud-rain";
        } else if (code == 700) {
            weather = "Snow";
            weatherIcon = "fa fa-snowflake";
        } else if (code == 800) {
            weather = "Thunder";
            weatherIcon = "fa fa-bolt";
        } else {
            weather = "No valid reading entered";
            weatherIcon = "";
        }
    },

    // converts Celsius to Fahrenheit
    setFahrenheitTemp() {
        fahrenheitTemp = (Math.round((temperature * 9 / 5 + 32) * 100)) / 100;
    },

    // formats all data values in database to suitable String format for outputting
  /*
    getDateTimeFormatted() {
        if (date.charAt(0) == 'I') {
            let newstring = date.substring(8, date.length() - 5);
            const datetime = LocalDateTime.parse(newstring);
            newstring = datetime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            return newstring;
        } else {
            const datetime = LocalDateTime.parse(date);
            let newstring = datetime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            return newstring;
        }
    }, 

    // getter for weather condition
    getWeather(code) {
      console.log("getting weather");
      stationController.setWeather(code);
      console.log("Weather: " + weather + ", " + weatherIcon);
        return weather;
    },

    // getter for weather icons
    getWeatherIcon() {
        return weatherIcon;
    },

    // getter for Beaufort wind scale
    setBeaufortSpeed() {
        if (windSpeed < 1) {
            beaufortSpeed = "Calm: 0";
        } else if (windSpeed >= 1 && windSpeed < 6) {
            beaufortSpeed = "Light Air: 1";
        } else if (windSpeed >= 6 && windSpeed < 12) {
            beaufortSpeed = "Light Breeze: 2";
        } else if (windSpeed >= 12 && windSpeed < 20) {
            beaufortSpeed = "Gentle Breeze: 3";
        } else if (windSpeed >= 20 && windSpeed < 29) {
            beaufortSpeed = "Moderate Breeze: 4";
        } else if (windSpeed >= 29 && windSpeed < 39) {
            beaufortSpeed = "Fresh Breeze: 5";
        } else if (windSpeed >= 39 && windSpeed < 50) {
            beaufortSpeed = "Strong Breeze: 6";
        } else if (windSpeed >= 50 && windSpeed < 62) {
            beaufortSpeed = "Near Gale: 7";
        } else if (windSpeed >= 62 && windSpeed < 75) {
            beaufortSpeed = "Gale: 8";
        } else if (windSpeed >= 75 && windSpeed < 89) {
            beaufortSpeed = "Severe Gale: 9";
        } else if (windSpeed >= 89 && windSpeed < 103) {
            beaufortSpeed = "Strong Storm: 10";
        } else if (windSpeed >= 103 && windSpeed < 118) {
            beaufortSpeed = "Violent Storm: 11";
        } else {
            beaufortSpeed = "Hurricane: 12";
        }
    },

    // getter for wind compass direction
    setWindCompass() {
        if (windDirection < 0) {
            windCompass = "Invalid direction";
        } else if (windDirection < 11.25) {
            windCompass = "North";
        } else if (windDirection < 33.75) {
            windCompass = "North North East";
        } else if (windDirection < 56.25) {
            windCompass = "North East";
        } else if (windDirection < 78.75) {
            windCompass = "East North East";
        } else if (windDirection < 101.25) {
            windCompass = "East";
        } else if (windDirection < 123.75) {
            windCompass = "East South East";
        } else if (windDirection < 146.25) {
            windCompass = "South East";
        } else if (windDirection < 168.75) {
            windCompass = "South South East";
        } else if (windDirection < 191.25) {
            windCompass = "South";
        } else if (windDirection < 213.75) {
            windCompass = "South South West";
        } else if (windDirection < 236.25) {
            windCompass = "South West";
        } else if (windDirection < 258.75) {
            windCompass = "West South West";
        } else if (windDirection < 281.25) {
            windCompass = "West";
        } else if (windDirection < 303.75) {
            windCompass = "West North West";
        } else if (windDirection < 326.25) {
            windCompass = "North West";
        } else if (windDirection < 348.75) {
            windCompass = "North North West";
        } else if (windDirection <= 360) {
            windCompass = "North";
        } else {
            windCompass = "Invalid direction";
        }
    },

    // getter for windchill index
    setWindChillIndex() {
        windChillIndex = 13.12 + (0.6215 * temperature) - (11.37 * Math.pow(windSpeed, 0.16)) + (0.3965 * temperature * Math.pow(windSpeed, 0.16));
    },

    // getter for real feel
    setRealFeel() {
        formattedRealFeel = windChillIndex;
    },

    // updates the minimum and maximum values for the station (station parameter)
    updateStationMinMax(station) {
        if (station.minPressure == 0) {
            station.setStationMinMax();
        }
        if (station.minWind > windSpeed) {
            station.minWind = windSpeed;
        }
        if (station.maxWind < windSpeed) {
            station.maxWind = windSpeed;
        }
        if (station.minTemp > temperature) {
            station.minTemp = temperature;
        }
        if (station.maxTemp < temperature) {
            station.maxTemp = temperature;
        }
        if (station.minPressure > pressure) {
            station.minPressure = pressure;
        }
        if (station.maxPressure < pressure) {
            station.maxPressure = pressure;
        }
    }, */
};
