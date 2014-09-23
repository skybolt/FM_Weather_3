/*jshint smarttabs:true*/
//FM FORECAST & INTEGRATED

var setPebbleToken = 'JUCP'; //    'XPGE'; 'JUCP is FM Forecast, XPGE is WU Forecast

// //mine  //settings Key  http://setpebble.com/api/8BES
//console.log("substance, setpebble token " + setPebbleToken + " for app v. 2.5.1");
//console.log("request.open( http://x.SetPebble.com/api/" + setPebbleToken + '/' + Pebble.getAccountToken());
//Pebble.addEventListener('ready', function(e) {
//});

var day1_high;
var day2_low;
var debug_flag = 0;
var m = 1;
var n = 0;
var day;
var provider_flag = 0;
if (provider_flag == 0) {
    console.log("provider: openweather.org");
}
if (provider_flag == 1) {
    console.log("provider: weatherunderground.com");
}
var offset = new Date().getTimezoneOffset() / 60;

var icon;  //= iconFromWeatherId(response.weather[0].id);
var temp;  //= tempGetter(response.main.temp) + getTempLabel();
var high;  //= tempGetter(response.main.temp_max) + getTempLabel();
//var day1_temp   = "H:";
//var day1_high   = "H:";
//var day2_temp   = "L:";
//var day2_low    = "L:";
var low;  //= tempGetter(response.main.temp_min) + getTempLabel();
var conditions;  //= response.weather[0].main;
var baro;  //= pressureGetter(response.main.pressure * 0.0295301);
var timestamp; //= response.dt - (offset * 3600);

//localStorage.removeItem("tempFlag");
var tempFlag = parseInt(localStorage.getItem("tempFlag"));
if (debug_flag > 0) {
    console.log("tempFlag found, " + tempFlag);
    console.log("tempFlag without parseInt " + localStorage.getItem("tempFlag"));
}
if (tempFlag !== 0) {
    if (!tempFlag) {
        var tempFlag = 6; //0F, 1C, 2K, 3Ra, 4Re, 5Ro, 6N, 7De
        if (debug_flag > 0) {
            console.log("tempFlag not found, set to " + tempFlag);
        }
    }
}

function billing() { }
/*

 req.open("GET", "http://www.wunderground.com/?apiref=c6aca805bd4ad9c2", true); //  Current Conditions
 req.open("GET", "http://www.wunderground.com/?apiref=e7df32ff6bb6fb0d", true); //  Hourly Forecast, today's forecast
 req.open("GET", "http://www.wunderground.com/?apiref=060d48ec505bb753", true); //  Daily Forecast
 req.open("GET", "http://www.wunderground.com/?apiref=0f727a310f1287b2", true); //  Astronomy




    var debug_flag = 1;
    if (debug_flag > 0){console.log("paying bills ...");}
    var req1 = new XMLHttpRequest();
    req1.open("GET", "http://www.wunderground.com/?apiref=e7df32ff6bb6fb0d", true);  //
    req1.onload = function(e) {
        if (req1.readyState == 4) {
            if (req1.status == 200) {
                var response = XML.parse(req1.responseText);
                console.log("req1.responseText.length = "  + req1.responseText.length);
            } else {console.log("req1 fail 200");} } else {console.log("req1 fail 4");} }; req1.send(null);

    var req2 = new XMLHttpRequest();
    req2.open("GET", "http://www.wunderground.com/?apiref=060d48ec505bb753", true);
    req2.onload = function(e) {
        if (req2.readyState == 4) {
            if (req1.status == 200) {
                var response = JSON.parse(req.responseText);
                console.log("req2.responseText.length = "  + req2.responseText.length);
            } else {console.log("req2 fail 200");} } else {console.log("req2 fail 4");} };
    var req3 = new XMLHttpRequest();
    req3.open("GET", "http://www.wunderground.com/?apiref=0f727a310f1287b2", true);
    req3.onload = function(e) {
        if (req3.readyState == 4) {
            if (req3.status == 200) {
                var response = JSON.parse(req.responseText);
                console.log("req3.responseText.length = "  + req3.responseText.length);
            } else {console.log("req3 fail 200");} } else {console.log("req3 fail 4");} };
    var req4 = new XMLHttpRequest();
    req4.open("GET", "http://www.wunderground.com/?apiref=c6aca805bd4ad9c2", true);
    req4.onload = function(e) {
        if (req4.readyState == 4) {
            if (req4.status == 200) {
                var response = JSON.parse(req.responseText);
                console.log("req4.responseText.length = "  + req4.responseText.length);
            } else {console.log("req4 fail 200");} } else {console.log("req4 fail 4");} };
} */

var pressureFlag = parseInt(localStorage.getItem("pressureFlag"));
if (debug_flag > 0) {
    console.log("pressureFlag found, " + pressureFlag);
}
if (pressureFlag !== 0 ) {
    if (!pressureFlag) {
        var pressureFlag = 0; //0 inHg, 1 mb, 2 PSI, 3 Pa, 4 Tech Atm, 5 Std Atm, 6 Torr
        if (debug_flag > 0) {
            console.log("pressureFlag not found, set to " + pressureFlag);
        }
    }
}

if (debug_flag > 0) {
    console.log("resulting tempFlag, " + tempFlag);
}

function stripper(stripped) {
    if (debug_flag > 0) {
        console.log("stripper input: " + stripped);
    }
    stripped = stripped.replace("Chance of a Thunderstorm", "chnc t-St");
    stripped = stripped.replace("moderate rain", "rain");
    stripped = stripped.replace("scattered clouds", "ptly cldy");
    stripped = stripped.replace("sky is clear", "clear");
    stripped = stripped.replace("Thunderstorm", "t-Strm");
    stripped = stripped.replace("Rain Showers", "showers");
    stripped = stripped.replace("Partly Cloudy", "ptly cldy");
    stripped = stripped.replace("Mostly Cloudy", "Mstly Cldy");
    stripped = stripped.replace("overcast", "over cast");
    stripped = stripped.replace("Overcast", "over cast");
    stripped = stripped.replace("over cast clouds", "over cast");
    stripped = stripped.replace("Chance of Rain", "chnc rain");
    stripped = stripped.replace("Rain", "rain");
    if (debug_flag > 0) {
        console.log("stripper output: " + stripped);
    }
    return stripped;
}

function tempShower(inTemp) {
    if (debug_flag > 0) {
        temp = (inTemp * (9/5)) - 459.67;
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "F" );
        }
        temp = inTemp - 273.15;
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "" );
        }
        temp = Math.round(inTemp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "K" );
            console.log("base calc unit is K");
        }
        temp = inTemp * (9/5);
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "Ra" );
        }
        temp = (inTemp - 273.15) * (4/5);
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "Ré" );
        }
        temp = ((inTemp - 273.15) * (21/40)) + 7.5;
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "Rø" );
        }
        temp = (inTemp - 273.15) * (33/100);
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "N" );
        }
        temp = (373.15 - inTemp) * (3/2);
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "De" );
        }
    } // end of if debug_flag > 1 condition
}

/*
function getTempLabel() {
    if (tempFlag === 0 ) {
        //temp = "°F";
        return "°F";
    } else if (tempFlag == 1) {
        //Celsius °C
        return "°C";
    } else if (tempFlag == 2) {
        //Kelvin K
        return "K";
    } else if (tempFlag == 3) {
        //Rankine °Ra
        return "°Ra";
    } else if (tempFlag == 4) {
        //Réaumur °Ré
        return "°Ré" ;
    } else if (tempFlag == 5) {
        //Rømer °Rø
        return "°Rø";
    } else if (tempFlag == 6) {
        //Newton °N
        return "°N";
    } else if (tempFlag == 7) {
        //Delisle °D
        return "°De";
    }
}
 */


function getTempLabel() {
    if (tempFlag === 0 ) {
        //temp = "°F";
        return "\u00B0F";
    } else if (tempFlag == 1) {
        //Celsius °C
        return "\u00B0C";
    } else if (tempFlag == 2) {
        //Kelvin K
        return "K";
    } else if (tempFlag == 3) {
        //Rankine °Ra
        return "\u00B0Ra";
    } else if (tempFlag == 4) {
        //Réaumur °Ré
        return "\u00B0Ré" ;
    } else if (tempFlag == 5) {
        //Rømer °Rø
        return "\u00B0Rø";
    } else if (tempFlag == 6) {
        //Newton °N
        return "\u00B0N";
    } else if (tempFlag == 7) {
        //Delisle °D
        return "\u00B0De";
    }
}

//inHg|mb|PSI|Pa|Technical Atmosphere|Standard Atmosphere|Torr
function getPressureLabel() {
    if (pressureFlag === 0 ) {
        // Inches of Mercury, base unit, eg 29.92
        return "Hg";
    } else if (pressureFlag == 1) {
        //Millibars
        return "mb";
    } else if (pressureFlag == 2) {
        //Pounds per square inch
        return "psi";
    } else if (pressureFlag == 3) {
        //Pascals (big number) or Megapascals (MPa), more managable numner
        return "Pa";
    } else if (pressureFlag == 4) {
        //Technical Atmosphere, at
        return "at" ;
    } else if (pressureFlag == 5) {
        //Standard Atmosphere, atm
        return "atm";
    } else if (pressureFlag == 6) {
        //Newton °N
        return "Torr";
    }
}

function pressureGetter(pressure) {
    if (pressureFlag === 0 ) {
        //inHG, base unit
        pressure = Math.round(pressure * 100);
        pressure = pressure / 100;
        return pressure;
    } else if (pressureFlag == 1) {
        //mb = inHg * 33.8637526
        pressure = pressure * 33.8637526;
        pressure = Math.round(pressure);
        return pressure;
    } else if (pressureFlag == 2) {
        //PSI = inHg / 2.0360206576
        pressure = pressure /2.0360206576;
        pressure = Math.round(pressure*100)/100;
        return pressure;
    } else if (pressureFlag == 3) {
        //Pa, pascals = inHg * 3377 or MPa, megapascals * 0.003386
        // [°R] = [K] × 9/5
        pressure = pressure * 3386.37526;
        pressure = Math.round(pressure);
        return pressure;
    } else if (pressureFlag == 4) {
        //Technical Atmosphere
        // Ta = inHg * 0.034531557667501
        // [°Ré] = ([K] − 273.15) × 4/5
        pressure = pressure * 0.034531557667501;
        pressure = Math.round(pressure*100)/100;
        return pressure;
    } else if (pressureFlag == 5) {
        //Standard Atmosphere
        //Sa = inHg * 0.0334210543544
        pressure = pressure * 0.0334210543544;
        pressure = Math.round(pressure*100);
        return pressure;
    } else if (pressureFlag == 6) {
        //Torr
        //Torr = inHg * 0.254
        pressure = pressure * 0.254;
        pressure = Math.round(pressure*100);
        return pressure;
    }
}

function tempGetter(temp) {
    if (tempFlag === 0 ) {
        //Fahrenheit °F
        //[°F] = [K] × 9/5 − 459.67
        temp = (temp * (9/5)) - 459.67;
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "F" );
        }
        return temp;
    } else if (tempFlag == 1) {
        //Celsius °C
        // [°C] = [K] − 273.15
        temp = temp - 273.15;
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "C" );
        }
        return temp;
    } else if (tempFlag == 2) {
        //Kelvin K
        // base scale
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "K" );
        }
        return temp;
    } else if (tempFlag == 3) {
        //Rankine °Ra
        // [°R] = [K] × 9/5
        temp = temp * (9/5);
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "Ra" );
        }
        return temp;
    } else if (tempFlag == 4) {
        //Réaumur °Ré
        // [°Ré] = ([K] − 273.15) × 4/5
        temp = (temp - 273.15) * (4/5);
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "Ré" );
        }
        return temp;
    } else if (tempFlag == 5) {
        //Rømer °Rø
        // [°Rø] = ([K] − 273.15) × 21/40 + 7.5
        temp = ((temp - 273.15) * (21/40)) + 7.5;
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "Rø" );
        }
        return temp;
    } else if (tempFlag == 6) {
        //Newton °N
        //[°N] = ([K] − 273.15) × 33/100
        temp = (temp - 273.15) * (33/100);
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "N" );
        }
        return temp;
    } else if (tempFlag == 7) {
        //Delisle °D
        // [°De] = (373.15 − [K]) × 3/2
        temp = (373.15 - temp) * (3/2);
        temp = Math.round(temp);
        if (debug_flag > 0) {
            console.log("temp is " + temp + "De" );
        }
        return temp;
    }
}


function fetchOpenWeatherConditions(latitude, longitude) {  //sends day0, day1 temp (high), day2 temp (low);
    //var debug_flag = 1;
    var ownName = arguments.callee.toString();
    ownName = ownName.substr('function '.length);        // trim off "function "
    ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
    if (debug_flag > 0) {
        console.log("FUNCTION NAME = " + ownName);
        console.log("http://api.openweathermap.org/data/2.5/weather?" + "lat=" + latitude + "&lon=" + longitude + "&cnt=2");
    }

    var response;
    var req = new XMLHttpRequest();
    req.open("GET", "http://api.openweathermap.org/data/2.5/weather?" + "lat=" + latitude + "&lon=" + longitude + "&cnt=2", true);
    req.onload = function(e) {
        var offset = new Date().getTimezoneOffset() / 60;
        if (req.readyState == 4) {
            if (req.status == 200) {
                response = JSON.parse(req.responseText);
                if (debug_flag > 0) {
                    console.log("FUNCTION NAME = " + ownName + ", req.responseText.length = "  + req.responseText.length);
                }
                if (req.responseText.length > 100) {
                    //var location = response.name;

                    n = 0;
                    day = 0;
                    if (debug_flag > 0) {
                        console.log("n " + n + " (array), m " + m + " (base), day = " + day);
                    }

                    icon            = iconFromWeatherId(response.weather[0].id, day);
                    temp            = tempGetter(response.main.temp) + getTempLabel();
                    conditions      = response.weather[0].main;
                    baro = pressureGetter(response.main.pressure * 0.0295301) + getPressureLabel();
                    //baro = "+-*";
                    timestamp = response.dt - (offset * 3600);



                    if (debug_flag > 0) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    if (debug_flag > 0) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    storePersistent(day, icon, temp, conditions, timestamp, baro);
                    sendDayMessages(day, icon, temp, conditions, timestamp, baro);

                    /*
                       var sunrise = response.sys.sunrise;
                    if (debug_flag > 0) {
                           console.log("raw sunrise = " + sunrise);
                       }
                       sunrise = parseInt(sunrise) - parseInt (offset * 3600);
                       if (debug_flag > 0) {
                           console.log("adj sunrise = " + sunrise);
                       }
                       var sunset = response.sys.sunset;
                    if (debug_flag > 0) {
                           console.log("raw sunset = " + sunset);
                    }
                       sunset = parseInt(sunset) - parseInt (offset * 3600);
                       if (debug_flag > 0) {
                           console.log("adgj sunset = " + sunset);
                       }
                    storePersistentAlmanac(location, sunrise, sunset);
                    MessageQueue.sendAppMessage({

                                                   location: location,
                                                   sunrise: sunrise,
                                                   sunset: sunset,
                                                   });
                       if (debug_flag > 0) {
                           console.log("location: " + location + " sunrise: " + sunrise + " sunset: " + s);
                       }
                    */
                } else {
                    console.log("fail responseText.lenght > 100 -" + ownName);
                }
            } else {
                console.log("fail 200: " + ownName);
            }
        } else {
            console.log("fail readyState == 4 " + ownName);
        }
    };
    req.send(null);
}

function fetchOpenWeatherTodayForecast(latitude, longitude) {  //sends days 1, 2
    //var debug_flag = 1;
    var ownName = arguments.callee.toString();
    ownName = ownName.substr('function '.length);        // trim off "function "
    ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
    if (debug_flag > 0) {
        console.log("FUNCTION NAME = " + ownName);
    }

    var response;
    var req = new XMLHttpRequest();
    //    http://api.openweathermap.org/data/2.5/forecast?lat=47.68969385897765&lon=-122.38351216622917&mode=xml
    req.open("GET", "http://api.openweathermap.org/data/2.5/forecast?" + "lat=" + latitude + "&lon=" + longitude + "&cnt=2", true);
    req.onload = function(e) {
        var offset = new Date().getTimezoneOffset() / 60;
        if (req.readyState == 4) {
            if (req.status == 200) {
                response = JSON.parse(req.responseText);
                if (debug_flag > 0) {
                    console.log("FUNCTION NAME = " + ownName + ", req.responseText.length = "  + req.responseText.length);
                }


                if (req.responseText.length > 100) {
                    if (debug_flag > 0) {
                        console.log(response.city.name);
                        console.log(response.list[0].dt_txt);
                        console.log(response.list[0].weather[0].description);
                    }

                    /* if (debug_flag > 0) {

                         for (var i = 0; i < 25; i++) {
                             //text += cars[i];
                             console.log("forecast description : " + response.list[i].weather[0].description);
                         }

                     }
                    */
                    var n = 2;
                    day = 1;
                    if (debug_flag > 0) {
                        console.log("n " + n + " (array), m " + m + " (base), day = " + day);
                    }
                    icon = iconFromWeatherId(response.list[n].weather[0].id, day);
                    //temp = "oH: " + tempGetter(response.list[0].main.temp) + getTempLabel();
                    if (!day1_high) {
                        temp = "";
                    } else {
                        temp = "H: " + day1_high;
                    }
                    timestamp = response.list[n].dt;
                    timestamp = parseInt(timestamp) - parseInt (offset * 3600);
                    //conditions = stripper(response.list[n].weather[0].description);
                    conditions = response.list[n].weather[0].description;

                    if (debug_flag > 0) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    storePersistent(day, icon, temp, conditions, timestamp, baro);
                    sendDayMessages(day, icon, temp, conditions, timestamp, baro);

                    n = 5;
                    day = 2;
                    if (debug_flag > 0) {
                        console.log("n " + n + " (array), m " + m + " (base), day = " + day);
                    }
                    icon = iconFromWeatherId(response.list[n].weather[0].id, day);
                    //temp = "oL: " + tempGetter(response.list[0].main.temp) + getTempLabel();
                    temp = "L: " + day2_low;
                    timestamp = response.list[n].dt;
                    timestamp = parseInt(timestamp) - parseInt (offset * 3600);
                    //conditions = stripper(response.list[n].weather[0].description);
                    conditions = response.list[n].weather[0].description;


                    if (debug_flag > 0) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    storePersistent(day, icon, temp, conditions, timestamp, baro);
                    sendDayMessages(day, icon, temp, conditions, timestamp, baro);

                } else {
                    console.log("fail responseText.lenght > 100 -" + ownName);
                }
            } else {
                console.log("fail 200: " + ownName);
            }
        } else {
            console.log("fail readyState == 4 " + ownName);
        }
    };
    req.send(null);
}

function fetchOpenWeather3DayForecast(latitude, longitude) {       // sends days 3, 4, 5
    //var debug_flag = 1;
    var ownName = arguments.callee.toString();
    ownName = ownName.substr('function '.length);        // trim off "function "
    ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
    if (debug_flag > 0) {
        console.log("FUNCTION NAME = " + ownName);
    }

    var req = new XMLHttpRequest();
    req.open("GET", "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + latitude + "&lon=" + longitude + "&cnt=10&APPID=9f001a597927140d919cc512193dadd2", true);
    if (debug_flag > 0) {
        console.log("http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + latitude + "&lon=" + longitude + "&cnt=10&APPID=9f001a597927140d919cc512193dadd2");
    }
    req.onload = function(e) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                var response = JSON.parse(req.responseText);
                if (debug_flag > 0) {
                    console.log("FUNCTION NAME = " + ownName + ", req.responseText.length = "  + req.responseText.length);
                }


                if (req.responseText.length > 100) {

                    day1_high = tempGetter(response.list[0].temp.max) + getTempLabel();
                    day2_low = tempGetter(response.list[0].temp.min) + getTempLabel();

                    n = m + 0;
                    day = 3;
                    if (debug_flag > 0) {
                        console.log("n " + n + " (array), m " + m + " (base), day = " + day);
                    }
                    icon = iconFromWeatherId(response.list[n].weather[0].id, day);
                    high	= tempGetter(response.list[n].temp.max);
                    low = tempGetter(response.list[n].temp.min);

                    temp = high + "/\n" + low + getTempLabel();
                    conditions = stripper(response.list[n].weather[0].description);
                    timestamp = parseInt(response.list[n].dt);


                    if (debug_flag > 0) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    storePersistent(day, icon, temp, conditions, timestamp, baro);
                    sendDayMessages(day, icon, temp, conditions, timestamp, baro);

                    n = m + 1;
                    day = 4;
                    if (debug_flag > 0) {
                        console.log("n " + n + " (array), m " + m + " (base), day = " + day);
                    }
                    icon = iconFromWeatherId(response.list[n].weather[0].id, day);
                    high	= tempGetter(response.list[n].temp.max);
                    low = tempGetter(response.list[n].temp.min);
                    temp = high + "/\n" + low + getTempLabel();
                    conditions = stripper(response.list[n].weather[0].description);
                    timestamp = parseInt(response.list[n].dt);


                    if (debug_flag > 0) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    storePersistent(day, icon, temp, conditions, timestamp, baro);
                    sendDayMessages(day, icon, temp, conditions, timestamp, baro);


                    n = m + 2;
                    day = 5;

                    if (debug_flag > 0) {
                        console.log("n " + n + " (array), m " + m + " (base), day = " + day);
                    }
                    icon = iconFromWeatherId(response.list[n].weather[0].id, day);
                    high	= tempGetter(response.list[n].temp.max);
                    low = tempGetter(response.list[n].temp.min);
                    temp = high + "/\n" + low + getTempLabel();
                    conditions = stripper(response.list[n].weather[0].description);
                    timestamp = parseInt(response.list[n].dt);

                    if (debug_flag > 0) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    storePersistent(day, icon, temp, conditions, timestamp, baro);
                    sendDayMessages(day, icon, temp, conditions, timestamp, baro);

                } else {
                    console.log("fail responseText.lenght > 100 -" + ownName);
                }
            } else {
                console.log("fail 200: " + ownName);
            }
        } else {
            console.log("fail readyState == 4 " + ownName);
        }
    };
    req.send(null);
}


/*NEXT SECTION IS FOR WEATHER UNDERGROUND*/

function fetchWeatherUndergroundConditions(latitude, longitude) { // gets day 0
    //var debug_flag = 1;
    var ownName = arguments.callee.toString();
    ownName = ownName.substr('function '.length);        // trim off "function "
    ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
    if (debug_flag > 0) {
        console.log("FUNCTION NAME = " + ownName);
    }

    var tt = new Date();
    if (debug_flag > 0) {
        console.log("new Date =" + tt);
    }
    var key = "25604a92d894df0e";
    var req = new XMLHttpRequest();
    req.open("GET", "http://api.wunderground.com/api/" + key + "/conditions/geolookup/q/" + latitude + "," + longitude + ".json?apiref=c6aca805bd4ad9c2", true);
    if (debug_flag > 0) {
        console.log("Weather Underground app key request!! " + key);
        console.log("http://api.wunderground.com/api/" + key + "/conditions/geolookup/q/" + latitude + "," + longitude + ".json?apiref=c6aca805bd4ad9c2");

    }

    req.onload = function(e) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                var response = JSON.parse(req.responseText);
                if (debug_flag > 0) {
                    console.log("FUNCTION NAME = " + ownName + ", req.responseText.length = "  + req.responseText.length);
                }


                if (req.responseText.length > 100) {

                    day = 0;

                    if (debug_flag > 0) {
                        console.log("n " + n + " (array), m " + m + " (base), day = " + day);
                    }
                    icon = iconFromWeatherString(response.current_observation.icon);
                    temp = tempGetter(response.current_observation.temp_c + 273.15) + getTempLabel();
                    conditions = response.current_observation.weather.replace(" ", "\n");
                    timestamp = parseInt(response.current_observation.local_epoch) - (offset * 3600);
                    baro = pressureGetter(response.current_observation.pressure_in) + getPressureLabel() + response.current_observation.pressure_trend.replace("0", "*").replace("-", "-");

                    if (debug_flag > 0) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    storePersistent(day, icon, temp, conditions, timestamp, baro);
                    sendDayMessages(day, icon, temp, conditions, timestamp, baro);

                } else {
                    console.log("fail responseText.lenght > 100 -" + ownName);
                }
            } else {
                console.log("fail 200: " + ownName);
            }
        } else {
            console.log("fail readyState == 4 " + ownName);
        }
    };
    req.send(null);
}

function fetchWeatherUndergroundHourlyForecast(latitude, longitude) { // gets day 1, 2
    //var debug_flag = 1;
    var ownName = arguments.callee.toString();
    ownName = ownName.substr('function '.length);        // trim off "function "
    ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
    if (debug_flag > 0) {
        console.log("FUNCTION NAME = " + ownName);
    }

    var response;
    var key = "d33637904b0a944c";
    var req = new XMLHttpRequest();
    req.open("GET", "http://api.wunderground.com/api/" + key + "/hourly/geolookup/q/" + latitude + "," + longitude + ".json?apiref=e7df32ff6bb6fb0d", true);
    if (debug_flag > 0) {
        console.log("Weather Underground app key request!! " + key);
        console.log("http://api.wunderground.com/api/" + key + "/hourly/geolookup/q/" + latitude + "," + longitude + ".json?apiref=e7df32ff6bb6fb0d");
    }
    req.onload = function(e) {
        var offset = new Date().getTimezoneOffset() / 60;
        if (req.readyState == 4) {
            if (req.status == 200) {
                response = JSON.parse(req.responseText);
                if (debug_flag > 0) {
                    console.log("FUNCTION NAME = " + ownName + ", req.responseText.length = "  + req.responseText.length);
                }


                if (req.responseText.length > 100) {
                    if (debug_flag > 0) {
                        console.log("");
                        console.log("");
                        console.log("");
                    }

                    /*                    if (debug_flag > 0) {
                                            for (var i = 0; i < 7; i++) {
                                                //text += cars[i];
                                                console.log("forecast description[" + i + "]: " + stripper(response.list[i].weather[0].description));
                                            }

                                    }
                    */
                    n = 1;
                    day = 1;
                    if (debug_flag > 0) {
                        console.log("n " + n + " (array), m " + m + " (base), day = " + day);
                    }
                    icon = iconFromWeatherString(response.hourly_forecast[n].icon);
                    temp = "H: " + day1_high;
                    timestamp = response.hourly_forecast[n].FCTTIME.epoch;
                    conditions = response.hourly_forecast[n].wx;
                    if (debug_flag > 0) {
                        console.log("raw timestamp: " + timestamp);
                    }
                    timestamp = parseInt(timestamp) - parseInt (offset * 3600);
                    if (debug_flag > 0) {
                        console.log("parseInt timestamp: " + timestamp);
                    }
                    if (debug_flag > 0) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    storePersistent(day, icon, temp, conditions, timestamp, baro);
                    sendDayMessages(day, icon, temp, conditions, timestamp, baro);

                    n = 15;
                    day = 2;
                    if (debug_flag > 0) {
                        console.log("n " + n + " (array), m " + m + " (base), day = " + day);
                    }
                    icon = iconFromWeatherString(response.hourly_forecast[n].icon);
                    temp = "L: " + day2_low;
                    //temp = response.hourly_forecast[n].temp.metric;
                    timestamp = response.hourly_forecast[n].FCTTIME.epoch;
                    conditions = response.hourly_forecast[n].wx;
                    if (debug_flag > 0) {
                        console.log("raw timestamp: " + timestamp);
                    }
                    timestamp = parseInt(timestamp) - parseInt (offset * 3600);
                    if (debug_flag > 0) {
                        console.log("parseInt timestamp: " + timestamp);
                    }

                    if (debug_flag > 0) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    storePersistent(day, icon, temp, conditions, timestamp, baro);
                    sendDayMessages(day, icon, temp, conditions, timestamp, baro);

                } else {
                    console.log("fail responseText.lenght > 100 -" + ownName);
                }
            } else {
                console.log("fail 200: " + ownName);
            }
        } else {
            console.log("fail readyState == 4 " + ownName);
        }
    };
    req.send(null);

}

function fetchWeatherUnderground3DayForecast(latitude, longitude) { // gets day 3, 4, 5
    //var debug_flag = 1;
    var ownName = arguments.callee.toString();
    ownName = ownName.substr('function '.length);        // trim off "function "
    ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
    if (debug_flag > 0) {
        console.log("FUNCTION NAME = " + ownName);
    }

    var response;
    var key = "6fe6c99a5d7df975";
    var req = new XMLHttpRequest();
    req.open("GET", "http://api.wunderground.com/api/" + key + "/forecast/geolookup/q/" + latitude + "," + longitude + ".json?apiref=060d48ec505bb753", true);
    if (debug_flag > 0) {
        console.log("Weather Underground app key request!! " + key);
        console.log("http://api.wunderground.com/api/" + key + "/forecast/geolookup/q/" + latitude + "," + longitude + ".json?apiref=060d48ec505bb753");

    }
    req.onload = function(e) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                response = JSON.parse(req.responseText);
                if (debug_flag > 0) {
                    console.log("FUNCTION NAME = " + ownName + ", req.responseText.length = "  + req.responseText.length);
                }


                if (req.responseText.length > 100) {

                    day1_high = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[0].high.celsius) + 273.15) + getTempLabel();

                    day2_low = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[0].low.celsius) + 273.15) + getTempLabel();

                    n = m -1 ;// array is day and night, in text rollup odd numbers night (contain low in temp), days (even numbers) contain high
                    day = 3;
                    if (debug_flag > 0) {
                        console.log("n " + n + " (array), m " + m + " (base), day = " + day);
                    }
                    icon = iconFromWeatherString(response.forecast.simpleforecast.forecastday[n].icon);
                    timestamp = parseInt(response.forecast.simpleforecast.forecastday[n].date.epoch);
                    conditions = stripper(response.forecast.simpleforecast.forecastday[n].conditions);
                    high = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[n].high.celsius) + 273.15);
                    low = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[n].low.celsius) + 273.15);
                    temp = high + "/\n" + low + getTempLabel();

                    if (debug_flag > 0) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    storePersistent(day, icon, temp, conditions, timestamp, baro);
                    sendDayMessages(day, icon, temp, conditions, timestamp, baro);

                    n = m;
                    day = 4;
                    if (debug_flag > 0) {
                        console.log("n " + n + " (array), m " + m + " (base), day = " + day);
                    }
                    icon = iconFromWeatherString(response.forecast.simpleforecast.forecastday[n].icon);
                    timestamp = parseInt(response.forecast.simpleforecast.forecastday[n].date.epoch);
                    conditions = stripper(response.forecast.simpleforecast.forecastday[n].conditions);
                    high = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[n].high.celsius) + 273.15);
                    low = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[n].low.celsius) + 273.15);
                    temp = high + "/\n" + low + getTempLabel();

                    if (debug_flag > 0) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    storePersistent(day, icon, temp, conditions, timestamp, baro);
                    sendDayMessages(day, icon, temp, conditions, timestamp, baro);

                    n = m + 1;
                    day = 5;
                    if (debug_flag > 0) {
                        console.log("n " + n + " (array), m " + m + " (base), day = " + day);
                    }
                    icon = iconFromWeatherString(response.forecast.simpleforecast.forecastday[n].icon);
                    timestamp = parseInt(response.forecast.simpleforecast.forecastday[n].date.epoch);
                    conditions = stripper(response.forecast.simpleforecast.forecastday[n].conditions);
                    high = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[n].high.celsius) + 273.15);
                    low = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[n].low.celsius) + 273.15);
                    temp = high + "/\n" + low + getTempLabel();

                    if (debug_flag > 0) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    storePersistent(day, icon, temp, conditions, timestamp, baro);
                    sendDayMessages(day, icon, temp, conditions, timestamp, baro);

                } else {
                    console.log("fail responseText.lenght > 100 -" + ownName);
                }
            } else {
                console.log("fail 200: " + ownName);
            }
        } else {
            console.log("fail readyState == 4 " + ownName);
        }
    };
    req.send(null);
}

function fetchOpenWeatherSunriseSunset(latitude, longitude) {
    //var debug_flag = 1;
    var ownName = arguments.callee.toString();
    ownName = ownName.substr('function '.length);        // trim off "function "
    ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
    if (debug_flag > 0) {
        console.log("FUNCTION NAME = " + ownName);
    }
    var response;
    var req = new XMLHttpRequest();
    req.open("GET", "http://api.openweathermap.org/data/2.5/weather?" + "lat=" + latitude + "&lon=" + longitude + "&cnt=2", true);
    if (debug_flag > 0) {
        console.log("http://api.openweathermap.org/data/2.5/weather?" + "lat=" + latitude + "&lon=" + longitude + "&cnt=2");
    }
    req.onload = function(e) {
        var offset = new Date().getTimezoneOffset() / 60;
        if (req.readyState == 4) {
            if (req.status == 200) {
                response = JSON.parse(req.responseText);
                if (debug_flag > 0) {
                    console.log("FUNCTION NAME = " + ownName + ", req.responseText.length = "  + req.responseText.length);
                }


                if (req.responseText.length > 100) {
                    var location = response.name;
                    //location = "Portlandia";

                    var sunrise = response.sys.sunrise;
                    if (debug_flag > 0) {
                        console.log("raw sunrise = " + sunrise);
                    }
                    sunrise = parseInt(sunrise) - parseInt (offset * 3600);
                    if (debug_flag > 0) {
                        console.log("adj sunrise = " + sunrise);
                    }
                    var sunset = response.sys.sunset;
                    if (debug_flag > 0) {
                        console.log("raw sunset = " + sunset);
                    }
                    sunset = parseInt(sunset) - parseInt (offset * 3600);
                    if (debug_flag > 0) {
                        console.log("adgj sunset = " + sunset);
                    }


                    storePersistentAlmanac(location, sunrise, sunset);
                    MessageQueue.sendAppMessage({
location: location,
sunrise: sunrise,
sunset: sunset,
                    });
//				 readPersistentAlmanac();
                } else {
                    console.log("fail responseText.lenght > 100 -" + ownName);
                }
            } else {
                console.log("fail 200: " + ownName);
            }
        } else {
            console.log("fail readyState == 4 " + ownName);
        }
    };
    req.send(null);

}
/*
function sendDayMessages(day) {
	var k0 = (day + 1) * 10;
	var k1 = k0 + 1;
	var k2 = k1 + 1;
	var k3 = k2 + 1;
	var k4 = k3 + 1;

	       console.log("day" + day + "_icon " + k0 + ":" + icon);
            console.log("day" + day + "_temp: " +  k1 + ":" + temp);
            console.log("day" + day + "_conditions: " +  k2 + ":" + conditions);
            console.log("day" + day + "_timestamp: " +  k3 + ":" + timestamp);
            console.log("day" + day + "_baro: " +  k4 + ":" + baro);

	        MessageQueue.sendAppMessage({
                                    k0: icon,
                                    k1: temp,
                                    k2: conditions,
                                    k3: timestamp,
                                    k4: baro,
                                    });

    }

*/

function storePersistent(day, icon, temp, conditions, timestamp, baro) {
    //var debug_flag = 1;
    localStorage.setItem(day + "icon", icon);
    localStorage.setItem(day + "temp", temp);
    localStorage.setItem(day + "conditions", conditions);
    localStorage.setItem(day + "timestamp", timestamp);
    localStorage.setItem(day + "baro", baro);
    if (debug_flag > 0) {
        console.log('WRITING PERSISTENT STORAGE DAY' + day + " icon " + icon + " temp " + temp + " conditions " + conditions + " timestamp " + timestamp + " baro " + baro);
        console.log("verify storePersistent");
        showPersistent(day);
    }
}

function showPersistent(day) {
    if (debug_flag > 0) {
        console.log("CHECKING PERSISTENT STORAGE - day = " + day);
        console.log(day + "icon: " + localStorage.getItem(day + "icon"));
        console.log(day + "temp: " + localStorage.getItem(day + "temp"));
        console.log(day + "conditions: " + localStorage.getItem(day + "conditions"));
        console.log(day + "timestamp: " + localStorage.getItem(day + "timestamp"));
        console.log(day + "baro: " + localStorage.getItem(day + "baro"));
    }
}

function readPersistent(day) {

    showPersistent(day);
    if (debug_flag > 0) {
        console.log("reading persistent storage requested");
        console.log("icon: " + localStorage.getItem(day + "icon"));
        console.log("temp: " + localStorage.getItem(day + "temp"));
        console.log("conditions: " + localStorage.getItem(day + "conditions"));
        console.log("timestamp: " + localStorage.getItem(day + "timestamp"));
        console.log("baro: " + localStorage.getItem(day + "baro"));
        console.log("setting variables based on stored values" );
    }
    icon = parseInt(localStorage.getItem(day + "icon"));
    temp = localStorage.getItem(day + "temp");
    conditions = localStorage.getItem(day + "conditions");
    timestamp = parseInt(localStorage.getItem(day + "timestamp"));
    baro = localStorage.getItem(day + "baro");
    if (debug_flag > 0) {
        console.log("read persistent storage end day "  + day + " icon " + icon + " temp " + temp + " conditions " + conditions + " timestamp " + timestamp + " baro " + baro);
    }

    sendDayMessages(day, icon, temp, conditions, timestamp, baro);

}

function storePersistentAlmanac(location, sunrise, sunset) {
    if (debug_flag > 0) {
        console.log("storing persistent data: location " + location + " sunrise " + sunrise + " sunset " + sunset);
    }
    localStorage.setItem("location", location);
    localStorage.setItem("sunrise", sunrise);
    localStorage.setItem("sunset", sunset);


}

function readPersistentAlmanac() {
    var location = localStorage.getItem("location");
    var sunrise = parseInt(localStorage.getItem("sunrise"));
    var sunset = parseInt(localStorage.getItem("sunset"));
    if (debug_flag > 0) {
        console.log("   check integers: location: " + location + " sunrise: " + parseInt(localStorage.getItem("sunrise")) + " sunset: " + parseInt(localStorage.getItem("sunset")));
        console.log(" check raw values: location: " + location + " sunrise: " + localStorage.getItem("sunrise") + " sunset: " + localStorage.getItem("sunset"));
        console.log("read from storage: location: " + location + " sunrise: " + sunrise + " sunset: " + sunset);
    }
    MessageQueue.sendAppMessage({
location: location,
sunrise: sunrise,
sunset: sunset,
    });
}



function sendDayMessages(day, icon, temp, conditions, timestamp, baro) {
    if (debug_flag > 0) {
        //console.log("sending day = " + day);
        showPersistent(day);
    }
    n = 0;
    var k0 = (day + 1) * 10;
    var k1 = k0 + 1;
    var k2 = k0 + 2;
    var k3 = k0 + 3;
    var k4 = k0 + 4;

//	storePersistent(day, icon, temp, conditions, timestamp, baro);
//	showPersistent(day);
//	readPersistent(day);

    if (day === 0) {
        if (debug_flag > 0) {
            console.log("send dayMessage" + day);
            console.log("day0_icon " + k0 + ":" + icon);
            console.log("day0_temp: " +  k1 + ":" + temp);
            console.log("day0_conditions: " +  k2 + ":" + conditions);
            console.log("day0_timestamp: " +  k3 + ":" + timestamp);
            console.log("day0_baro: " +  k4 + ":" + baro);
        }
        MessageQueue.sendAppMessage({
10: icon,
11: temp,
12: conditions,
13: timestamp,
14: baro,
        });

    }

    /*    if (day === 0) {
            var debug_flag = 1;
            if (debug_flag > 0) {
                console.log("send dayMessage" + day);
                console.log("day0_icon " + k0 + ":" + icon);
                console.log("day0_temp: " +  k1 + ":" + temp);
                console.log("day0_conditions: " +  k2 + ":" + conditions);
                console.log("day0_timestamp: " +  k3 + ":" + timestamp);
                console.log("day0_baro: " +  k4 + ":" + baro);
            }
            MessageQueue.sendAppMessage({
                    (k0 * 1): icon,
                    (k1 * 1): temp,
                    (k2 * 1): conditions,
                    (k3 * 1): timestamp,
                    (k4 * 1): baro,
                });

        }  */

    else if (day == 1) {
        if (debug_flag > 0) {
            console.log("send dayMessage" + day);
            console.log("day1_icon " + k0 + ":" + icon);
            console.log("day1_temp: " +  k1 + ":" + temp);
            console.log("day1_conditions: " +  k2 + ":" + conditions);
            console.log("day1_timestamp: " +  k3 + ":" + timestamp);
        }
        MessageQueue.sendAppMessage({
day1_icon: icon,
day1_temp: temp + "",
day1_conditions: conditions,
day1_timestamp: timestamp,
        });

    }

    else if (day == 2) {
        //var debug_Flag = 1;
        if (debug_flag > 0) {
            console.log("send dayMessage" + day);
            console.log("k0 = " + k0);
            console.log("day2_icon " + k0 + ":" + icon);
            console.log("day2_temp: " +  k1 + ":" + temp);
            console.log("day2_conditions: " +  k2 + ":" + conditions);
            console.log("day2_timestamp: " +  k3 + ":" + timestamp);

        }
        //debug_flag = 0;
        MessageQueue.sendAppMessage({
day2_icon: icon,
day2_temp: temp + "",
day2_conditions: conditions,
day2_timestamp: timestamp,
        });

    }

    else if (day == 3) {
        if (debug_flag > 0) {
            console.log("send dayMessage" + day);
            console.log("day3_icon " + k0 + ":" + icon);
            console.log("day3_temp: " +  k1 + ":" + temp);
            console.log("day3_conditions: " +  k2 + ":" + conditions);
            console.log("day3_timestamp: " +  k3 + ":" + timestamp);
        }
        MessageQueue.sendAppMessage({
day3_icon: icon,
day3_temp: temp + "",
day3_conditions: conditions,
day3_timestamp: timestamp,
        });

    }

    else if (day == 4) {
        if (debug_flag > 0) {
            console.log("send dayMessage" + day);
            console.log("day4_icon " + k0 + ":" + icon);
            console.log("day4_temp: " +  k1 + ":" + temp);
            console.log("day4_conditions: " +  k2 + ":" + conditions);
            console.log("day4_timestamp: " +  k3 + ":" + timestamp);
        }
        MessageQueue.sendAppMessage({
day4_icon: icon,
day4_temp: temp + "",
day4_conditions: conditions,
day4_timestamp: timestamp,
        });

    }

    else if (day == 5) {
        if (debug_flag > 0) {
            console.log("send dayMessage" + day);
            console.log("day5_icon " + k0 + ":" + icon);
            console.log("day5_temp: " +  k1 + ":" + temp);
            console.log("day5_conditions: " +  k2 + ":" + conditions);
            console.log("day5_timestamp: " +  k3 + ":" + timestamp);
        }
        MessageQueue.sendAppMessage({
day5_icon: icon,
day5_temp: temp + "",
day5_conditions: conditions,
day5_timestamp: timestamp,
        });

    }
}



function locationSuccess(pos) {
    var coordinates = pos.coords;
    if (debug_flag > 0) {
        console.log("locationSuccess, " + coordinates.latitude + ", " + coordinates.longitude);
    }
    //var latitude = 41.852014;
    //var longitude = 12.577281;
    //fetchWeather(latitude, longitude);
    if (provider_flag === 0) {
        fetchOpenWeatherConditions(coordinates.latitude, coordinates.longitude);
        fetchOpenWeather3DayForecast(coordinates.latitude, coordinates.longitude);
        fetchOpenWeatherTodayForecast(coordinates.latitude, coordinates.longitude);
        fetchOpenWeatherSunriseSunset(coordinates.latitude, coordinates.longitude);
    }

    else if (provider_flag == 1) {
        fetchWeatherUndergroundConditions(coordinates.latitude, coordinates.longitude);
        fetchWeatherUnderground3DayForecast(coordinates.latitude, coordinates.longitude);
        fetchWeatherUndergroundHourlyForecast(coordinates.latitude, coordinates.longitude);
        fetchOpenWeatherSunriseSunset(coordinates.latitude, coordinates.longitude);
        //billing();
    }

}

function locationError(err) {
    console.warn("location lookup error (" + err.code + "): " + err.message);
    MessageQueue.sendAppMessage({
city: "Loc Unavailable",
    });
}

var locationOptions = {
    timeout: 15e3,
    maximumAge: 6e4
};

function goDoStuff() {
    var ownName = arguments.callee.toString();
    ownName = ownName.substr('function '.length);        // trim off "function "
    ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
    var lastUpdate;
    var now = new Date().getTime();
    now = Math.round(now / 1e3);
    var delay = 300;
    //delay = 60;
    if (debug_flag > 0) {
        console.log("FUNCTION NAME = " + ownName);
        console.log("lastUpdate: " + localStorage.getItem("lastUpdate"));
    }
    if (!(localStorage.getItem("lastUpdate"))) {
        if (debug_flag > 0) {
            console.log("local storage of lastUpdate not found");
        }
        lastUpdate = now - (delay + 1);
        if (debug_flag > 0) {
            console.log("setting lastupdate to " + lastUpdate);
        }
        localStorage.setItem("lastUpdate", lastUpdate);
    } else {
        lastUpdate = parseInt(localStorage.getItem("lastUpdate"));
        if (debug_flag > 0) {
            console.log("localStorage.lastUpdate found: " + lastUpdate);
        }
    }

    if ((lastUpdate + delay) < now) {
        console.log("overdue " + (now - (lastUpdate + delay)) + " seconds");
        localStorage.setItem("lastUpdate", now);
        locationWatcher = window.navigator.geolocation.watchPosition(locationSuccess, locationError, locationOptions);

    } else if ((lastUpdate + delay) > now) {
        console.log("please wait " + parseInt((lastUpdate + delay)- now) + " seconds");
        readPersistentAlmanac();
        for (var i = 0; i < 6; i++) {
            //sendDayMessages(i);
            readPersistent(i);
        }
    }
}

Pebble.addEventListener("ready", function(e) {
    console.log("addEventListener ready ");
    //locationWatcher = window.navigator.geolocation.watchPosition(locationSuccess, locationError, locationOptions);
    goDoStuff();
});

Pebble.addEventListener("appmessage", function(e) {
    console.log("addEventListener appmessage");
    //window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
    goDoStuff();
});

Pebble.addEventListener("showConfiguration", function() {
    Pebble.openURL('http://x.SetPebble.com/' + setPebbleToken + '/' + Pebble.getAccountToken());
});

Pebble.addEventListener("webviewclosed", function(e) {
    if ((typeof(e.response) == 'string') && (e.response.length > 0)) {
        //set local value tempFlag to return value
        //Pebble.sendAppMessage(JSON.parse(e.response));se);
        var responseText		= e.response;
        //var item = "1";

        if (debug_flag > 0) {
            console.log("raw e.response (no JSON.parse) = " + e.response);
            console.log("responseText.replace = " + responseText);
            console.log("tempFlag = " + tempFlag);
        }
        responseText = responseText.replace("\"1\"", "\"tempUnits\"");
        responseText = responseText.replace("\"2\"", "\"pressUnits\"");
        responseText = responseText.replace("\"3\"", "\"location\"");
        responseText = responseText.replace("\"4\"", "\"provider\"");

        if (debug_flag > 0) {
            console.log("responseText.replace = " + responseText);
        }
        var config = JSON.parse(responseText);
        tempFlag = config.tempUnits;
        localStorage.setItem("tempFlag", tempFlag);
        pressureFlag = config.pressUnits;
        localStorage.setItem("pressureFlag", pressureFlag);
        provider_flag = config.provider;
        //var location = config.location;
        MessageQueue.sendAppMessage({
location: config.location,
        });

        //localStorage.setItem("tempFlag", JSON.parse(e.response));
        //console.log("e.response " + e.response);
        //console.log("JSON.parse(e.response)" + JSON.parse(e.response));
        //	pseudoFunction();
        //	locationSuccess(pos);
        window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);

    }
});




function iconFromWeatherString(weatherId) {
    var debug_flag = 1;
    if (weatherId == "tstorms") {
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 6");
        }// 200 series - thunderstorms, // 300 to 321 defined as rain, 400-499 not defined, 500-599 is rain
        return 12;

    } else if (weatherId == "rain") {
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 6");
        } // 200 series - thunderstorms, // 300 to 321 defined as rain, 400-499 not defined, 500-599 is rain
        return 6;

    } else if (weatherId == "chancetstorms") {
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 12");
        } // 200 series - thunderstorms, // 300 to 321 defined as rain, 400-499 not defined, 500-599 is rain
        return 12;

    } else if (weatherId == "chancerain") {
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 6");
        } // 200 series - thunderstorms, // 300 to 321 defined as rain, 400-499 not defined, 500-599 is rain
        return 6;

    } else if (weatherId == "sleet") {// 600-699 defined as snow
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 8");
        }
        return 8;

    } else if (weatherId == "snow") {// 600-699 defined as snow
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 8");
        }
        return 8;

    } else if (weatherId == "flurries") {// 600-699 defined as snow
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 8");
        }
        return 8;

    } else if (weatherId == "chancesnow") {// 600-699 defined as snow
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 8");
        }
        return 8;

    } else if (weatherId == "chancesleet") {// 600-699 defined as snow
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 8");
        }
        return 8;

    } else if (weatherId == "chanceflurries") {// 600-699 defined as snow
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 8");
        }
        return 8;

    } else if (weatherId == "mostlycloudy" ) {		// 700-799 is mist, smoke, fog, etc. Return lines
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 4");
        }
        return 4;// 900-99 is crazy atmospheric shit,

    } else if (weatherId == "cloudy" ) {		// 700-799 is mist, smoke, fog, etc. Return lines
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 4");
        }
        return 4;						// 900-99 is crazy atmospheric shit,

    } else if (weatherId == "clear") {		// 800 is clear
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 0");
        }
        return 0;

    } else if (weatherId == "sunny") {		// 800 is clear
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 0");
        }
        return 0;

    } else if (weatherId == "partlysunny") {	// 801, 802, 803 are all partly cloudy
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 2");
        }
        return 2;

    } else if (weatherId == "mostlysunny") {	// 801, 802, 803 are all partly cloudy
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 2");
        }
        return 2;

    } else if (weatherId == "partlycloudy") {	// 801, 802, 803 are all partly cloudy
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 2");
        }
        return 2;

    } else if (weatherId == "hazy" ) {   // 804 = overcast. Should it be clouds, or lines? I love lines. So, lines. But it shoudl probably be clouds
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 10");
        }
        return 10;

    } else if (weatherId == "fog" ) {   // 804 = overcast. Should it be clouds, or lines? I love lines. So, lines. But it shoudl probably be clouds
        if (debug_flag > 0) {
            console.log("weatherId = " + weatherId + ", return 10");
        }
        return 10;

    } else {							// 900 to 962 ranges from tornado to calm. Most strange.
        if (debug_flag > 0) {
            console.log("else return 10");
        }
        return 10;
    }
}



function iconFromWeatherIconCode(weatherIconCode) {
    if (weatherIconCode == "01d") {
        return 0;
    } else if (weatherIconCode == "01n") {
        return 1;
    } else if (weatherIconCode == "02d") {
        return 2;
    } else if (weatherIconCode == "02n") {
        return 3;
    } else if (weatherIconCode == "03d") {
        return 4;
    } else if (weatherIconCode == "03n") {
        return 4;
    } else if (weatherIconCode == "04d") {
        return 2;
    } else if (weatherIconCode == "04n") {
        return 4;
    } else if (weatherIconCode == "09d") {
        return 5;
    } else if (weatherIconCode == "09n") {
        return 5;
    } else if (weatherIconCode == "10d") {
        return 5;
    } else if (weatherIconCode == "10n") {
        return 5;
    } else if (weatherIconCode == "11d") {
        return 5;
    } else if (weatherIconCode == "11n") {
        return 5;
    } else if (weatherIconCode == "13d") {
        return 6;
    } else if (weatherIconCode == "13n") {
        return 6;
    } else if (weatherIconCode == "50d") {
        return 9;
    } else if (weatherIconCode == "50n") {
        return 9;
    } else {
        return 4;
    }
}

/*static uint32_t WEATHER_ICONS[] = {
 RESOURCE_ID_IMAGE_SUN, //0 clear 0
 RESOURCE_ID_IMAGE_MOON,  //1  clear +1 (+1 = night)
 RESOURCE_ID_IMAGE_PCLOUDY,  //2 PC
 RESOURCE_ID_IMAGE_PCLOUDY_MOON,  //3  PC +1 for night
 RESOURCE_ID_IMAGE_CLOUD,  //4
 RESOURCE_ID_IMAGE_CLOUD,  //5 for full clouds at night
 RESOURCE_ID_IMAGE_RAIN,  //6
 RESOURCE_ID_IMAGE_RAIN,  //7 for 6 + 1 or rain at night
 RESOURCE_ID_IMAGE_SNOW,  //8
 RESOURCE_ID_IMAGE_SNOW,  //9 is 8 + 1 or snow at night
 RESOURCE_ID_IMAGE_FOG,  //10
 RESOURCE_ID_IMAGE_FOG,  //11, or 10 + 1 fog at night
 RESOURCE_ID_IMAGE_TSTORM, // 12
 RESOURCE_ID_IMAGE_TSTORM, // 13
 RESOURCE_ID_IMAGE_UNKNOWN, // 14
 RESOURCE_ID_IMAGE_UNKNOWN, // 15
 };*/


function iconFromWeatherId(weatherId, day) {
    if (weatherId < 200) {		    // 0-199 undefined, return lines?
        console.log("day " + day + ", weatherId " + weatherId + "; 0-199 undefined, return lines, return 10 (fog lines)");
        return 10;
    } else if (weatherId < 300) {     // 200 series - thunderstorms,
        console.log("day " + day + ", weatherId " + weatherId + "; 200 series - thunderstorms,, return 12 (thunderstorm)");
        return 12;
    } else if (weatherId < 600) {      // 300 to 321 defined as rain, 400-499 not defined, 500-599 is rain
        console.log("day " + day + ", weatherId " + weatherId + "; 300 to 321 defined as rain, 400-499 not defined, 500-599 is rain, return 6 (rain)");
        return 6;
    } else if (weatherId < 700) { // 600-699 defined as snow
        console.log("day " + day + ", weatherId " + weatherId + "; 600-699 defined as snow, return 8 (snow)");
        return 8;
    } else if (weatherId < 800) {		// 700-799 is mist, smoke, fog, etc. Return lines
        console.log("day " + day + ", weatherId " + weatherId + "; 700-799 is mist, smoke, fog, etc.  return 10 (fog lines)");
        return 10;						// 900-99 is crazy atmospheric shit,
    } else  if (weatherId == 800 ) {		// 800 is clear
        console.log("day " + day + ", weatherId " + weatherId + "; 800 is clear, return 0 (clear)");
        return 0;
    } else if (weatherId < 804 ) {	// 801, 802, 803 are all partly cloudy
        console.log("day " + day + ", weatherId " + weatherId + "; 801, 802, 803 are all partly cloudy, return 2 (partly cloudy)");
        return 2;
    } else if (weatherId == 804 ) {
        // 804 = overcast. Should it be clouds, or lines? I love lines. So, lines. But it shoudl probably be clouds
        console.log("day " + day + ", weatherId " + weatherId + "; 804 = overcast. Should it be clouds, or lines? return 10 (fog lines)");
        return 10;
    } else {
        console.log("day " + day + ", weatherId " + weatherId + "; 900-99 is crazy atmospheric shit,900 to 962 ranges from tornado to calm. Most strange. Return 10");
        return 10;
    }
}


var MessageQueue=function() {
    console.log("sending message");
    var RETRY_MAX=50;
    var queue=[];
    var sending=false;
    var timer=null;
    return {reset:reset,sendAppMessage:sendAppMessage,size:size};
    function reset() {
        queue=[];
        sending=false
    }
    function sendAppMessage(message,ack,nack) {
        if(!isValidMessage(message)) {
            return false
        }
        queue.push({message:message,ack:ack||null,nack:nack||null,attempts:0});
        setTimeout(function() {
            sendNextMessage()
        },1);
        return true
    }
    function size() {
        return queue.length
    }
    function isValidMessage(message) {
        if(message!==Object(message)) {
            return false
        }
        var keys=Object.keys(message);
        if(!keys.length) {
            return false
        }
        for(var k=0; k<keys.length; k+=1) {
            var validKey=/^[0-9a-zA-Z-_]*$/.test(keys[k]);
            if(!validKey) {
                return false
            }
            var value=message[keys[k]];
            if(!validValue(value)) {
                return false
            }
        }
        return true;
        function validValue(value) {
            switch(typeof value) {
            case"string":
                return true;
            case"number":
                return true;
            case"object":
                if(toString.call(value)=="[object Array]") {
                    return true
                }
            }
            return false
        }
    }

    function sendNextMessage() {
        //var debug_flag = 1;
        if (debug_flag > 0) {
            var ownName = arguments.callee.toString();
            ownName = ownName.substr('function '.length);        // trim off "function "
            ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
        }

        if(sending) {
            return
        }
        var message=queue.shift();
        if(!message) {
            return
        }
        message.attempts+=1;
        sending=true;
        Pebble.sendAppMessage(message.message,ack,nack);
        timer=setTimeout(function() {
            timeout()
        },1e3);
        function ack() {
            if (debug_flag > 0) {
                console.log(ownName + " message ack");
            }
            clearTimeout(timer);
            setTimeout(function() {
                sending=false;
                sendNextMessage()
            },200);
            if(message.ack) {
                message.ack.apply(null,arguments)
            }
        }
        function nack() {
            //if (debug_flag > 0) {console.log(ownName + " message NACK");}
            clearTimeout(timer);
            if (debug_flag > 0) {
                console.log(message.attempts + " =? " + RETRY_MAX + " message.attempts =? RETRY_MAX");
            }
            if(message.attempts<RETRY_MAX) {
                queue.unshift(message);
                setTimeout(function() {
                    sending=false;
                    sendNextMessage()
                },200*message.attempts)
            }
            else {
                if(message.nack) {
                    message.nack.apply(null,arguments)
                }
            }
        }
        function timeout() {
            setTimeout(function() {
                sending=false;
                sendNextMessage()
            },1e3);
            if(message.ack) {
                message.ack.apply(null,arguments)
            }
        }
    }
}();

/*
var MessageQueue = function() {
    function t() {
        s = [], c = !1;
    }
    function e(t, e, n) {
        return u(t) ? (s.push({
                              message: t,
                              ack: e || null,
                              nack: n || null,
                              attempts: 0
                              }), setTimeout(function() {
                                             r();
                                             }, 1), !0) : !1;
    }
    function n() {
        return s.length;
    }
    function u(t) {
        function e(t) {
            switch (typeof t) {
                case "string":
                    return !0;

                case "number":
                    return !0;

                case "object":
                    if ("[object Array]" == toString.call(t)) return !0;
            }
            return !1;
        }
        if (t !== Object(t)) return !1;
        var n = Object.keys(t);
        if (!n.length) return !1;
        for (var u = 0; u < n.length; u += 1) {
            var r = /^[0-9a-zA-Z-_]*$/.test(n[u]);
            if (!r) return !1;
            var a = t[n[u]];
            if (!e(a)) return !1;
        }
        return !0;
    }
    function r() {
        function t() {
            clearTimeout(i), setTimeout(function() {
                                        c = !1, r();
                                        }, 200), u.ack && u.ack.apply(null, arguments);
        }
        function e() {
            clearTimeout(i), u.attempts < a ? (s.unshift(u), setTimeout(function() {
                                                                        c = !1, r();
                                                                        }, 200 * u.attempts)) : u.nack && u.nack.apply(null, arguments);
        }
        function n() {
            setTimeout(function() {
                       c = !1, r();
                       }, 1e3), u.ack && u.ack.apply(null, arguments);
        }
        if (!c) {
            var u = s.shift();
            u && (u.attempts += 1, c = !0, Pebble.sendAppMessage(u.message, t, e), i = setTimeout(function() {
                                                                                                  n();
                                                                                                  }, 1e3));
        }
    }
    var a = 5, s = [], c = !1, i = null;
    return {
    reset: t,
    sendAppMessage: e,
    size: n
    };
}();  */