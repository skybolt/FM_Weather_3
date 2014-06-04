/*jshint smarttabs:true*/

var setPebbleToken = 'JUCP'; //    'XPGE'; 'JUCP is FM Forecast, XPGE is WU Forecast

// //mine  //settings Key  http://setpebble.com/api/8BES
//console.log("substance, setpebble token " + setPebbleToken + " for app v. 2.5.1");
//console.log("request.open( http://x.SetPebble.com/api/" + setPebbleToken + '/' + Pebble.getAccountToken());
//Pebble.addEventListener('ready', function(e) {
//});
var debug_flag = 0;
var m = 1;
var n = 0;
var day; 
var provider_flag = 0;
//var tempFlag = 7; //0F, 1C, 2K, 3Ra, 4Re, 5Ro, 6N, 7De
var offset = new Date().getTimezoneOffset() / 60;

/*
var day0_icon;  //= iconFromWeatherId(response.weather[0].id);
var day0_temp;  //= tempGetter(response.main.temp) + getTempLabel();
var day0_high;  //= tempGetter(response.main.temp_max) + getTempLabel();
var day0_low;  //= tempGetter(response.main.temp_min) + getTempLabel();
var day0_conditions;  //= response.weather[0].main;
var day0_baro;  //= pressureGetter(response.main.pressure * 0.0295301);
var day0_timestamp; //= response.dt - (offset * 3600);
*/
var icon;  //= iconFromWeatherId(response.weather[0].id);
var temp;  //= tempGetter(response.main.temp) + getTempLabel();
var high;  //= tempGetter(response.main.temp_max) + getTempLabel();
var day1_high = 0;
var day2_low = 0;
var low;  //= tempGetter(response.main.temp_min) + getTempLabel();
var conditions;  //= response.weather[0].main;
var baro;  //= pressureGetter(response.main.pressure * 0.0295301);
var timestamp; //= response.dt - (offset * 3600);

//localStorage.removeItem("tempFlag");
var tempFlag = parseInt(localStorage.getItem("tempFlag"));
if (debug_flag > 1) {
    console.log("tempFlag found, " + tempFlag);
    console.log("tempFlag without parseInt " + localStorage.getItem("tempFlag"));
}
if (tempFlag !== 0) {
    if (!tempFlag) {
        var tempFlag = 6; //0F, 1C, 2K, 3Ra, 4Re, 5Ro, 6N, 7De
        if (debug_flag > 1) {
            console.log("tempFlag not found, set to " + tempFlag);
        }
    }
}

var pressureFlag = parseInt(localStorage.getItem("pressureFlag"));
if (debug_flag > 2) {
    console.log("pressureFlag found, " + pressureFlag);
}
if (pressureFlag !== 0 ) {
    if (!pressureFlag) {
        var pressureFlag = 0; //0 inHg, 1 mb, 2 PSI, 3 Pa, 4 Tech Atm, 5 Std Atm, 6 Torr
        if (debug_flag > 2) {
            console.log("pressureFlag not found, set to " + pressureFlag);
        }
	}
}

if (debug_flag > 1) {
	console.log("resulting tempFlag, " + tempFlag);
}

function stripper(stripped) {
    if (debug_flag > 2) {
        console.log("stripper input: " + stripped);
    }
    stripped = stripped.replace("moderate rain", "mod rain");
    stripped = stripped.replace("scattered clouds", "sctd clds");
    stripped = stripped.replace("sky is clear", "sky clear");
    stripped = stripped.replace("Thunderstorm", "ThStr");
    stripped = stripped.replace("Rain Showers", "rain shwrs");
    stripped = stripped.replace("Partly Cloudy", "part cldy");
    stripped = stripped.replace("Mostly Cloudy", "most cldy");
    stripped = stripped.replace("overcast", "over cast");
    if (debug_flag > 2) {
        console.log("stripper output: " + stripped);
    }
    return stripped;
}

function tempShower(inTemp) {
	debug_flag = 2; 
	if (debug_flag > 1) {
		temp = (inTemp * (9/5)) - 459.67;
		temp = Math.round(temp);
		if (debug_flag > 1) {
            console.log("temp is " + temp + "°F" );
        }
		temp = inTemp - 273.15;
		temp = Math.round(temp);
        if (debug_flag > 1) {
			console.log("temp is " + temp + "\u00B0C" );
        }
		temp = Math.round(inTemp);
		if (debug_flag > 1) {
            console.log("temp is " + temp + "K" );
			console.log("base calc unit is K"); 
        }
		temp = inTemp * (9/5);
		temp = Math.round(temp);
		if (debug_flag > 1) {
            console.log("temp is " + temp + "°Ra" );
        }
		temp = (inTemp - 273.15) * (4/5);
		temp = Math.round(temp);
		if (debug_flag > 1) {
            console.log("temp is " + temp + "°Ré" );
        }
		temp = ((inTemp - 273.15) * (21/40)) + 7.5;
		temp = Math.round(temp);
		if (debug_flag > 1) {
            console.log("temp is " + temp + "°Rø" );
        }
		temp = (inTemp - 273.15) * (33/100);
		temp = Math.round(temp);
		if (debug_flag > 1) {
            console.log("temp is " + temp + "°N" );
        }
		temp = (373.15 - inTemp) * (3/2);
		temp = Math.round(temp);
		if (debug_flag > 1) {
            console.log("temp is " + temp + "°De" );
        }
	} // end of if debug_flag > 1 condition
}

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
		if (debug_flag > 1) {
            console.log("temp is " + temp + "°F" );
		}
		return temp;
	} else if (tempFlag == 1) {
		//Celsius °C
		// [°C] = [K] − 273.15
		temp = temp - 273.15;
		temp = Math.round(temp);
		if (debug_flag > 1) {
			console.log("temp is " + temp + "°C" );
		}
		return temp;
	} else if (tempFlag == 2) {
		//Kelvin K
		// base scale
		temp = Math.round(temp);
		if (debug_flag > 1) {
			console.log("temp is " + temp + "K" );
		}
		return temp;
	} else if (tempFlag == 3) {
		//Rankine °Ra
		// [°R] = [K] × 9/5
		temp = temp * (9/5);
		temp = Math.round(temp);
		if (debug_flag > 1) {
            console.log("temp is " + temp + "°Ra" );
		}
		return temp;
	} else if (tempFlag == 4) {
		//Réaumur °Ré
		// [°Ré] = ([K] − 273.15) × 4/5
		temp = (temp - 273.15) * (4/5);
		temp = Math.round(temp);
		if (debug_flag > 1) {
            console.log("temp is " + temp + "°Ré" );
		}
		return temp;
	} else if (tempFlag == 5) {
		//Rømer °Rø
		// [°Rø] = ([K] − 273.15) × 21/40 + 7.5
		temp = ((temp - 273.15) * (21/40)) + 7.5;
		temp = Math.round(temp);
		if (debug_flag > 1) {
            console.log("temp is " + temp + "°Rø" );
		}
		return temp;
	} else if (tempFlag == 6) {
		//Newton °N
		//[°N] = ([K] − 273.15) × 33/100
		temp = (temp - 273.15) * (33/100);
		temp = Math.round(temp);
		if (debug_flag > 1) {
            console.log("temp is " + temp + "°N" );
		}
		return temp;
	} else if (tempFlag == 7) {
		//Delisle °D
		// [°De] = (373.15 − [K]) × 3/2
		temp = (373.15 - temp) * (3/2);
		temp = Math.round(temp);
		if (debug_flag > 1) {
            console.log("temp is " + temp + "°De" );
		}
		return temp;
	}
}


function fetchWeatherConditions(latitude, longitude) {  //sends day0, day1 temp (high), day2 temp (low);
	var ownName = arguments.callee.toString(); 
	ownName = ownName.substr('function '.length);        // trim off "function "
	ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
	if (debug_flag > 1) {
	console.log("FUNCTION NAME = " + ownName); 
	}

    var response;
    var req = new XMLHttpRequest();
    req.open("GET", "http://api.openweathermap.org/data/2.5/weather?" + "lat=" + latitude + "&lon=" + longitude + "&cnt=2", true);
    if (debug_flag > 1) {
        console.log("http://api.openweathermap.org/data/2.5/weather?" + "lat=" + latitude + "&lon=" + longitude + "&cnt=2");
    }
    req.onload = function(e) {
        var offset = new Date().getTimezoneOffset() / 60;
        if (req.readyState == 4) {
            if (req.status == 200) {
                response = JSON.parse(req.responseText);
                if (debug_flag > 4) {
                    console.log("req.responseText.lenght = " + req.responseText.length);
                    console.log("fetchWeatherConditions response = \n" + req.responseText);
                }
                if (req.responseText.length > 100) {
                    var location = response.name;
                    
                    n = 0;
                    day = 0;
				 if (debug_flag > 1) {
				console.log("n " + n + " (array), m " + m + " (base), day = " + day);					 
				 }
 
                    icon            = iconFromWeatherId(response.weather[0].id);
                    temp            = tempGetter(response.main.temp) + getTempLabel();
                    conditions      = response.weather[0].main;
                    baro = pressureGetter(response.main.pressure * 0.0295301) + getPressureLabel();
                    //baro = "+-*";
                    timestamp = response.dt - (offset * 3600);
                    
                    if (debug_flag > 1) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    sendDayMessages(day);
                    if (debug_flag > 1) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    sendDayMessages(day);
                    
                    
                    var sunrise = response.sys.sunrise;
					if (debug_flag > 3) {
                        console.log("raw sunrise = " + sunrise);
                    }
                    sunrise = parseInt(sunrise) - parseInt (offset * 3600);
                    if (debug_flag > 3) {
                        console.log("adj sunrise = " + sunrise);
                    }
                    var sunset = response.sys.sunset;
					if (debug_flag > 3) {
                        console.log("raw sunset = " + sunset);
					}
                    sunset = parseInt(sunset) - parseInt (offset * 3600);
                    if (debug_flag > 3) {
                        console.log("adgj sunset = " + sunset);
                    }
                    MessageQueue.sendAppMessage({
                                                location: location,
                                                sunrise: sunrise,
                                                sunset: sunset,
                                                });
                    if (debug_flag > 1) {
                        console.log("location: " + location + " sunrise: " + sunrise + " sunset: " + sunset);
                    }
                } else {console.log("fail responseText.lenght > 100 -" + ownName);}
            } else {console.log("fail 200: " + ownName);}
        } else {console.log("fail readyState == 4 " + ownName);}
    };
    req.send(null);
}

function fetchWeatherTodayForecast(latitude, longitude) {  //sends days 1, 2
	var ownName = arguments.callee.toString(); 
	ownName = ownName.substr('function '.length);        // trim off "function "
	ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
	if (debug_flag > 1) {
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
				if (debug_flag > 2) {
                    console.log("fetchWeatherTodayForecast req.responseText.length = " + req.responseText.length);
                    console.log("fred");
				}
                if (req.responseText.length > 100) {
                    if (debug_flag > 2) {
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
				 if (debug_flag > 1) {
				console.log("n " + n + " (array), m " + m + " (base), day = " + day);					 
				 }
                    icon = iconFromWeatherId(response.list[n].weather[0].id);
                    //temp = "oH: " + tempGetter(response.list[0].main.temp) + getTempLabel();
                    temp = "H: " + day1_high;
                    timestamp = response.list[n].dt;
                    timestamp = parseInt(timestamp) - parseInt (offset * 3600);
                    conditions = stripper(response.list[n].weather[0].description);
					               
                    if (debug_flag > 1) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    sendDayMessages(day);
                    
                    n = 5;
                    day = 2;
				 if (debug_flag > 1) {
				console.log("n " + n + " (array), m " + m + " (base), day = " + day);					 
				 }
                    icon = iconFromWeatherId(response.list[n].weather[0].id);
                    //temp = "oL: " + tempGetter(response.list[0].main.temp) + getTempLabel();
                    temp = "L: " + day2_low;
                    timestamp = response.list[n].dt;
                    timestamp = parseInt(timestamp) - parseInt (offset * 3600);
                    conditions = stripper(response.list[n].weather[0].description);
                    
                    if (debug_flag > 1) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    sendDayMessages(day);
                    
                } else {console.log("fail responseText.lenght > 100 -" + ownName);}
            } else {console.log("fail 200: " + ownName);}
        } else {console.log("fail readyState == 4 " + ownName);}
    };
    req.send(null);
}

function fetchWeather3DayForecast(latitude, longitude) {       // sends days 3, 4, 5
	var ownName = arguments.callee.toString(); 
	ownName = ownName.substr('function '.length);        // trim off "function "
	ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
	if (debug_flag > 1) {
	console.log("FUNCTION NAME = " + ownName); 
	}

	var req = new XMLHttpRequest();
    req.open("GET", "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + latitude + "&lon=" + longitude + "&cnt=10&APPID=9f001a597927140d919cc512193dadd2", true);
	if (debug_flag > 1) {
        console.log("http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + latitude + "&lon=" + longitude + "&cnt=10&APPID=9f001a597927140d919cc512193dadd2");
	}
    req.onload = function(e) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                var response = JSON.parse(req.responseText);
                if (debug_flag > 4) {
                    console.log("req.responseText.lenght = " + req.responseText.length);
                    console.log("test response dump \n" + req.responseText);
                }
                if (req.responseText.length > 100) {
                    
                    day1_high = tempGetter(response.list[0].temp.max) + getTempLabel();
                    day2_low = tempGetter(response.list[0].temp.min) + getTempLabel();

                    n = m + 0;
                    day = 3;
				 if (debug_flag > 1) {
				console.log("n " + n + " (array), m " + m + " (base), day = " + day);					 
				 }
                    icon = iconFromWeatherId(response.list[n].weather[0].id);
                    high	= tempGetter(response.list[n].temp.max);
                    low = tempGetter(response.list[n].temp.min);
                    
                    temp = high + "/\n" + low + getTempLabel();
                    conditions = stripper(response.list[n].weather[0].description);
                    timestamp = parseInt(response.list[n].dt);
                    
                    
                    if (debug_flag > 1) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    sendDayMessages(day);
                    
                    n = m + 1;
                    day = 4;
				 if (debug_flag > 1) {
				console.log("n " + n + " (array), m " + m + " (base), day = " + day);					 
				 }
                    icon = iconFromWeatherId(response.list[n].weather[0].id);
                    high	= tempGetter(response.list[n].temp.max);
                    low = tempGetter(response.list[n].temp.min);
                    temp = high + "/\n" + low + getTempLabel();
                    conditions = stripper(response.list[n].weather[0].description);
                    timestamp = parseInt(response.list[n].dt);
                    
                    
                    if (debug_flag > 1) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    sendDayMessages(day);
                    
                    
                    n = m + 2;
                    day = 5;
				 
				 if (debug_flag > 1) {
				console.log("n " + n + " (array), m " + m + " (base), day = " + day);					 
				 }
                    icon = iconFromWeatherId(response.list[n].weather[0].id);
                    high	= tempGetter(response.list[n].temp.max);
                    low = tempGetter(response.list[n].temp.min);
                    temp = high + "/\n" + low + getTempLabel();
                    conditions = stripper(response.list[n].weather[0].description);
                    timestamp = parseInt(response.list[n].dt);
                    
                    if (debug_flag > 1) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    sendDayMessages(day);
                    
                } else {console.log("fail responseText.lenght > 100 -" + ownName);}
            } else {console.log("fail 200: " + ownName);}
        } else {console.log("fail readyState == 4 " + ownName);}
    };
    req.send(null);
}



/*NEXT SECTION IS FOR WEATHER UNDERGROUND*/

function fetchWeatherUndergroundConditions(latitude, longitude) { // gets day 0
	var ownName = arguments.callee.toString(); 
	ownName = ownName.substr('function '.length);        // trim off "function "
	ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
	if (debug_flag > 1) {
	console.log("FUNCTION NAME = " + ownName); 
	}
	
	var tt = new Date();
	if (debug_flag > 3) {
	console.log("new Date =" + tt);		
	}
    var req = new XMLHttpRequest();
	req.open("GET", "http://api.wunderground.com/api/d33637904b0a944c/conditions/geolookup/q/" + latitude + "," + longitude + ".json", true);
    if (debug_flag > 2) {
	    console.log("Weather Underground app key request!! d33637904b0a944c");
	    console.log("http://api.wunderground.com/api/d33637904b0a944c/conditions/geolookup/q/" + latitude + "," + longitude + ".json");

    }
	
	req.onload = function(e) {
		if (req.readyState == 4) {
			if (req.status == 200) {
				var response = JSON.parse(req.responseText);
				if (debug_flag > 2) {
				console.log("req.responseText.length = " + req.responseText.length);					
				}
                
				if (req.responseText.length > 0) {
                    
                    day = 0;
					
				 if (debug_flag > 1) {
				console.log("n " + n + " (array), m " + m + " (base), day = " + day);					 
				 }
					icon = iconFromWeatherString(response.current_observation.icon);
					temp = tempGetter(response.current_observation.temp_c + 273.15) + getTempLabel();
					conditions = response.current_observation.weather.replace(" ", "\n");
                    timestamp = parseInt(response.current_observation.local_epoch) - (offset * 3600);
                    baro = pressureGetter(response.current_observation.pressure_in) + getPressureLabel() + response.current_observation.pressure_trend.replace("0", "*").replace("-", "÷");
                    
                    if (debug_flag > 1) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    sendDayMessages(day);
                    
                } else {console.log("fail responseText.lenght > 100 -" + ownName);}
            } else {console.log("fail 200: " + ownName);}
        } else {console.log("fail readyState == 4 " + ownName);}
    };
    req.send(null);
}

function fetchWeatherUndergroundTodayForecast(latitude, longitude) { // gets day 1, 2
	var ownName = arguments.callee.toString(); 
	ownName = ownName.substr('function '.length);        // trim off "function "
	ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
	if (debug_flag > 1) {
	console.log("FUNCTION NAME = " + ownName); 
	}
	
    var response;
    var req = new XMLHttpRequest();
    req.open("GET", "http://api.wunderground.com/api/25604a92d894df0e/hourly/geolookup/q/" + latitude + "," + longitude + ".json", true);
    if (debug_flag > 1) {
	    console.log("Weather Underground app key request!! 25604a92d894df0e");
	    console.log("http://api.wunderground.com/api/25604a92d894df0e/hourly/geolookup/q/" + latitude + "," + longitude + ".json");
    }
    req.onload = function(e) {
        var offset = new Date().getTimezoneOffset() / 60;
        if (req.readyState == 4) {
            if (req.status == 200) {
                response = JSON.parse(req.responseText);
				if (debug_flag > 2) {
                    console.log("fetchWeatherTodayForecast req.responseText.length = " + req.responseText.length);
				}
                if (req.responseText.length > 100) {
                    if (debug_flag > 2) {
                        console.log("");
                        console.log("");
                        console.log("");
                    }
                    
                    if (debug_flag > 5) {
                        for (var i = 0; i < 7; i++) {
					    //text += cars[i];
					    console.log("forecast description[" + i + "]: " + stripper(response.list[i].weather[0].description));
                        }
                        
                    }
                    
                    n = 1;
                    day = 1;
				 if (debug_flag > 1) {
				console.log("n " + n + " (array), m " + m + " (base), day = " + day);					 
				 }
                    icon = iconFromWeatherString(response.hourly_forecast[n].icon);
				 temp = "H: " + day1_high;  
                    timestamp = response.hourly_forecast[n].FCTTIME.epoch;
                    conditions = response.hourly_forecast[n].wx;
					if (debug_flag > 1) {
						console.log("raw timestamp: " + timestamp);
					}
                    timestamp = parseInt(timestamp) - parseInt (offset * 3600);
					if (debug_flag > 1) {
						console.log("parseInt timestamp: " + timestamp);
					}
                    if (debug_flag > 1) {
					console.log("requesting sendDayMessages(" + day + ")");
                    }
                    sendDayMessages(day);
                    
                    n = 15;
                    day = 2;
				 if (debug_flag > 1) {
				console.log("n " + n + " (array), m " + m + " (base), day = " + day);					 
				 }
                    icon = iconFromWeatherString(response.hourly_forecast[n].icon);
				 temp = "L: " + day2_low; 
                    //temp = response.hourly_forecast[n].temp.metric;
                    timestamp = response.hourly_forecast[n].FCTTIME.epoch;
                    conditions = response.hourly_forecast[n].wx;
					if (debug_flag > 1) {
						console.log("raw timestamp: " + timestamp);
					}
                    timestamp = parseInt(timestamp) - parseInt (offset * 3600);
					if (debug_flag > 1) {
						console.log("parseInt timestamp: " + timestamp);
					}
				 
				 if (debug_flag > 1) {
					 console.log("requesting sendDayMessages(" + day + ")");
				 }
				 sendDayMessages(day);
                    
                } else {console.log("fail responseText.lenght > 100 -" + ownName);}
            } else {console.log("fail 200: " + ownName);}
        } else {console.log("fail readyState == 4 " + ownName);}
    };
    req.send(null);
}

function fetchWeatherUnderground3DayForecast(latitude, longitude) { // gets day 3, 4, 5
	var ownName = arguments.callee.toString(); 
	ownName = ownName.substr('function '.length);        // trim off "function "
	ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
	if (debug_flag > 1) {
	console.log("FUNCTION NAME = " + ownName); 
	}

    var response;
    var req = new XMLHttpRequest();
    req.open("GET", "http://api.wunderground.com/api/6fe6c99a5d7df975/forecast/geolookup/q/" + latitude + "," + longitude + ".json", true);
    if (debug_flag > 2) {
	    console.log("Weather Underground app key request!! 6fe6c99a5d7df975");
	    console.log("http://api.wunderground.com/api/6fe6c99a5d7df975/forecast/geolookup/q/" + latitude + "," + longitude + ".json");

    }
    req.onload = function(e) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                response = JSON.parse(req.responseText);
                if (req.responseText.length > 0) {

				 day1_high = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[0].high.celsius) + 273.15) + getTempLabel();
				 
				 day2_low = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[0].low.celsius) + 273.15) + getTempLabel();
				 
				 n = m -1 ;// array is day and night, in text rollup odd numbers night (contain low in temp), days (even numbers) contain high
                    day = 3;
				 if (debug_flag > 1) {
				console.log("n " + n + " (array), m " + m + " (base), day = " + day);					 
				 }
                    icon = iconFromWeatherString(response.forecast.simpleforecast.forecastday[n].icon);
                    timestamp = parseInt(response.forecast.simpleforecast.forecastday[n].date.epoch);
                    conditions = stripper(response.forecast.simpleforecast.forecastday[n].conditions);
                    high = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[n].high.celsius) + 273.15);
                    low = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[n].low.celsius) + 273.15);
                    temp = high + "/\n" + low + getTempLabel();
                    
                    if (debug_flag > 1) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    sendDayMessages(day);
                    
                    n = m;
                    day = 4;
				 if (debug_flag > 1) {
				console.log("n " + n + " (array), m " + m + " (base), day = " + day);					 
				 }
                    icon = iconFromWeatherString(response.forecast.simpleforecast.forecastday[n].icon);
                    timestamp = parseInt(response.forecast.simpleforecast.forecastday[n].date.epoch);
                    conditions = stripper(response.forecast.simpleforecast.forecastday[n].conditions);
                    high = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[n].high.celsius) + 273.15);
                    low = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[n].low.celsius) + 273.15);
                    temp = high + "/\n" + low + getTempLabel();
                    
                    if (debug_flag > 1) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    sendDayMessages(day);

                    n = m + 1;
                    day = 5;	
				 if (debug_flag > 1) {
				console.log("n " + n + " (array), m " + m + " (base), day = " + day);					 
				 }
				 icon = iconFromWeatherString(response.forecast.simpleforecast.forecastday[n].icon);
                    timestamp = parseInt(response.forecast.simpleforecast.forecastday[n].date.epoch);
                    conditions = stripper(response.forecast.simpleforecast.forecastday[n].conditions);
                    high = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[n].high.celsius) + 273.15);
                    low = tempGetter(parseInt(response.forecast.simpleforecast.forecastday[n].low.celsius) + 273.15);
                    temp = high + "/\n" + low + getTempLabel();
                    
                    if (debug_flag > 1) {
                        console.log("requesting sendDayMessages(" + day + ")");
                    }
                    sendDayMessages(day);
                    
                } else {console.log("fail responseText.lenght > 100 -" + ownName);}
            } else {console.log("fail 200: " + ownName);}
        } else {console.log("fail readyState == 4 " + ownName);}
    };
    req.send(null);
}

function fetchSunriseSunset(latitude, longitude) {
	var ownName = arguments.callee.toString(); 
	ownName = ownName.substr('function '.length);        // trim off "function "
	ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
	if (debug_flag > 1) {
	console.log("FUNCTION NAME = " + ownName); 
	}
    var response;
    var req = new XMLHttpRequest();
    req.open("GET", "http://api.openweathermap.org/data/2.5/weather?" + "lat=" + latitude + "&lon=" + longitude + "&cnt=2", true);
    if (debug_flag > 1) {
        console.log("http://api.openweathermap.org/data/2.5/weather?" + "lat=" + latitude + "&lon=" + longitude + "&cnt=2");
    }
    req.onload = function(e) {
        var offset = new Date().getTimezoneOffset() / 60;
        if (req.readyState == 4) {
            if (req.status == 200) {
                response = JSON.parse(req.responseText);
                if (debug_flag > 4) {
                    console.log("req.responseText.lenght = " + req.responseText.length);
                    console.log("fetchWeatherConditions response = \n" + req.responseText);
                }
                if (req.responseText.length > 100) {
                    var location = response.name;
                    //location = "Kingdom of Los Angeles America";
                    
                    var sunrise = response.sys.sunrise;
					if (debug_flag > 3) {
                        console.log("raw sunrise = " + sunrise);
                    }
                    sunrise = parseInt(sunrise) - parseInt (offset * 3600);
                    if (debug_flag > 3) {
                        console.log("adj sunrise = " + sunrise);
                    }
                    var sunset = response.sys.sunset;
					if (debug_flag > 3) {
                        console.log("raw sunset = " + sunset);
					}
                    sunset = parseInt(sunset) - parseInt (offset * 3600);
                    if (debug_flag > 3) {
                        console.log("adgj sunset = " + sunset);
                    }
                    MessageQueue.sendAppMessage({
                                                location: location,
                                                sunrise: sunrise,
                                                sunset: sunset,
                                                });
                } else {console.log("fail responseText.lenght > 100 -" + ownName);}
            } else {console.log("fail 200: " + ownName);}
        } else {console.log("fail readyState == 4 " + ownName);}
    };
    req.send(null);
    
}

function sendDayMessages(day) {
    
    if (debug_flag > 1) {
        console.log("day = " + day);
    }
    n = 0;
    var k0 = day * 10; 
    var k1 = k0 + 1;
    var k2 = k0 + 2;
    var k3 = k0 + 3;
    var k4 = k0 + 4;

    
    if (day === 0) {
        if (debug_flag > 1) {
            console.log("day0_icon " + k0 + ":" + icon);
            console.log("day0_temp: " +  k1 + ":" + temp);
            console.log("day0_conditions: " +  k2 + ":" + conditions);
            console.log("day0_timestamp: " +  k3 + ":" + timestamp);
            console.log("day0_baro: " +  k4 + ":" + baro);
        }
        MessageQueue.sendAppMessage({
                                    day0_icon: icon,
                                    day0_temp: temp + "",
                                    day0_conditions: conditions,
                                    day0_timestamp: timestamp,
                                    day0_baro: baro,
                                    });
        
    }
    
    else if (day == 1) {
        if (debug_flag > 1) {
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
        if (debug_flag > 1) {
            console.log("day2_icon " + k0 + ":" + icon);
            console.log("day2_temp: " +  k1 + ":" + temp);
            console.log("day2_conditions: " +  k2 + ":" + conditions);
            console.log("day2_timestamp: " +  k3 + ":" + timestamp);
        }
        MessageQueue.sendAppMessage({
                                    day2_icon: icon,
                                    day2_temp: temp + "",
                                    day2_conditions: conditions,
                                    day2_timestamp: timestamp,
                                    });
        
    }
    
    else if (day == 3) {
        if (debug_flag > 1) {
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
        if (debug_flag > 1) {
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
        if (debug_flag > 1) {
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
    if (debug_flag > 1) {
        console.log("locationSuccess, " + coordinates.latitude + ", " + coordinates.longitude);
    }
    //var latitude = 41.852014;
    //var longitude = 12.577281;
    //fetchWeather(latitude, longitude);
    if (provider_flag === 0) {
        fetchWeatherConditions(coordinates.latitude, coordinates.longitude);
        fetchWeather3DayForecast(coordinates.latitude, coordinates.longitude);
        fetchWeatherTodayForecast(coordinates.latitude, coordinates.longitude);
        fetchSunriseSunset(coordinates.latitude, coordinates.longitude);
    }
    
    else if (provider_flag == 1) {
        fetchWeatherUndergroundConditions(coordinates.latitude, coordinates.longitude);
        fetchWeatherUnderground3DayForecast(coordinates.latitude, coordinates.longitude);
        fetchWeatherUndergroundTodayForecast(coordinates.latitude, coordinates.longitude);
        fetchSunriseSunset(coordinates.latitude, coordinates.longitude);
    }
    
}

function locationError(err) {
    console.warn("location error (" + err.code + "): " + err.message);
    MessageQueue.sendAppMessage({
                                city: "Loc Unavailable",
                                });
}

var locationOptions = {
timeout: 15e3,
maximumAge: 6e4
};

Pebble.addEventListener("ready", function(e) {
                        if (debug_flag > 1) {
                        console.log("addEventListener ready ");
                        }
                        locationWatcher = window.navigator.geolocation.watchPosition(locationSuccess, locationError, locationOptions);
                        });

Pebble.addEventListener("appmessage", function(e) {
                        if (debug_flag > 1) {
                        console.log("addEventListener appmessage");
                        }
                        window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
                        /*
                         key = e.payload.action;
                         if (typeof(key) != 'undefined') {
                         var settings = localStorage.getItem(setPebbleToken);
                         if (typeof(settings) == 'string') {
                         try {
                         Pebble.sendAppMessage(JSON.parse(settings));
                         } catch (e) {
                         }
                         }
                         
                         var request = new XMLHttpRequest();
                         request.open('GET', 'http://x.SetPebble.com/api/' + setPebbleToken + '/' + Pebble.getAccountToken(), true);
                         request.onload = function(e) {
                         if (request.readyState == 4)
                         if (request.status == 200)
                         try {
                         Pebble.sendAppMessage(JSON.parse(request.responseText));
                         } catch (e) {
                         }
                         }
                         request.send(null);
                         }  */
                        });

Pebble.addEventListener("showConfiguration", function() {
                        //    Pebble.openURL("http://assets.getpebble.com.s3-website-us-east-1.amazonaws.com/pebble-js/configurable.html");
                        
                        Pebble.openURL('http://x.SetPebble.com/' + setPebbleToken + '/' + Pebble.getAccountToken());
                        });

Pebble.addEventListener("webviewclosed", function(e) {
                        if ((typeof(e.response) == 'string') && (e.response.length > 0)) {
                        //set local value tempFlag to return value
                        //Pebble.sendAppMessage(JSON.parse(e.response));se);
					    var responseText		= e.response;
					    //var item = "1";
                        
                        if (debug_flag > -1) {
                        console.log("raw e.response (no JSON.parse) = " + e.response);
                        console.log("responseText.replace = " + responseText);
                        console.log("tempFlag = " + tempFlag);
                        }
                        responseText = responseText.replace("\"1\"", "\"tempUnits\"");
                        responseText = responseText.replace("\"2\"", "\"pressUnits\"");
                        responseText = responseText.replace("\"3\"", "\"location\"");
                        responseText = responseText.replace("\"4\"", "\"provider\"");
					    
                        if (debug_flag > -1) {
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
	var debug_flag = 3; 
	
	if (weatherId == "tstorms") {
		if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 6"); // 200 series - thunderstorms, // 300 to 321 defined as rain, 400-499 not defined, 500-599 is rain
        return 6;
        }
    } else if (weatherId == "rain") {
		if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 6"); // 200 series - thunderstorms, // 300 to 321 defined as rain, 400-499 not defined, 500-599 is rain
        return 6;
        }
    } else if (weatherId == "chancetstorms") {
        if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 12"); // 200 series - thunderstorms, // 300 to 321 defined as rain, 400-499 not defined, 500-599 is rain
        return 12;
        }
    } else if (weatherId == "chancerain") {
        if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 6"); // 200 series - thunderstorms, // 300 to 321 defined as rain, 400-499 not defined, 500-599 is rain
        return 6;
        }
    } else if (weatherId == "sleet") {// 600-699 defined as snow
		if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 8");
        return 8;
        }
    } else if (weatherId == "snow") {// 600-699 defined as snow
		if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 8");
        return 8;
        }
    } else if (weatherId == "flurries") {// 600-699 defined as snow
		if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 8");
        return 8;
        }
    } else if (weatherId == "chancesnow") {// 600-699 defined as snow
		if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 8");
        return 8;
        }
    } else if (weatherId == "chancesleet") {// 600-699 defined as snow
		if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 8");
        return 8;
        }
    } else if (weatherId == "chanceflurries") {// 600-699 defined as snow
		if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 8");
        return 8;
        }
    } else if (weatherId == "mostlycloudy" ) {		// 700-799 is mist, smoke, fog, etc. Return lines
        if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 4");
        return 4;// 900-99 is crazy atmospheric shit,
        }
    } else if (weatherId == "cloudy" ) {		// 700-799 is mist, smoke, fog, etc. Return lines
        if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 4");
        return 4;						// 900-99 is crazy atmospheric shit,
        }
    } else if (weatherId == "clear") {		// 800 is clear
        if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 0");
        return 0;
        }
    } else if (weatherId == "sunny") {		// 800 is clear
        if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 0");
        return 0;
        }
    } else if (weatherId == "partlysunny") {	// 801, 802, 803 are all partly cloudy
        if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 2");
            return 2;}
    } else if (weatherId == "mostlysunny") {	// 801, 802, 803 are all partly cloudy
        if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 2");
        return 2;
        }
    } else if (weatherId == "partlycloudy") {	// 801, 802, 803 are all partly cloudy
        if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 2");
        return 2;
        }
    } else if (weatherId == "hazy" ) {   // 804 = overcast. Should it be clouds, or lines? I love lines. So, lines. But it shoudl probably be clouds
        if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 10");
        return 10;
        }
    } else if (weatherId == "fog" ) {   // 804 = overcast. Should it be clouds, or lines? I love lines. So, lines. But it shoudl probably be clouds
        if (debug_flag > 2) { console.log("weatherId = " + weatherId + ", return 10");
        return 10;
        }
    } else {							// 900 to 962 ranges from tornado to calm. Most strange.
        if (debug_flag > 2) { console.log("else return 10");
        return 10;
        }
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


function iconFromWeatherId(weatherId) {
    if (weatherId < 200) {		    // 0-199 undefined, return lines?
        return 10;
    } else if (weatherId < 300) {     // 200 series - thunderstorms,
        return 12;
    } else if (weatherId < 600) {      // 300 to 321 defined as rain, 400-499 not defined, 500-599 is rain
        return 6;
    } else if (weatherId < 700) { // 600-699 defined as snow
        return 8;
    } else if (weatherId < 800) {		// 700-799 is mist, smoke, fog, etc. Return lines
        return 10;						// 900-99 is crazy atmospheric shit,
    } else  if (weatherId == 800 ) {		// 800 is clear
        return 0;
    } else if (weatherId < 804 ) {	// 801, 802, 803 are all partly cloudy
        return 2;
    } else if (weatherId == 804 ){
	    // 804 = overcast. Should it be clouds, or lines? I love lines. So, lines. But it shoudl probably be clouds
        return 10;
    } else {							// 900 to 962 ranges from tornado to calm. Most strange.
        return 10;
    }
}


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
}();