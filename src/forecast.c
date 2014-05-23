#include <pebble.h>
#include "bluetooth.h"
	
//native background white
//inverted background black

// weather underground fm_forecast_stable

Window *window;
//Layer *window_layer; // = window_get_root_layer(window);

BitmapLayer *today_icon_layer;
BitmapLayer *tomorrow_icon_layer;
BitmapLayer *nextday_icon_layer;
BitmapLayer *date_border_layer;

const char *new_location;

TextLayer *today_day_layer;
TextLayer *tomorrow_day_layer;
TextLayer *nextday_day_layer;
TextLayer *today_cond_layer;
TextLayer *today_temp_layer;
TextLayer *tomorrow_cond_layer;
TextLayer *tomorrow_temp_layer;
TextLayer *nextday_cond_layer;
TextLayer *nextday_temp_layer;
TextLayer *time_layer;
TextLayer *date_layer;
TextLayer *location_layer;
TextLayer *bt_layer;

Layer* second_layer;
Layer* power_bar_layer; 
Layer* info_line_layer;
Layer* top_line_layer;
Layer* bottom_line_layer;

//int x, y, w, h; 
int x = 0; 
int y = 37; 
int w = 144; 
int h = 2; 

InverterLayer *inverter_layer;

GBitmap *today_icon_bitmap = NULL;
GBitmap *tomorrow_icon_bitmap = NULL;
GBitmap *nextday_icon_bitmap = NULL;
GBitmap *date_layer_bitmap = NULL;
uint32_t offsetInt = 0;

uint32_t todayInt = 1095345600;
uint32_t tomorrowInt = 1095432000;
uint32_t nextdayInt = 1095518400;
uint32_t sunriseInt = 1095429600 - (3600 * 7);
uint32_t sunsetInt = 1095472800 - (3600 * 7);

AppSync sync;

int 					sunInt;
int 					counter_one;
int 					debug_flag = 1;
int                     night_flag = 1;

uint8_t 				sync_buffer[1024];
const uint32_t			dictSizeInt;
char 				dictSizeString;
const char			*location;
const char			*today_conditions;
const char			*tomorrow_conditions;
const char			*nextday_conditions;
const char			*tomorrow_date_string;
const char			*today_hilo;
const char			*tomorrow_hilo;
const char			*nextday_hilo;

enum WeatherKey {
	WEATHER_DAY0_ICON_KEY		= 10,
	WEATHER_DAY0_TEMP_KEY		= 11, 
	WEATHER_DAY0_CONDITIONS_KEY	= 12, 
	WEATHER_DAY0_TIMESTAMP_KEY	= 13, 
	WEATHER_DAY0_BARO_KEY		= 14,
	
	WEATHER_DAY1_ICON_KEY		= 20,
	WEATHER_DAY1_TEMP_KEY		= 21, 
	WEATHER_DAY1_CONDITIONS_KEY	= 22, 
	WEATHER_DAY1_TIMESTAMP_KEY	= 23, 
		
	WEATHER_DAY2_ICON_KEY		= 30,
	WEATHER_DAY2_TEMP_KEY		= 31, 
	WEATHER_DAY2_CONDITIONS_KEY	= 32, 
	WEATHER_DAY2_TIMESTAMP_KEY	= 33, 
    
	WEATHER_DAY3_ICON_KEY		= 40,
	WEATHER_DAY3_TEMP_KEY		= 41, 
	WEATHER_DAY3_CONDITIONS_KEY	= 42, 
	WEATHER_DAY3_TIMESTAMP_KEY	= 43, 
    
	WEATHER_DAY4_ICON_KEY		= 50,
	WEATHER_DAY4_TEMP_KEY		= 51, 
	WEATHER_DAY4_CONDITIONS_KEY	= 52, 
	WEATHER_DAY4_TIMESTAMP_KEY	= 53, 
    
	WEATHER_DAY5_ICON_KEY		= 60,
	WEATHER_DAY5_TEMP_KEY		= 61, 
	WEATHER_DAY5_CONDITIONS_KEY	= 62, 
	WEATHER_DAY5_TIMESTAMP_KEY	= 63, 
    
	WEATHER_SUNRISE_KEY 		= 70,
	WEATHER_SUNSET_KEY 			= 71,
	WEATHER_LOCATION_KEY 		= 72,
};

static uint32_t WEATHER_ICONS[] = {
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
};

void white_layer_update_callback(Layer *layer, GContext* ctx) {
	graphics_context_set_fill_color(ctx, GColorWhite);
	graphics_fill_rect(ctx, layer_get_bounds(layer), 0, GCornerNone);
}

void black_layer_update_callback(Layer *layer, GContext* ctx) {
	graphics_context_set_fill_color(ctx, GColorBlack);
	graphics_fill_rect(ctx, layer_get_bounds(layer), 0, GCornerNone);
}

static void fetch_message(void) {
    
    //	layer_set_hidden(text_layer_get_layer(build_layer), false);
    //	layer_set_hidden(bitmap_layer_get_layer(comm_status_layer), false);
	
    //	refresh_counter = 0;
    DictionaryIterator *iter;
    app_message_outbox_begin(&iter);
    
    if (iter == NULL) {
        //		layer_set_hidden(text_layer_get_layer(build_layer), false);
        return;
	}
    //	dict_write_end(iter);
	app_message_outbox_send();
}

static void handle_battery(BatteryChargeState charge_state) {	
//	int xPos = charge_state.charge_percent; 
	//int xPos = lclTimeInt % 60; 
//	xPos = (144 * xPos) / 100; 
//	layer_set_frame(power_bar_layer, GRect(xPos, 37, 1, 2));
/*	if (charge_state.is_charging) {

	} else {

	}  */
	
}

static void sync_error_callback(DictionaryResult dict_error, AppMessageResult app_message_error, void *context) {
    //APP_LOG(APP_LOG_LEVEL_DEBUG, "App Message Sync Error: %d", app_message_error);
	//APP_LOG(APP_LOG_LEVEL_DEBUG, "Got error: %s", translate_error(app_message_error));
}

static void send_cmd(void) {
    Tuplet value = TupletInteger(1, 1);
    
    DictionaryIterator *iter;
    app_message_outbox_begin(&iter);
    
    if (iter == NULL) {
        return;
    }
    
    dict_write_tuplet(iter, &value);
    dict_write_end(iter);
    
    app_message_outbox_send();
}

int countChar(char *s)
{
	int len = 0;
	for(; *s != '\0'; s++, len++);
	return len;
}

static void sync_tuple_changed_callback(const uint32_t key, const Tuple* new_tuple, const Tuple* old_tuple, void* context) {
	//GFont custom_font_temp		= fonts_get_system_font(FONT_KEY_FONT_FALLBACK);
	GFont custom_font_tinytemp 	= fonts_get_system_font(FONT_KEY_GOTHIC_18);
	GFont custom_font_temp 		= fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD);

	
	switch (key) {
            
		case WEATHER_DAY3_TIMESTAMP_KEY:
            todayInt = new_tuple->value->uint32;
        if (debug_flag > 2) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY3_TIMESTAMP_KEY %lu", new_tuple->value->uint32);
        }
            break;
            
		case WEATHER_DAY4_TIMESTAMP_KEY:
            tomorrowInt = new_tuple->value->uint32;
        if (debug_flag > 2) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY4_TIMESTAMP_KEY %lu", new_tuple->value->uint32);
        }
            break;
            
		case WEATHER_DAY5_TIMESTAMP_KEY:
            nextdayInt = new_tuple->value->uint32;
        if (debug_flag > 2) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY5_TIMESTAMP_KEY %lu", new_tuple->value->uint32);
        }
            break;
            
		case WEATHER_DAY3_CONDITIONS_KEY:
            text_layer_set_text(today_cond_layer, new_tuple->value->cstring);
            today_conditions = new_tuple->value->cstring;
        if (debug_flag > 2) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY3_CONDITIONS_KEY %s", new_tuple->value->cstring);
        }
            break;
            
		case WEATHER_DAY4_CONDITIONS_KEY:
            text_layer_set_text(tomorrow_cond_layer, new_tuple->value->cstring);
            tomorrow_conditions = new_tuple->value->cstring;
        if (debug_flag > 2) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY4_CONDITIONS_KEY %s", new_tuple->value->cstring);
        }
            break;
            
		case WEATHER_DAY5_CONDITIONS_KEY:
            text_layer_set_text(nextday_cond_layer, new_tuple->value->cstring);
            nextday_conditions = new_tuple->value->cstring;
        if (debug_flag > 2) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY5_CONDITIONS_KEY %s", new_tuple->value->cstring);
        }
            break;
            
		case WEATHER_DAY3_ICON_KEY:
            if (today_icon_bitmap) {
				gbitmap_destroy(today_icon_bitmap);
            }
            bitmap_layer_set_bitmap(today_icon_layer, today_icon_bitmap);
            today_icon_bitmap = gbitmap_create_with_resource(WEATHER_ICONS[new_tuple->value->uint32 + night_flag]);
        if (debug_flag > 5) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY3_ICON_KEY %lu + night_flag %d", new_tuple->value->uint32, night_flag);
        }
            break;
            
		case WEATHER_DAY4_ICON_KEY:
            if (tomorrow_icon_bitmap) {
				gbitmap_destroy(tomorrow_icon_bitmap);
            }
            bitmap_layer_set_bitmap(tomorrow_icon_layer, tomorrow_icon_bitmap);
            tomorrow_icon_bitmap = gbitmap_create_with_resource(WEATHER_ICONS[new_tuple->value->uint32 + night_flag]);
        if (debug_flag > 5) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY4_ICON_KEY %lu + night_flag %d", new_tuple->value->uint32, night_flag);
        }
            break;
            
		case WEATHER_DAY5_ICON_KEY:
            if (nextday_icon_bitmap) {
				gbitmap_destroy(nextday_icon_bitmap);
            }
            bitmap_layer_set_bitmap(nextday_icon_layer, nextday_icon_bitmap);
            nextday_icon_bitmap = gbitmap_create_with_resource(WEATHER_ICONS[new_tuple->value->uint32 + night_flag]);
        if (debug_flag > 5) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY5_ICON_KEY %lu + night_flag %d", new_tuple->value->uint32, night_flag);
        }
            break;
            
		case WEATHER_DAY3_TEMP_KEY:
		today_hilo = new_tuple->value->cstring;
		static char todayHiLoCounter[32];            
		strcpy(todayHiLoCounter, today_hilo);
		int today_hilo_count = countChar(todayHiLoCounter);
		text_layer_set_text(today_temp_layer, new_tuple->value->cstring);
        if (debug_flag > 11) {
           APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY3_TEMP_KEY %s", new_tuple->value->cstring);
           APP_LOG(APP_LOG_LEVEL_DEBUG, "STRING %s has %d characters", today_hilo, today_hilo_count);
        }
        
		if (today_hilo_count > 9) {
	text_layer_set_font(today_temp_layer, custom_font_tinytemp);
	text_layer_set_font(tomorrow_temp_layer, custom_font_tinytemp);
	text_layer_set_font(nextday_temp_layer, custom_font_tinytemp);
		} else if (today_hilo_count <= 9) {
	text_layer_set_font(today_temp_layer, custom_font_temp);
	text_layer_set_font(tomorrow_temp_layer, custom_font_temp);
	text_layer_set_font(nextday_temp_layer, custom_font_temp);
		}
		break;
            
		case WEATHER_DAY4_TEMP_KEY:
            tomorrow_hilo = new_tuple->value->cstring;
            text_layer_set_text(tomorrow_temp_layer, new_tuple->value->cstring);
        if (debug_flag > 11) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY4_TEMP_KEY %s", new_tuple->value->cstring);
        }
            break;
            
		case WEATHER_DAY5_TEMP_KEY:
            nextday_hilo = new_tuple->value->cstring;
            text_layer_set_text(nextday_temp_layer, new_tuple->value->cstring);
        if (debug_flag > 11) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY5_TEMP_KEY %s", new_tuple->value->cstring);
        }
        break;
			
		case WEATHER_LOCATION_KEY:
            new_location = new_tuple->value->cstring;
            text_layer_set_text(location_layer, new_location);
        if (debug_flag > 2) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_LOCATION_KEY %s", new_tuple->value->cstring);
        }
            static char location_counter[32];  //= "White Center";
            strcpy(location_counter, new_location);
            int charCount = countChar(location_counter);
		int changer = 10;
        if (debug_flag > 10) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "STRING [02] %s has %d characters", location_counter, charCount);
        }

            if (charCount < 10 ) {
                GFont custom_font_large_location = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_TAHOMA_BOLD_28));
                text_layer_set_font(location_layer, custom_font_large_location);
                if (debug_flag > 10) {
                APP_LOG(APP_LOG_LEVEL_DEBUG, "charCount %d reads less than 10", charCount);
                APP_LOG(APP_LOG_LEVEL_DEBUG, "setting location_layer, custom_font_large_location");
                APP_LOG(APP_LOG_LEVEL_DEBUG, "setting ocation_layer, GTextOverflowModeTrailingEllipsis");
                }
                layer_set_frame(text_layer_get_layer(location_layer), (GRect(-10, 115+changer, 164, 35)));
                
                text_layer_set_overflow_mode(location_layer, GTextOverflowModeTrailingEllipsis);
            } else if (charCount < 16) {
                if (debug_flag > 10) {
                APP_LOG(APP_LOG_LEVEL_DEBUG, "charCount %d reads greater than 10 less than 16", charCount);
                }
                text_layer_set_overflow_mode(location_layer, GTextOverflowModeWordWrap);
                GFont custom_font_small_location = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_TAHOMA_BOLD_18));
                //GFont custom_font_small_location = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_ARIAL_22));
                text_layer_set_font(location_layer, custom_font_small_location);
                layer_set_frame(text_layer_get_layer(location_layer), (GRect(0, 122+changer, 144, 100)));
                if (debug_flag > 10) {
                APP_LOG(APP_LOG_LEVEL_DEBUG, "setting location_layer, custom_font_small_location");
                APP_LOG(APP_LOG_LEVEL_DEBUG, "setting ocation_layer, GTextOverflowModeWordWrap");
                }
            } else
            {
                if (debug_flag > 10) {
                APP_LOG(APP_LOG_LEVEL_DEBUG, "charCount %d reads 17 or more", charCount);
                APP_LOG(APP_LOG_LEVEL_DEBUG, "setting location_layer, custom_font_tiny_location");
                APP_LOG(APP_LOG_LEVEL_DEBUG, "setting ocation_layer, GTextOverflowModeWordWrap");
                }
                GFont custom_font_tiny_location = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_ARIAL_BOLD_16));
                text_layer_set_font(location_layer, custom_font_tiny_location);
                layer_set_frame(text_layer_get_layer(location_layer), (GRect(0, 125+changer, 144, 100)));
                text_layer_set_overflow_mode(location_layer, GTextOverflowModeWordWrap);
            }
        if (debug_flag > 4) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "exiting location charCount if/then stack");
        }
            break;
            
		case WEATHER_SUNRISE_KEY:
            sunriseInt = new_tuple->value->uint32;
        if (debug_flag > 2) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "sunriseInt: %lu", sunriseInt);
        }
            break;
            
		case WEATHER_SUNSET_KEY:
            sunsetInt = new_tuple->value->uint32;
        if (debug_flag > 2) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "sunsetInt: %lu", sunsetInt);
        }
            break;
	}
}

void handle_hour_tick() {
	
}

void handle_minute_tick() {
	
	time_t lclTime = time(NULL);
	uint32_t lclTimeInt = lclTime;
	uint32_t zuluTimeInt = lclTime + (60*60*offsetInt);
	time_t zuluTime = zuluTimeInt;
	struct tm *timer_tm; //(zuluTime, zulu_time);
	timer_tm = localtime (&zuluTime);
	////APP_LOG(APP_LOG_LEVEL_DEBUG, "time_t gmt = time(NULL) %lu", gmt);
	////APP_LOG(APP_LOG_LEVEL_DEBUG, "time_t nowInt = time(NULL) %lu", nowInt);
    //	uint32_t diffInt;
    //	diffInt = nowInt - staleInt;
	////APP_LOG(APP_LOG_LEVEL_DEBUG, "sunInt");
	////APP_LOG(APP_LOG_LEVEL_DEBUG, "%d", sunInt);
	char displayTimeString[32];
	strftime(displayTimeString, sizeof(displayTimeString), "%A %l:%M%P", timer_tm);
	////APP_LOG(APP_LOG_LEVEL_DEBUG, "zulu Time rendered is %s", displayTimeString);
	timer_tm = localtime (&lclTime);
	strftime(displayTimeString, sizeof(displayTimeString), "%A %l:%M%P", timer_tm);
	////APP_LOG(APP_LOG_LEVEL_DEBUG, "local Time rendered is %s", displayTimeString);
    
	////APP_LOG(APP_LOG_LEVEL_DEBUG, "sunriseInt = %lu", sunriseInt);
	time_t display_time_t = sunriseInt;
	timer_tm = localtime (&display_time_t);
    //	char displayTimeString[32];
	strftime(displayTimeString, sizeof(displayTimeString), "%A %l:%M%P", timer_tm);
    if (debug_flag > 0) {
	APP_LOG(APP_LOG_LEVEL_DEBUG, "GMT sunrise: %s", displayTimeString);
    APP_LOG(APP_LOG_LEVEL_DEBUG, "adjusted sunrise %s, and adjusted sunriseInt %% 86400 %lu", displayTimeString, (sunriseInt % 86400));
	}
	uint32_t localSunriseInt = sunriseInt - (3600*offsetInt);
	display_time_t = localSunriseInt;
	timer_tm = localtime (&display_time_t);
	strftime(displayTimeString, sizeof(displayTimeString), "%A %l:%M%P", timer_tm);
	
	//display_time_t = staleInt;
	//timer_tm = localtime(&display_time_t);
	//strftime(displayTimeString, sizeof(displayTimeString), "%A %l:%M%P", timer_tm);
	////APP_LOG(APP_LOG_LEVEL_DEBUG, "RAW stale time: %s", displayTimeString);
	
	
	//uint32_t localStaleInt = staleInt - (3600*offsetInt);
	//display_time_t = localStaleInt;
	//timer_tm = localtime (&display_time_t);
	//strftime(displayTimeString, sizeof(displayTimeString), "%A %l:%M%P", timer_tm);
	////APP_LOG(APP_LOG_LEVEL_DEBUG, "adjusted stale time: %s", displayTimeString);
	
	//change zulu sunset into a local sunset
    
	uint32_t localSunsetInt = sunsetInt - (3600*offsetInt);
	display_time_t = localSunsetInt;
	timer_tm = localtime (&display_time_t);
	strftime(displayTimeString, sizeof(displayTimeString), "%A %l:%M%P", timer_tm);
	//APP_LOG(APP_LOG_LEVEL_DEBUG, "adjusted sunset %s, and adjusted sunsetInt %% 86400 %lu", displayTimeString, (sunsetInt % 86400));
	
    //	if ( lclTimeInt % 86400 > (sunsetInt - (3600*offsetInt)) % 86400  )  	{    //invert if after sunset
	if ( lclTimeInt % 86400 > localSunsetInt % 86400  )  	{    //invert if after sunset
        layer_set_hidden((inverter_layer_get_layer(inverter_layer)), false);
		night_flag = 1; //set night flag to night
		////APP_LOG(APP_LOG_LEVEL_DEBUG, "after sunset!");
		//APP_LOG(APP_LOG_LEVEL_DEBUG, "sunset %lu > now %lu", (lclTimeInt % 86400) / 3600, (sunsetInt - (3600*offsetInt)) % 86400 / 3600);
		////APP_LOG(APP_LOG_LEVEL_DEBUG, "now %lu > sunset %lu", (lclTimeInt % 86400) / 3600, (localSunsetInt % 86400) / 3600);
	} else if ( lclTimeInt % 86400 < localSunriseInt % 86400 )  {   //invert if before sunrise
		layer_set_hidden((inverter_layer_get_layer(inverter_layer)), false);
		night_flag = 1; //set flag to night
		////APP_LOG(APP_LOG_LEVEL_DEBUG, "before sunrise!");
		//APP_LOG(APP_LOG_LEVEL_DEBUG, "now %lu < sunrise %lu", (lclTimeInt % 86400) / 3600, (localSunriseInt % 86400) / 3600);
        //				(sunriseInt - (3600*offsetInt)) % 86400 / 3600);
        
        
	} else {		//it must be daytime! Hide inverter layer
    	layer_set_hidden((inverter_layer_get_layer(inverter_layer)), true);
		night_flag = 0; //set night flag to day
		////APP_LOG(APP_LOG_LEVEL_DEBUG, "must be day!");
        //APP_LOG(APP_LOG_LEVEL_DEBUG, "sunrise %lu < now %lu > sunset %lu",
        //				(sunriseInt - (3600*offsetInt)) % 86400 / 3600,
        //				(lclTimeInt % 86400) / 3600,
        //				(sunsetInt - (3600*offsetInt)) % 86400 / 3600 );
		//APP_LOG(APP_LOG_LEVEL_DEBUG, "sunrise %lu < now %lu > sunset %lu", (localSunriseInt % 86400) / 3600, (lclTimeInt % 86400) / 3600, (localSunsetInt % 86400) / 3600);
        
        /*	if (sunInt <= 7) {
         ////APP_LOG(APP_LOG_LEVEL_DEBUG, "sunInt %d <= 7", sunInt);
         night_flag = 1;
         layer_set_hidden(inverter_layer_get_layer(inverter_layer), false);
         
         } else if (sunInt >= 19) {
         ////APP_LOG(APP_LOG_LEVEL_DEBUG, "sunInt %d >= 19", sunInt);
         night_flag = 1;
         layer_set_hidden(inverter_layer_get_layer(inverter_layer), false);
         } else {
         ////APP_LOG(APP_LOG_LEVEL_DEBUG, "7 <= sunInt %d >= 19", sunInt);
         night_flag = 0;
         layer_set_hidden(inverter_layer_get_layer(inverter_layer), true);
         
         } */
		if (lclTimeInt % 3600 == 0) {
			handle_hour_tick();
        }
		fetch_message();
    }
}

static void handle_second_tick(struct tm* tick_time, TimeUnits units_changed) {

//	handle_battery(battery_state_service_peek());
	
	static char time_text[] = "00:00AAA"; // Needs to be static because it's used by the system later. "%l:%M %y"
	strftime(time_text, sizeof(time_text), "%l:%M%P", tick_time);
	text_layer_set_text(time_layer, time_text);
	
	strftime(time_text, sizeof(time_text), "%H", tick_time);
    //	////APP_LOG(APP_LOG_LEVEL_DEBUG, time_text);
	
	static char date_text[] = "00/00";
	strftime(date_text, sizeof(date_text), "%d", tick_time);
	text_layer_set_text(date_layer, date_text);
    
    //snip begin
    
    //	static char date_text[] = "00/00";
	strftime(date_text, sizeof(date_text), "%d", tick_time);
	text_layer_set_text(date_layer, date_text);
	
    //	static int sunInt = atoi(time_text);
    //	////APP_LOG(APP_LOG_LEVEL_DEBUG, "sunInt");
    //	////APP_LOG(APP_LOG_LEVEL_DEBUG, "%d", sunInt);
    //	static char date_text[] = "00/00";
	static char day_text[] = "aaa";
	static char day1_text[] = "aaa";
	static char day2_text[] = "aaa";
	
	time_t current   = time(0);
    //	time_t inOneDay = current + (60*60*24); // 60 minutes of 60 sec.
    //	time_t inTwoDays = current + (60*60*48);
	
    //uint32_t todayInt = 1395345600;
    //uint32_t tomorrowInt = 1395432000;
    //uint32_t nextdayInt = 1395518400;
	
    //	time_t current   = time(1395345600);
    //	time_t inOneDay = time(1395432000); // 60 minutes of 60 sec.
    //	time_t inTwoDays = time(1395432000);
    
    //	time_t current   	= 1395345600 + (offset*3600);
    //	time_t inOneDay 	= 1395432000 + (offset*3600); // 60 minutes of 60 sec.
    //	time_t inTwoDays 	= 1395432000 + (offset*3600);
	
	time_t today   		= todayInt 		- (offsetInt*3600);
	time_t inOneDay 	= tomorrowInt	- (offsetInt*3600); // 60 minutes of 60 sec.
	time_t inTwoDays 	= nextdayInt	- (offsetInt*3600);
	struct tm *timer_tm;
	timer_tm = localtime (&today);
	strftime(day_text, sizeof(day_text), "%a", timer_tm);
	text_layer_set_text(today_day_layer, day_text);
	if (debug_flag > 8) {
		APP_LOG(APP_LOG_LEVEL_DEBUG, "day[0]text: %s", day_text);
		APP_LOG(APP_LOG_LEVEL_DEBUG, "day[0]Int = %lu", todayInt);
	}
	strftime(time_text, sizeof(time_text), "%l:%M%P", timer_tm);
	////APP_LOG(APP_LOG_LEVEL_DEBUG, time_text);
	timer_tm = localtime (&current);
	strftime(time_text, sizeof(time_text), "%l:%M%P", timer_tm);
	////APP_LOG(APP_LOG_LEVEL_DEBUG, time_text);
    
	
	timer_tm = localtime (&inOneDay);
	strftime(day1_text, sizeof(day1_text), "%a", timer_tm);
	text_layer_set_text(tomorrow_day_layer, day1_text);
		
	if (debug_flag > 8) {
		APP_LOG(APP_LOG_LEVEL_DEBUG, "day[1]text: %s", day1_text);
		APP_LOG(APP_LOG_LEVEL_DEBUG, "day[1]Int = %lu", tomorrowInt);
	}
	timer_tm = localtime (&inTwoDays);
	strftime(day2_text, sizeof(day2_text), "%a", timer_tm);
	text_layer_set_text(nextday_day_layer, day2_text);
	if (debug_flag > 8) {
		APP_LOG(APP_LOG_LEVEL_DEBUG, "day[2]text %s", day2_text);
		APP_LOG(APP_LOG_LEVEL_DEBUG, "day[2]Int = %lu", nextdayInt);
	}
	//snip end
    
	time_t nowInt = time(NULL);
	if (nowInt % 60 == 0 ) {
		handle_minute_tick();
	}
	if (debug_flag > 8) {
	APP_LOG(APP_LOG_LEVEL_DEBUG, "%lu", (nowInt % 12));
	}
	
	if (nowInt % 12 == 0) {
		if (debug_flag > 8) {
			APP_LOG(APP_LOG_LEVEL_DEBUG, "show day!");
		}
		layer_set_hidden(text_layer_get_layer(today_temp_layer), true);
		layer_set_hidden(text_layer_get_layer(tomorrow_temp_layer), true);
		layer_set_hidden(text_layer_get_layer(nextday_temp_layer), true);
		layer_set_hidden(text_layer_get_layer(today_cond_layer), true);
		layer_set_hidden(text_layer_get_layer(tomorrow_cond_layer), true);
		layer_set_hidden(text_layer_get_layer(nextday_cond_layer), true);
		layer_set_hidden(text_layer_get_layer(today_day_layer), false);
		layer_set_hidden(text_layer_get_layer(tomorrow_day_layer), false);
		layer_set_hidden(text_layer_get_layer(nextday_day_layer), false);
        
	} else if (nowInt % 12 == 4) {
		if (debug_flag > 8) {
			APP_LOG(APP_LOG_LEVEL_DEBUG, "show conditions!");
		}
		layer_set_hidden(text_layer_get_layer(today_temp_layer), true);
		layer_set_hidden(text_layer_get_layer(tomorrow_temp_layer), true);
		layer_set_hidden(text_layer_get_layer(nextday_temp_layer), true);
		layer_set_hidden(text_layer_get_layer(today_cond_layer), false);
		layer_set_hidden(text_layer_get_layer(tomorrow_cond_layer), false);
		layer_set_hidden(text_layer_get_layer(nextday_cond_layer), false);
		layer_set_hidden(text_layer_get_layer(today_day_layer), true);
		layer_set_hidden(text_layer_get_layer(tomorrow_day_layer), true);
		layer_set_hidden(text_layer_get_layer(nextday_day_layer), true);
        
	} else if (nowInt % 12 == 8) {
		if (debug_flag > 8) {
			APP_LOG(APP_LOG_LEVEL_DEBUG, "show temperature!");
		}
		layer_set_hidden(text_layer_get_layer(today_temp_layer), false);
		layer_set_hidden(text_layer_get_layer(tomorrow_temp_layer), false);
		layer_set_hidden(text_layer_get_layer(nextday_temp_layer), false);
		layer_set_hidden(text_layer_get_layer(today_cond_layer), true);
		layer_set_hidden(text_layer_get_layer(tomorrow_cond_layer), true);
		layer_set_hidden(text_layer_get_layer(nextday_cond_layer), true);
		layer_set_hidden(text_layer_get_layer(today_day_layer), true);
		layer_set_hidden(text_layer_get_layer(tomorrow_day_layer), true);
		layer_set_hidden(text_layer_get_layer(nextday_day_layer), true);
	}
}

void infolines_init(void) {
	//to call infolines_init(); 
	Layer *window_layer = window_get_root_layer(window);
	
	info_line_layer = layer_create(GRect(x, y, w, h));
	layer_set_update_proc(info_line_layer, black_layer_update_callback);
	
	top_line_layer = layer_create(GRect(x, y-1, w, h-1));
	layer_set_update_proc(top_line_layer, black_layer_update_callback);
	
	bottom_line_layer = layer_create(GRect(x, y+2, w, h-1));
	layer_set_update_proc(bottom_line_layer, black_layer_update_callback);
	
	layer_set_hidden(top_line_layer, true);
	layer_set_hidden(bottom_line_layer, true);

	second_layer = layer_create(GRect(-1, -1, 0, 0)); 
	layer_set_update_proc(second_layer, white_layer_update_callback); 
	
	power_bar_layer = layer_create(GRect(-1, -1, 0, 0));
	layer_set_update_proc(power_bar_layer, white_layer_update_callback);  

	layer_add_child(window_layer, top_line_layer);
	layer_add_child(window_layer, bottom_line_layer); //
	layer_add_child(window_layer, info_line_layer);
	layer_add_child(window_layer, power_bar_layer); 
	layer_add_child(window_layer, second_layer);
	

}

static void window_load(Window *window) {
	
	Tuplet initial_values[] = {
		TupletInteger(WEATHER_DAY3_ICON_KEY, (int) 1 + night_flag),
		TupletInteger(WEATHER_DAY4_ICON_KEY, (int) 1 + night_flag),
		TupletInteger(WEATHER_DAY5_ICON_KEY, (int) 1 + night_flag),
		TupletCString(WEATHER_DAY3_TEMP_KEY, " H/L "),
		TupletCString(WEATHER_DAY4_TEMP_KEY, " H/L "),
		TupletCString(WEATHER_DAY5_TEMP_KEY, " H/L "),
		TupletCString(WEATHER_DAY3_CONDITIONS_KEY, "lava"),
		TupletCString(WEATHER_DAY4_CONDITIONS_KEY, "fire"),
		TupletCString(WEATHER_DAY5_CONDITIONS_KEY, "hail"),
		TupletInteger(WEATHER_DAY3_TIMESTAMP_KEY, (int) 1095345600),
		TupletInteger(WEATHER_DAY4_TIMESTAMP_KEY, (int) 1095432000),
		TupletInteger(WEATHER_DAY5_TIMESTAMP_KEY, (int) 1095518400),
		TupletCString(WEATHER_LOCATION_KEY, "open weather map.org"),
		TupletInteger(WEATHER_SUNRISE_KEY, (int) 1095429600), //1395410913 ),
		TupletInteger(WEATHER_SUNSET_KEY, (int) 1095472800), //1395455062 ),
        
        //uint32_t sunriseInt = 1095429600;
        //uint32_t sunsetInt = 1095472800;
	};
	
    Layer *window_layer = window_get_root_layer(window);
	
    //	int hite = 58;
	int hite = 43;
	int w_size = 48;
	int h_size = 50;
	int downset = -1; //perfect for ARIAL_15
    //	int downset = -5; //This is for GOTHIC 24
	int downTempSet = -2; //This is for GOTHIC 18
	int dayhite = 15;
		
	bt_layer = text_layer_create(GRect(2, 41, 15, 19));
	
	text_layer_set_text_alignment(bt_layer, GTextAlignmentCenter);
	text_layer_set_background_color(bt_layer, GColorBlack);
	text_layer_set_text_color(bt_layer, GColorWhite);
	text_layer_set_font(bt_layer, fonts_get_system_font(FONT_KEY_GOTHIC_14_BOLD));
	text_layer_set_text(bt_layer, "B");
	
	time_layer = text_layer_create(GRect(0, 1, 144 * .75, 50));
	date_layer = text_layer_create(GRect(92+4, -1, 52, 32));
	location_layer = text_layer_create(GRect(0, 111-3, 144, 100));
	  
	//GRect X, Y, Width, Height
	
	today_icon_layer 		= bitmap_layer_create(GRect(0, hite, w_size, h_size));
	tomorrow_icon_layer		= bitmap_layer_create(GRect(48, hite, w_size, h_size));
	nextday_icon_layer 		= bitmap_layer_create(GRect(96, hite, w_size, h_size));
	today_day_layer 		= text_layer_create(GRect(0, hite + h_size + downset, w_size, h_size));
	tomorrow_day_layer 		= text_layer_create(GRect(48, hite + h_size + downset, w_size, h_size));
	nextday_day_layer 		= text_layer_create(GRect(96, hite + h_size + downset, w_size, h_size));
	
	today_cond_layer 		= text_layer_create(GRect(0, hite + h_size + downset, w_size, h_size-30));
	tomorrow_cond_layer		= text_layer_create(GRect(48, hite + h_size + downset, w_size, h_size-30));
	nextday_cond_layer 		= text_layer_create(GRect(96, hite + h_size + downset, w_size, h_size-30));
    
	today_temp_layer 		= text_layer_create(GRect(0-50, hite + h_size + downTempSet, w_size+100, h_size+100));
	tomorrow_temp_layer		= text_layer_create(GRect(48-50, hite + h_size + downTempSet, w_size+100, h_size));
	nextday_temp_layer 		= text_layer_create(GRect(96-50, hite + h_size + downTempSet, w_size+100, h_size));
	
	text_layer_set_text_alignment(today_temp_layer, GTextAlignmentCenter);
	text_layer_set_text_alignment(tomorrow_temp_layer, GTextAlignmentCenter);
	text_layer_set_text_alignment(nextday_temp_layer, GTextAlignmentCenter);
	
//	text_layer_set_overflow_mode(today_temp_layer, GTextOverflowModeFill);
	text_layer_set_overflow_mode(today_temp_layer, GTextOverflowModeWordWrap);
	text_layer_set_overflow_mode(tomorrow_temp_layer, GTextOverflowModeWordWrap);
	text_layer_set_overflow_mode(nextday_temp_layer, GTextOverflowModeWordWrap);
	
	text_layer_set_background_color(today_temp_layer, GColorClear);
	text_layer_set_background_color(tomorrow_temp_layer, GColorClear);
	text_layer_set_background_color(nextday_temp_layer, GColorClear);
	
	date_border_layer 		= bitmap_layer_create(GRect(99+4, 1, 38, 35));
	
	bitmap_layer_set_background_color(today_icon_layer, GColorClear);
	bitmap_layer_set_background_color(tomorrow_icon_layer, GColorClear);
	bitmap_layer_set_background_color(nextday_icon_layer, GColorClear);
	bitmap_layer_set_background_color(date_border_layer, GColorClear);
	bitmap_layer_set_alignment(today_icon_layer, GAlignCenter);
	bitmap_layer_set_alignment(tomorrow_icon_layer, GAlignCenter);
	bitmap_layer_set_alignment(nextday_icon_layer, GAlignCenter);
	
	today_icon_bitmap = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_CLOUD);
	tomorrow_icon_bitmap = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_CLOUD);
	nextday_icon_bitmap = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_CLOUD);
	date_layer_bitmap = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_DATE_BORDER);
	
	bitmap_layer_set_bitmap(today_icon_layer, today_icon_bitmap);
	bitmap_layer_set_bitmap(tomorrow_icon_layer, tomorrow_icon_bitmap);
	bitmap_layer_set_bitmap(nextday_icon_layer, nextday_icon_bitmap);
	bitmap_layer_set_bitmap(date_border_layer, date_layer_bitmap);
	
	text_layer_set_text_alignment(today_cond_layer, GTextAlignmentCenter);
	text_layer_set_text_alignment(tomorrow_cond_layer, GTextAlignmentCenter);
	text_layer_set_text_alignment(nextday_cond_layer, GTextAlignmentCenter);
	text_layer_set_text_alignment(today_day_layer, GTextAlignmentCenter);
	text_layer_set_text_alignment(tomorrow_day_layer, GTextAlignmentCenter);
	text_layer_set_text_alignment(nextday_day_layer, GTextAlignmentCenter);
	
	text_layer_set_overflow_mode(today_cond_layer, GTextOverflowModeFill);
	text_layer_set_overflow_mode(tomorrow_cond_layer, GTextOverflowModeFill);
	text_layer_set_overflow_mode(nextday_cond_layer, GTextOverflowModeFill);
	text_layer_set_background_color(today_cond_layer, GColorClear);
	text_layer_set_background_color(tomorrow_cond_layer, GColorClear);
	text_layer_set_background_color(nextday_cond_layer, GColorClear);	
	
	GFont custom_font_status = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_ARIAL_17));
	GFont custom_font_temp 		= fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD);
	text_layer_set_font(today_cond_layer, custom_font_status);
	text_layer_set_font(tomorrow_cond_layer, custom_font_status);
	text_layer_set_font(nextday_cond_layer, custom_font_status);
	text_layer_set_font(today_temp_layer, custom_font_temp);
	text_layer_set_font(tomorrow_temp_layer, custom_font_temp);
	text_layer_set_font(nextday_temp_layer, custom_font_temp);
	text_layer_set_font(today_day_layer, custom_font_status);
	text_layer_set_font(tomorrow_day_layer, custom_font_status);
	text_layer_set_font(nextday_day_layer, custom_font_status);
	
	text_layer_set_background_color(time_layer, GColorClear);
	text_layer_set_text_alignment(time_layer, GTextAlignmentLeft);
	GFont custom_font_time = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_TAHOMA_BOLD_28));
	text_layer_set_font(time_layer, custom_font_time);
	text_layer_set_overflow_mode(time_layer, GTextOverflowModeFill);
	
	text_layer_set_background_color(date_layer, GColorClear);
	text_layer_set_text_alignment(date_layer, GTextAlignmentCenter);
	text_layer_set_font(date_layer, fonts_get_system_font(FONT_KEY_GOTHIC_28));
	
	text_layer_set_text_color(location_layer, GColorBlack);
	text_layer_set_background_color(location_layer, GColorClear);
	text_layer_set_font(location_layer, custom_font_time);
  	text_layer_set_text_alignment(location_layer, GTextAlignmentCenter);
		    
	layer_add_child(window_layer, text_layer_get_layer(today_cond_layer));
	layer_add_child(window_layer, text_layer_get_layer(tomorrow_cond_layer));
	layer_add_child(window_layer, text_layer_get_layer(nextday_cond_layer));
	
	layer_add_child(window_layer, text_layer_get_layer(today_temp_layer));
	layer_add_child(window_layer, text_layer_get_layer(tomorrow_temp_layer));
	layer_add_child(window_layer, text_layer_get_layer(nextday_temp_layer));
	
	layer_add_child(window_layer, text_layer_get_layer(today_day_layer));
	layer_add_child(window_layer, text_layer_get_layer(tomorrow_day_layer));
	layer_add_child(window_layer, text_layer_get_layer(nextday_day_layer));
	
	layer_add_child(window_layer, text_layer_get_layer(time_layer));
	layer_add_child(window_layer, bitmap_layer_get_layer(date_border_layer));
	layer_add_child(window_layer, text_layer_get_layer(date_layer));
	
	layer_add_child(window_layer, bitmap_layer_get_layer(today_icon_layer));
	layer_add_child(window_layer, bitmap_layer_get_layer(tomorrow_icon_layer));
	layer_add_child(window_layer, bitmap_layer_get_layer(nextday_icon_layer));
	
	layer_add_child(window_layer, text_layer_get_layer(bt_layer));
	layer_set_hidden(text_layer_get_layer(bt_layer), true);
	
	layer_add_child(window_layer, text_layer_get_layer(location_layer));
	app_sync_init(&sync, sync_buffer, sizeof(sync_buffer), initial_values, ARRAY_LENGTH(initial_values),
	sync_tuple_changed_callback, sync_error_callback, NULL);
	
	inverter_layer = inverter_layer_create(GRect(0, 0, 144, 168));
	layer_set_hidden(inverter_layer_get_layer(inverter_layer), true);
	layer_add_child(window_layer, inverter_layer_get_layer(inverter_layer));
    
	send_cmd();
	tick_timer_service_subscribe(SECOND_UNIT, &handle_second_tick);
	handle_minute_tick();
	handle_hour_tick();
	bluetooth_connection_service_subscribe(&handle_bluetooth);
}

static void window_unload(Window *window) {
	if (today_icon_bitmap) {gbitmap_destroy(today_icon_bitmap);}
	if (tomorrow_icon_bitmap) {gbitmap_destroy(tomorrow_icon_bitmap);}
	if (nextday_icon_bitmap) {gbitmap_destroy(nextday_icon_bitmap);}
	text_layer_destroy(bt_layer); 
	text_layer_destroy(time_layer);
	text_layer_destroy(date_layer);
	text_layer_destroy(location_layer);
	text_layer_destroy(today_day_layer);
	text_layer_destroy(tomorrow_day_layer);
	text_layer_destroy(nextday_day_layer);
	text_layer_destroy(today_cond_layer);
	text_layer_destroy(tomorrow_cond_layer);
	text_layer_destroy(nextday_cond_layer);
	text_layer_destroy(today_temp_layer);
	text_layer_destroy(tomorrow_temp_layer);
	text_layer_destroy(nextday_temp_layer);
	bitmap_layer_destroy(date_border_layer); 
	inverter_layer_destroy(inverter_layer); 
}


void handle_init(void) {
	window = window_create();
	window_set_fullscreen(window, true); 
	window_set_window_handlers(window, (WindowHandlers) {
		.load = window_load,
		.unload = window_unload,  });
	const int inbound_size = 1024;
	const int outbound_size = 1024;
	app_message_open(inbound_size, outbound_size);
	window_stack_push(window, true /* Animated */);
}
void infolines_deinit(void) {
	//to call infolines_deinit(); 
	layer_destroy(top_line_layer);
	layer_destroy(bottom_line_layer); //
	layer_destroy(info_line_layer);
	layer_destroy(power_bar_layer); 
	layer_destroy(second_layer);
}

void handle_deinit(void) {
	infolines_deinit(); 
    window_destroy(window);
}

int main(void) {
    handle_init();
    app_event_loop();
    handle_deinit();
}
