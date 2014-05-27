/*jshint smarttabs:true*/

var setPebbleToken = 'JUCP'; //    'XPGE';

// //mine  //settings Key  http://setpebble.com/api/8BES
//console.log("substance, setpebble token " + setPebbleToken + " for app v. 2.5.1");
//console.log("request.open( http://x.SetPebble.com/api/" + setPebbleToken + '/' + Pebble.getAccountToken());
//Pebble.addEventListener('ready', function(e) {
//});
var debug_flag = 2;
var m = 1;
//var tempFlag = 7; //0F, 1C, 2K, 3Ra, 4Re, 5Ro, 6N, 7De

//localStorage.removeItem("tempFlag");
var tempFlag = parseInt(localStorage.getItem("tempFlag"));
if (debug_flag > 1) {
    console.log("tempFlag found, " + tempFlag);
    console.log("tempFlag without parseInt " + localStorage.getItem("tempFlag"));
}
if (tempFlag != 0) {
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
if (pressureFlag != 0 ) {
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

function tempShower(inTemp) {
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
    if (tempFlag == 0 ) {
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
    if (pressureFlag == 0 ) {
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
    if (pressureFlag == 0 ) {
		//inHG, base unit
        pressure = Math.round(pressure * 100);
        pressure = pressure / 100;
		return pressure;
	} else
        if (pressureFlag == 1) {
            //mb = inHg * 33.8637526
            pressure = pressure * 33.8637526;
            pressure = Math.round(pressure);
            return pressure;
        } else
            if (pressureFlag == 2) {
                //PSI = inHg / 2.0360206576
                pressure = pressure /2.0360206576;
                pressure = Math.round(pressure*100)/100;
                return pressure;
            } else
                if (pressureFlag == 3) {
                    //Pa, pascals = inHg * 3377 or MPa, megapascals * 0.003386
                    // [°R] = [K] × 9/5
                    pressure = pressure * 3386.37526;
                    pressure = Math.round(pressure);
                    return pressure;
                } else
                    if (pressureFlag == 4) {
                        //Technical Atmosphere
                        // Ta = inHg * 0.034531557667501
                        // [°Ré] = ([K] − 273.15) × 4/5
                        pressure = pressure * 0.034531557667501;
                        pressure = Math.round(pressure*100)/100;
                        return pressure;
                    } else
                        if (pressureFlag == 5) {
                            //Standard Atmosphere
                            //Sa = inHg * 0.0334210543544
                            pressure = pressure * 0.0334210543544;
                            pressure = Math.round(pressure*100);
                            return pressure;
                        } else
                            if (pressureFlag == 6) {
                                //Torr
                                //Torr = inHg * 0.254
                                pressure = pressure * 0.254;
                                pressure = Math.round(pressure*100);
                                return pressure;
                            }
	
}


function tempGetter(temp) {
	if (tempFlag == 0 ) {
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

function fetchWeatherForecast(latitude, longitude) {
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
                    
                    var n = m + 0;
                    var day3_icon = iconFromWeatherId(response.list[n].weather[0].id);
                    var day3_high	= tempGetter(response.list[n].temp.max);
                    var day3_low = tempGetter(response.list[n].temp.min);
                    if (tempFlag != 1 || 6) {
                        var day3_temp = day3_high + "/\n" + day3_low + getTempLabel();
                    } else {
                        var day3_temp = day3_high + "/" + day3_low + getTempLabel();
                    }
                    if (debug_flag > 1) {
                        console.log("day3_high = " + day3_high + ", day3_low = " + day3_low + ", day3_temp = " + day3_temp + " conditions = " + response.list[n].weather[0].description);
                    }
                    var day3_conditions = response.list[n].weather[0].description;
                    var day3_timestamp = response.list[n].dt;
                    //Pebble.sendAppMessage({
                    MessageQueue.sendAppMessage({
                                                day3_icon: day3_icon,
                                                day3_temp: day3_temp,
                                                day3_conditions: day3_conditions,
                                                day3_timestamp: day3_timestamp
                                                });
                    
                    n = m + 1;
                    var day4_icon = iconFromWeatherId(response.list[n].weather[0].id);
                    var day4_high	= tempGetter(response.list[n].temp.max);
                    var day4_low = tempGetter(response.list[n].temp.min);
                    if (tempFlag != 1 || 6) {
                        var day4_temp = day4_high + "/\n" + day4_low + getTempLabel();
                    } else {
                        var day4_temp = day4_high + "/" + day4_low + getTempLabel();
                    }
                    var day4_conditions = response.list[n].weather[0].description;
                    var day4_timestamp = response.list[n].dt;
                    if (debug_flag > 1) {
                        console.log("day4_high = " + day4_high + ", day4_low = " + day4_low + ", day4_temp = " + day4_temp);
                    }
                    //Pebble.sendAppMessage({
                    MessageQueue.sendAppMessage({
                                                //
                                                day4_icon: day4_icon,
                                                day4_temp: day4_temp,
                                                day4_conditions: day4_conditions,
                                                day4_timestamp: day4_timestamp
                                                });
                    
                    n = m + 2;
                    var day5_icon = iconFromWeatherId(response.list[n].weather[0].id);
                    var day5_high	= tempGetter(response.list[n].temp.max);
                    var day5_low = tempGetter(response.list[n].temp.min);
                    if (tempFlag != 1 || 6) {
                        var day5_temp = day5_high + "/\n" + day5_low + getTempLabel();
                    } else {
                        var day5_temp = day5_high + "/" + day5_low + getTempLabel();
                    }
                    var day5_conditions = response.list[n].weather[0].description;
                    var day5_timestamp = response.list[n].dt;
                    //Pebble.sendAppMessage({
                    if (debug_flag > 1) {
                        console.log("day5_high = " + day5_high + ", day5_low = " + day5_low + ", day5_temp = " + day5_temp);
                    }
                    MessageQueue.sendAppMessage({
                                                //
                                                day5_icon: day5_icon,
                                                day5_temp: day5_temp,
                                                day5_conditions: day5_conditions,
                                                day5_timestamp: day5_timestamp
                                                });
                    
                    
                    
                    
                } else {console.log("fail length not zero");}
            } else {console.log("fail 200");}
		} else{console.log("fail 4"); }
	    if (debug_flag > 1) {
            console.log("end onload");
	    }
    };
    req.send(null);
	if (debug_flag > 1) {
        console.log("end function");
	}
}

function fetchWeatherConditions(latitude, longitude) {
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
                    
                    var day0_icon = iconFromWeatherId(response.weather[0].id);
                    var day0_temp = tempGetter(response.main.temp) + getTempLabel();
                    var day0_high = tempGetter(response.main.temp_max) + getTempLabel();
                    var day0_low = tempGetter(response.main.temp_min) + getTempLabel();
                    var day0_conditions = response.weather[0].main;
                    var day0_baro = pressureGetter(response.main.pressure * 0.0295301);
                    var day0_timestamp = response.dt;
					if (debug_flag > -1) {
                        console.log("day0_icon " + day0_icon + " " + day0_temp + " " + day0_conditions + " " + day0_timestamp + " " + day0_baro + getPressureLabel());
					}
					if (debug_flag > 3) {
                        console.log("thinking about sending day0 info");
					}
                    MessageQueue.sendAppMessage({
                                                //Pebble.sendAppMessage({
                                                day0_icon: day0_icon,
                                                day0_temp: day0_temp + "",
                                                day1_temp: day0_high,
                                                day2_temp: day0_low,
                                                //day0_temp: day0_temp + getTempLabel(),
                                                day0_conditions: day0_conditions,
                                                day0_timestamp: day0_timestamp,
                                                day0_baro: day0_baro + getPressureLabel(),
                                                });
                    
                    if (debug_flag > 0) {
                        console.log("day0 info sent");
                        console.log("day0_conditions = " + day0_conditions + ", day0_baro = " + day0_baro);
					}
                    
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
                } else {}
            } else {}
        }
    };
    req.send(null);
}

function fetchWeatherTodayForecast(latitude, longitude) {
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
                    
                    if (debug_flag > 0) {
                        
                        for (var i = 0; i < 25; i++) {
                            //text += cars[i];
                            console.log("forecast description : " + response.list[i].weather[0].description);
                        }
                        
                    }
                    
                    var n = 1;
                    //                    list[n].dt;
                    //                    list[n].main.temp;
                    //                    list[n].main.weather[0]. //(icon 04n, id 803, main "Clouds");
                    var day1_icon = iconFromWeatherId(response.list[n].weather[0].id);
                    var day1_temp = tempGetter(response.list[n].main.temp) + getTempLabel();
                    var day1_timestamp = response.list[n].dt;
                    var day1_conditions = response.list[n].weather[0].description;
					if (debug_flag > 2) {
                        console.log(day1_timestamp);
					}
                    day1_timestamp = parseInt(day1_timestamp) - parseInt (offset * 3600);
					if (debug_flag > -1) {
                        console.log(day1_timestamp);
                        console.log("day1_icon = " + day1_icon + " " + response.list[n].weather[0].id + " " + response.list[n].weather[0].description + " " + day1_temp + " " + day1_timestamp);
                        console.log()
					}
                    
                    MessageQueue.sendAppMessage({
                                                day1_icon: day1_icon,
                                                //day1_temp: day1_temp,
                                                day1_timestamp: day1_timestamp,
                                                day1_conditions: day1_conditions,
                                                });
                    
                    n = 4
                    var day2_icon = iconFromWeatherId(response.list[n].weather[0].id);
                    var day2_temp = tempGetter(response.list[n].main.temp) + getTempLabel();
                    var day2_timestamp = response.list[n].dt;
                    var day2_conditions = response.list[n].weather[0].description;
					if (debug_flag > 2) {
                        console.log(day2_timestamp);
                    }
                    day2_timestamp = parseInt(day2_timestamp) - parseInt (offset * 3600);
					if (debug_flag > -1) {
                        console.log("day2_icon = " + day2_icon + " " + response.list[n].weather[0].id + " " + response.list[n].weather[0].description + " " + day2_temp + " " + day2_timestamp);
                    }
                    
                    MessageQueue.sendAppMessage({
                                                day2_icon: day2_icon,
                                                //day2_temp: day2_temp,
                                                day2_timestamp: day2_timestamp,
                                                day2_conditions: day2_conditions,
                                                });
                    //get conditions for array item 1 and array item 3, that's 3 hours out and 9 hours out
                    // 0 is now to 3, 1 is 3 to 6, 2 is 6 to 9, 3 is 9 to 12, 4 is 12 to 15, etc.
                    
                    //                    var staleDate = new Date(response.dt * 1e3);
                    //                    var days = 0;
                    //                    var difference = 0;
                    //                   var today = new Date();
                    //                    difference = today - staleDate;
                    //                    days = Math.round(difference / (1e3 * 60 * 60 * 24));
                    //				 console.log("offset is " + offset);
                    //var sunrise = response.sys.sunrise;
                    //				 console.log("raw sunrise = " + sunrise);
                    //sunrise = parseInt(sunrise) - parseInt (offset * 3600);
                    //				 console.log("adj sunrise = " + sunrise);
                    //var sunset = response.sys.sunset;
                    //				 console.log("raw sunset = " + sunset);
                    //sunset = parseInt(sunset) - parseInt (offset * 3600);
                    //				 console.log("adgj sunset = " + sunset);
                    
                    
                } else {console.log("fail if responseText.lenght > 100")}
            } else {console.log("fail else req status 200")}
        } else {console.log("fail readyState == 4")}
    };
    req.send(null);
}

function locationSuccess(pos) {
    var coordinates = pos.coords;
    if (debug_flag > 1) {
        console.log("locationSuccess, " + coordinates.latitude + ", " + coordinates.longitude);
    }
    //var latitude = 41.852014;
    //var longitude = 12.577281;
    //fetchWeather(latitude, longitude);
	fetchWeatherForecast(coordinates.latitude, coordinates.longitude);
    fetchWeatherTodayForecast(coordinates.latitude, coordinates.longitude);
	fetchWeatherConditions(coordinates.latitude, coordinates.longitude);
    
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
                        //Pebble.sendAppMessage(JSON.parse(e.response));
                        var responseTextJSON 	= JSON.parse(e.response);
                        var responseText		= e.response;
                        var item = "1";
                        
                        if (debug_flag > 3) {
                        console.log("raw e.response (no JSON.parse) = " + e.response);
                        console.log("1 of 3 payload = " + e.response.item);
                        console.log("2 of 3 responseText = " + responseText);
                        console.log("3 of 3 responseTextJSON = " + responseTextJSON);
                        console.log("responseText.replace = " + responseText);
                        console.log("tempFlag = " + tempFlag);
                        }
                        responseText = responseText.replace("\"1\"", "\"tempUnits\"");
                        responseText = responseText.replace("\"2\"", "\"pressUnits\"");
                        var config = JSON.parse(responseText);
                        tempFlag = config.tempUnits;
                        localStorage.setItem("tempFlag", tempFlag);
                        //localStorage.setItem("tempFlag", JSON.parse(e.response));
                        //console.log("e.response " + e.response);
                        //console.log("JSON.parse(e.response)" + JSON.parse(e.response));
                        //	pseudoFunction();
                        //	locationSuccess(pos);
                        window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
                        
                        }
                        });

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
    } else if (weatherId < 700) { 	// 600-699 defined as snow
        return 8;
    } else if (weatherId < 800) {		// 700-799 is mist, smoke, fog, etc. Return lines
        return 10;						// 900-99 is crazy atmospheric shit,
    } else  if (weatherId == 800 ) {		// 800 is clear
        return 0;
    } else if (weatherId < 804 ) {	// 801, 802, 803 are all partly cloudy
        return 2;
    } else if (weatherId = 804 ) {   // 804 = overcast. Should it be clouds, or lines? I love lines. So, lines. But it shoudl probably be clouds
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