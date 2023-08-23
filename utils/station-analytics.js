import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

let readings;
let lastReading;

let name;
let latitude;
let longitude;

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

let minTemp;
let maxTemp;
let minWind;
let maxWind;
let minPressure;
let maxPressure;

let tempTrend;
let windTrend;
let pressureTrend;

let tempTrendOutput;
let windTrendOutput;
let pressureTrendOutput;

let mapSrc;

export const stationAnalytics = {
  async updateStation(station) {
    console.log("station " + station + " update in progress");
    await stationAnalytics.setData(station);
    const stationUpdate = {
      lastCode: code,
      lastTemperature: temperature,
      lastFahrenheitTemp: fahrenheitTemp,
      lastWindSpeed: windSpeed,
      lastWindDirection: windDirection,
      lastBeaufortSpeed: beaufortSpeed,
      lastWindCompass: windCompass,
      lastWindChillIndex: windChillIndex,
      lastFormattedRealFeel: formattedRealFeel,
      lastPressure: pressure,
      lastWeather: weather,
      lastWeatherIcon: weatherIcon,
      minTemp: minTemp,
      maxTemp: maxTemp,
      minWind: minWind,
      maxWind: maxWind,
      minPressure: minPressure,
      maxPressure: maxPressure,
      tempTrend: tempTrend,
      windTrend: windTrend,
      pressureTrend: pressureTrend,
      tempTrendOutput: tempTrendOutput,
      windTrendOutput: windTrendOutput,
      pressureTrendOutput: pressureTrendOutput,
    };
    console.log("temperature update:" + stationUpdate.lastTemperature);
    console.log("maxTemp update:" + stationUpdate.maxTemp);
    return stationUpdate;
  },

  async setData(station) {
    //await stationAnalytics.setReadings(station);
    await stationAnalytics.setLastReading(station);
    await stationAnalytics.setLastData(lastReading);
    await stationAnalytics.setStationMinMax(station);
    await stationAnalytics.setTrends(station);
    await stationAnalytics.setTrendOutputs(station);
    console.log("Data has been set");
  },

  // returns the last Reading for a Station
  async setReadings(station) {
    console.log("Setting readings for station " + station);
    readings = await readingStore.getReadingsByStationId(station);
    console.log("Readings received: " + readings);
  },

  getCurrentReadings() {
    console.log("Returning current readings: " + readings);
    return readings;
  },

  setLastReading(station) {
    console.log("Setting last reading");
    if (station.readings.length > 0) {
      //console.log("Setting last reading");
      lastReading = station.readings[station.readings.length - 1];
      console.log("Last Reading ID: " + lastReading._id);
      console.log("Last Reading Code: " + lastReading.code);
      console.log("Last Reading Temp: " + lastReading.temperature);
      console.log("Last Reading WindSp: " + lastReading.windSpeed);
      console.log("Last Reading WindDir: " + lastReading.windDirection);
      console.log("Last Reading Press: " + lastReading.pressure);
    } else {
      // generates an empty reading to act as a placeholder
      console.log("No reading found");
      /*
      temperature = 0;
      fahrenheitTemp = 0;
      windSpeed = 0;
      windDirection = 0;
      beaufortSpeed = 0;
      windCompass = 0;
      windChillIndex = 0;
      formattedRealFeel = 0;
      pressure = 0;
      */
      lastReading = {
        code: "no valid reading entered",
        temperature: 0,
        windSpeed: 0,
        windDirection: 0,
        pressure: 0,
      }; 
    } 
  },

  getLastReading(station) {
    console.log("Getting last reading");
    stationAnalytics.setLastReading(station);
    console.log("Returning last reading");
    return lastReading;
  },

  setLastData(lastReading) {
    code = lastReading.code;
    temperature = lastReading.temperature;
    windSpeed = lastReading.windSpeed;
    windDirection = lastReading.windDirection;
    pressure = lastReading.pressure;
    stationAnalytics.setFahrenheitTemp();
    stationAnalytics.setWeather();
    stationAnalytics.setBeaufortSpeed();
    stationAnalytics.setWindCompass();
    stationAnalytics.setWindChillIndex();
    stationAnalytics.setRealFeel();
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
    fahrenheitTemp = Math.round(((temperature * 9) / 5 + 32) * 100) / 100;
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
    }, */

  // getter for weather condition
  getWeather(code) {
    console.log("getting weather");
    stationAnalytics.setWeather(code);
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
    } else if (windSpeed > 118) {
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
    } /* else {
      windCompass = "Invalid direction";
    } */
  },

  // getter for windchill index
  setWindChillIndex() {
      windChillIndex =
      13.12 +
      0.6215 * temperature -
      11.37 * Math.pow(windSpeed, 0.16) +
      0.3965 * temperature * Math.pow(windSpeed, 0.16);
  },

  // getter for real feel
  setRealFeel() {
    formattedRealFeel = Math.round(windChillIndex * 10) / 10;
  },

  /*
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
  },
  */

  // sets the min and max weather values for a Station, and clears them if all readings have been deleted
  setStationMinMax(station) {
    console.log("Setting StationMinMax");

    minTemp = void 0;
    maxTemp = void 0;
    minWind = void 0;
    maxWind = void 0;
    minPressure = void 0;
    maxPressure = void 0;

    if (station.readings.length > 0) {
      for (let i = 0; i < station.readings.length; i++) {
        console.log("Reading" + i + station.readings[i]);
        console.log("Reading Temp: " + station.readings[i].temperature);
        console.log("Current minTemp: " + minTemp);

        if (
          minTemp > station.readings[i].temperature ||
          //(minTemp === 0 && station.readings.indexOf.temperature === 0 )
          minTemp === undefined
        ) {
          minTemp = station.readings[i].temperature;
          console.log("minTemp updated");
        }
        console.log("Current maxTemp: " + maxTemp);
        if (
          maxTemp < station.readings[i].temperature ||
          maxTemp === undefined
        ) {
          maxTemp = station.readings[i].temperature;
          console.log("maxTemp updated");
        }

        console.log("Reading WindSpeed: " + station.readings[i].windSpeed);
        console.log("Current minWind: " + minWind);
        if (minWind > station.readings[i].windSpeed || minWind === undefined) {
          minWind = station.readings[i].windSpeed;
          console.log("minWind updated");
        }
        console.log("Current maxWind: " + maxWind);
        if (maxWind < station.readings[i].windSpeed || maxWind === undefined) {
          maxWind = station.readings[i].windSpeed;
          console.log("maxWind updated");
        }

        console.log("Reading Pressure: " + station.readings[i].pressure);
        console.log("Current minPressure: " + minPressure);
        if (
          minPressure > station.readings[i].pressure ||
          minPressure === undefined
        ) {
          minPressure = station.readings[i].pressure;
          console.log("minPressure updated");
        }
        console.log(
          "Current maxPressure: " + maxPressure
        );
        if (maxPressure < station.readings[i].pressure || maxPressure === undefined) {
          maxPressure = station.readings[i].pressure;
          console.log("maxPressure updated");
        }
      }
    }
    if (station.readings.length === 0) {
      minTemp = void 0;
      maxTemp = void 0;
      minWind = void 0;
      maxWind = void 0;
      minPressure = void 0;
      maxPressure = void 0;
    }
  },

  getStationMinMax(station) {
    stationAnalytics.setStationMinMax(station);
    return { minTemp, maxTemp, minWind, maxWind, minPressure, maxPressure };
  },

  // activates setters for all trends
  setTrends(station) {
    console.log("Checking for trends");
    console.log("Readings: " + station.readings.length);
    if (station.readings.length > 2) {
      console.log("Setting trends");
      stationAnalytics.setTempTrend(station);
      stationAnalytics.setWindTrend(station);
      stationAnalytics.setPressureTrend(station);
    }
  },

  // calculates and sets the temperature trend
  setTempTrend(station) {
    console.log("Setting temp trend");

    let currentReading = station.readings[station.readings.length - 1];
    let previousReading = station.readings[station.readings.length - 2];
    let twoToLastReading = station.readings[station.readings.length - 3];

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
  setWindTrend(station) {
    console.log("Setting wind trend");

    let currentReading = station.readings[station.readings.length - 1];
    let previousReading = station.readings[station.readings.length - 2];
    let twoToLastReading = station.readings[station.readings.length - 3];

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

  setTrendOutputs(station) {
    stationAnalytics.setTempTrendOutput(station);
    stationAnalytics.setWindTrendOutput(station);
    stationAnalytics.setPressureTrendOutput(station);
  },

  // calculates and sets the pressure trend
  setPressureTrend(station) {
    console.log("Setting pressure trend");

    let currentReading = station.readings[station.readings.length - 1];
    let previousReading = station.readings[station.readings.length - 2];
    let twoToLastReading = station.readings[station.readings.length - 3];

    let currentPressure = currentReading.pressure;
    let previousPressure = previousReading.pressure;
    let twoToLastPressure = twoToLastReading.pressure;

    if (
      currentPressure > previousPressure &&
      previousPressure > twoToLastPressure
    ) {
      pressureTrend = "Up";
    } else if (
      currentPressure < previousPressure &&
      previousPressure < twoToLastPressure
    ) {
      pressureTrend = "Down";
    } else {
      pressureTrend = "Neutral";
    }
  },

  // returns trend icon class for temperature trend
  setTempTrendOutput(station) {
    if (station.readings.length > 2) {
      if (tempTrend === "Up") {
        tempTrendOutput = "fas fa-arrow-trend-up has-text-danger";
      } else if (tempTrend === "Down") {
        tempTrendOutput = "fas fa-arrow-trend-down has-text-info";
      } else {
        tempTrendOutput = "fas fa-grip-lines";
      }
    } else {
      tempTrendOutput = "fas fa-grip-lines";
    }
  },

  // returns trend icon class for wind trend
  setWindTrendOutput(station) {
    if (station.readings.length > 2) {
      if (windTrend === "Up") {
        windTrendOutput = "fas fa-arrow-trend-up has-text-black-bis";
      } else if (windTrend === "Down") {
        windTrendOutput = "fas fa-arrow-trend-down has-text-grey-light";
      } else {
        windTrendOutput = "fas fa-grip-lines";
      }
    } else {
      windTrendOutput = "fas fa-grip-lines";
    }
  },

  // returns trend icon class for pressure trend
  setPressureTrendOutput(station) {
    if (station.readings.length > 2) {
      if (pressureTrend === "Up") {
        pressureTrendOutput = "fas fa-arrow-trend-up has-text-danger";
      } else if (pressureTrend === "Down") {
        pressureTrendOutput = "fas fa-arrow-trend-down has-text-info";
      } else {
        pressureTrendOutput = "fas fa-grip-lines";
      }
    } else {
      pressureTrendOutput = "fas fa-grip-lines";
    }
  },

  // sets the map src if none is present
  setMapSrc(latitude, longitude) {
    mapSrc =
      "https://maps.google.com/maps?q=" +
      latitude +
      ", " +
      longitude +
      "&z=10" +
      "&output=embed";
    return mapSrc;
  },
};
