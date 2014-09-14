#include <pebble.h>
#include "bluetooth.h"
#include "forecast.h"

int 				debug_flag = 0;
int                 debug_base = 0;
int                 switchFlag = 0;
int                 tuple_counter = 0;

Window *window;

static BitmapLayer *day0_icon_layer;
static BitmapLayer *day1_icon_layer;
static BitmapLayer *day2_icon_layer;
static BitmapLayer *day3_icon_layer;
static BitmapLayer *day4_icon_layer;
static BitmapLayer *day5_icon_layer;


static GBitmap *day0_icon_bitmap = NULL;
static GBitmap *day1_icon_bitmap = NULL;
static GBitmap *day2_icon_bitmap = NULL;
static GBitmap *day3_icon_bitmap = NULL;
static GBitmap *day4_icon_bitmap = NULL;
static GBitmap *day5_icon_bitmap = NULL;

static int day0_icon;
static int day1_icon;
static int day2_icon;

BitmapLayer *date_border_layer;

const char *new_location;






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

Layer *todayForecastLayer;

TextLayer *day1_cond_layer;
TextLayer *day2_cond_layer;
TextLayer *day3_cond_layer;
TextLayer *day4_cond_layer;
TextLayer *day5_cond_layer;

TextLayer *day1_temp_layer;
TextLayer *day2_temp_layer;
TextLayer *day3_temp_layer;
TextLayer *day4_temp_layer;
TextLayer *day5_temp_layer;

TextLayer *day1_time_layer;
TextLayer *day2_time_layer;
TextLayer *day3_time_layer;
TextLayer *day4_time_layer;
TextLayer *day5_time_layer;

InverterLayer *day2_time_layer_inverter_layer;


Layer *currentConditionsLayer;
// consider creating a Layer *threeDayForecastLayer, and Layer *clearOverlayLayerForThingsLikeBTIconLayer
static BitmapLayer *day0_icon_layer;
static TextLayer *day0_temperature_layer;
static TextLayer *day0_status_layer;
static TextLayer *day0_conditions_layer;
static TextLayer *day0_barometer_layer;

static GFont custom_font_tiny_temp, custom_font_temp, custom_font_large_location, custom_font_small_location, custom_font_time, custom_font_location, custom_font_status, custom_font_status_16;


InverterLayer *inverter_layer;
GBitmap *date_layer_bitmap = NULL;
uint32_t offsetInt = 0;


uint32_t current_conditions_time_int = 1095345600;
uint32_t todayInt = 1095345600;
uint32_t tomorrowInt = 1095432000;
uint32_t nextdayInt = 1095518400;
uint32_t sunriseInt = 1095429600 - (3600 * 7);
uint32_t sunsetInt = 1095472800 - (3600 * 7);

uint32_t todayForecastTimeInt = 1095345600;
uint32_t tonightForecastTimeInt = 1095345600;

AppSync sync;

int 					sunInt;
int 					counter_one;
int                     night_flag = 1;

uint8_t 				sync_buffer[1024];
const uint32_t			dictSizeInt;
char 				dictSizeString;
const char			*location;
const char			*current_conditions;
const char			*current_barometer;
const char			*current_temperature;
const char			*today_conditions;
const char			*tomorrow_conditions;
const char			*nextday_conditions;
const char			*tomorrow_date_string;
const char			*today_hilo;
const char			*tomorrow_hilo;
const char			*nextday_hilo;

enum WeatherKey {
    SETTING_NUMBER_1_KEY        = 1,

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
    RESOURCE_ID_IMAGE_UNKNOWN, // 14
    RESOURCE_ID_IMAGE_UNKNOWN, // 15
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





    DictionaryIterator *iter;
    app_message_outbox_begin(&iter);

    if (iter == NULL) {

        return;
    }

    app_message_outbox_send();
}

void back_click_handler(ClickRecognizerRef recognizer, void *context) {
    windowSwitch();
}

void config_provider(void *context) {
    window_single_click_subscribe(BUTTON_ID_BACK, back_click_handler);
}



void windowSwitch(void) {


    if (switchFlag == 0) {
        // show today_forecast
        layer_set_hidden(currentConditionsLayer, true);
        layer_set_hidden(todayForecastLayer, false);
        switchFlag = 1;
        counter_one = 10;
    } else if (switchFlag == 1) {
        // show way out forecast
        layer_set_hidden(currentConditionsLayer, true);
        layer_set_hidden(todayForecastLayer, true);
        switchFlag = 2;
        counter_one = 10;
    } else if (switchFlag == 2) {
        //set back to base leve, current conditions show
        layer_set_hidden(currentConditionsLayer, false);
        layer_set_hidden(todayForecastLayer, true);
        switchFlag = 0;
        counter_one = 0;
    }
}


void accel_tap_handler(AccelAxisType axis, int32_t direction) {
    APP_LOG(APP_LOG_LEVEL_INFO, "accl event received");
    windowSwitch();
}

static void handle_battery(BatteryChargeState charge_state) {

    APP_LOG(APP_LOG_LEVEL_INFO, "battery handler invoked");
    int xPos = charge_state.charge_percent;
    xPos = (144 * xPos) / 100;
    layer_set_frame(power_bar_layer, GRect(xPos, 37, 1, 2));

    if (charge_state.is_charging) {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "charge_state.is_charging, battery %i", charge_state.charge_percent);
        layer_set_hidden(top_line_layer, false);
        layer_set_hidden(bottom_line_layer, false);
    } else {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "battery not charging, battery %i", charge_state.charge_percent);
        layer_set_hidden(top_line_layer, true);
        layer_set_hidden(bottom_line_layer, true);
    }
}

static void sync_error_callback(DictionaryResult dict_error, AppMessageResult app_message_error, void *context) {
    //APP_LOG(APP_LOG_LEVEL_DEBUG, "App Message Sync Error: %d", app_message_error);
    if (debug_flag > 0) {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Got error: %s", translate_error(app_message_error));
    }
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
    //APP_LOG(APP_LOG_LEVEL_DEBUG, "%d = night flag", night_flag);
    if (debug_flag > 0) {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "%i sync_tuple_changed_callback (message received or tuplet initialized)", tuple_counter);
    }
    tuple_counter = tuple_counter + 1;
    GFont custom_font_tinytemp 	= fonts_get_system_font(FONT_KEY_GOTHIC_18);
    GFont custom_font_temp 		= fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD);
    GFont custom_font_large_location = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_TAHOMA_BOLD_28));

    switch (key) {
        ///*
        static char day_text[]      = "aaa aaa aaa";
        static char night_text[]    = "aaa aaa aaa";
        static char current_text[]  = "aaa aaa aaa";
        struct tm *timer_tm;
    //*/

    //case SETTING_NUMBER_1_KEY:
    //break;

    case WEATHER_DAY0_TIMESTAMP_KEY:
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "weather_day0_timestamp_key");
        }

        current_conditions_time_int = new_tuple->value->uint32;
        time_t currentStamp     = current_conditions_time_int;
        timer_tm = localtime (&currentStamp);
        strftime(current_text, sizeof(current_text), "%l:%M%P", timer_tm);
        text_layer_set_text(day0_status_layer, current_text);
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY0_TIMESTAMP_KEY %lu", new_tuple->value->uint32);
        }
        break;

    case WEATHER_DAY1_TIMESTAMP_KEY:
        todayForecastTimeInt = new_tuple->value->uint32;
        time_t timeStamp   		= todayForecastTimeInt;
        timer_tm = localtime (&timeStamp);
        strftime(day_text, sizeof(day_text), "%l%P\n %a", timer_tm);
        text_layer_set_text(day1_time_layer, day_text);
        if (debug_flag  == 2) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY1_TIMESTAMP_KEY %lu", new_tuple->value->uint32);
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY2_TIMESTAMP_KEY day_text %s", day_text);
        }
        break;

    case WEATHER_DAY2_TIMESTAMP_KEY:
        tonightForecastTimeInt = new_tuple->value->uint32;
        time_t nightStamp   		= tonightForecastTimeInt;
        timer_tm = localtime (&nightStamp);
        strftime(night_text, sizeof(night_text), "%l%P\n %a", timer_tm);
        text_layer_set_text(day2_time_layer, night_text);

        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY2_TIMESTAMP_KEY %lu", new_tuple->value->uint32);
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY2_TIMESTAMP_KEY night_text %s", night_text);
        }
        break;

    case WEATHER_DAY3_TIMESTAMP_KEY:
        todayInt = new_tuple->value->uint32;
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY3_TIMESTAMP_KEY %lu", new_tuple->value->uint32);
        }
        break;

    case WEATHER_DAY4_TIMESTAMP_KEY:
        tomorrowInt = new_tuple->value->uint32;
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY4_TIMESTAMP_KEY %lu", new_tuple->value->uint32);
        }
        break;

    case WEATHER_DAY5_TIMESTAMP_KEY:
        nextdayInt = new_tuple->value->uint32;
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY5_TIMESTAMP_KEY %lu", new_tuple->value->uint32);
        }
        break;



    case WEATHER_DAY0_BARO_KEY:
        current_barometer = new_tuple->value->cstring;
        text_layer_set_text(day0_barometer_layer, current_barometer);
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY0_BARO_KEY %s", new_tuple->value->cstring);
        }
        debug_flag = debug_base;
        break;

    case WEATHER_DAY0_CONDITIONS_KEY:
        current_conditions = new_tuple->value->cstring;
        text_layer_set_text(day0_conditions_layer, current_conditions);
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY0_CONDITIONS_KEY %s", new_tuple->value->cstring);
        }
        break;

    case WEATHER_DAY1_CONDITIONS_KEY:
        text_layer_set_text(day1_cond_layer, new_tuple->value->cstring);

        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY1_CONDITIONS_KEY %s", new_tuple->value->cstring);
        }
        break;

    case WEATHER_DAY2_CONDITIONS_KEY:
        text_layer_set_text(day2_cond_layer, new_tuple->value->cstring);
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY2_CONDITIONS_KEY %s", new_tuple->value->cstring);
        }
        break;

    case WEATHER_DAY3_CONDITIONS_KEY:
        text_layer_set_text(day3_cond_layer, new_tuple->value->cstring);
        today_conditions = new_tuple->value->cstring;
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY3_CONDITIONS_KEY %s", new_tuple->value->cstring);
        }
        break;

    case WEATHER_DAY4_CONDITIONS_KEY:
        text_layer_set_text(day4_cond_layer, new_tuple->value->cstring);
        tomorrow_conditions = new_tuple->value->cstring;
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY4_CONDITIONS_KEY %s", new_tuple->value->cstring);
        }
        break;

    case WEATHER_DAY5_CONDITIONS_KEY:
        text_layer_set_text(day5_cond_layer, new_tuple->value->cstring);
        nextday_conditions = new_tuple->value->cstring;
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY5_CONDITIONS_KEY %s", new_tuple->value->cstring);
        }
        break;



    case WEATHER_DAY0_ICON_KEY:
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY0_ICON_KEY %lu + night_flag %d", new_tuple->value->uint32, night_flag);
        }
        if (day0_icon_bitmap) {
            gbitmap_destroy(day0_icon_bitmap);
        }
        day0_icon_bitmap = gbitmap_create_with_resource(WEATHER_ICONS[new_tuple->value->uint32 + night_flag]);
        bitmap_layer_set_bitmap(day0_icon_layer, day0_icon_bitmap);
        bitmap_layer_set_bitmap(day1_icon_layer, day0_icon_bitmap);
        bitmap_layer_set_bitmap(day2_icon_layer, day0_icon_bitmap);
        //day0_icon = new_tuple->value->uint32;
        break;

    case WEATHER_DAY1_ICON_KEY:
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY1_ICON_KEY %lu + night_flag %d", new_tuple->value->uint32, night_flag);
        }
        if (day1_icon_bitmap) {
            gbitmap_destroy(day1_icon_bitmap);
        }
        day1_icon_bitmap = gbitmap_create_with_resource(WEATHER_ICONS[new_tuple->value->uint32 + night_flag]);
        //bitmap_layer_set_bitmap(day1_icon_layer, day1_icon_bitmap);
        //day1_icon = new_tuple->value->uint32;
        break;

    case WEATHER_DAY2_ICON_KEY:
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY2_ICON_KEY %lu + night_flag %d", new_tuple->value->uint32, night_flag);
        }
        if (day2_icon_bitmap) {
            gbitmap_destroy(day2_icon_bitmap);
        }
        //APP_LOG(APP_LOG_LEVEL_DEBUG, "%i = night flag", night_flag);
        if (night_flag == 0) {
            //APP_LOG(APP_LOG_LEVEL_DEBUG, "check one");
            day2_icon_bitmap = gbitmap_create_with_resource(WEATHER_ICONS[new_tuple->value->uint32 + 1]);
            //bitmap_layer_set_bitmap(day2_icon_layer, day2_icon_bitmap);
        }
        else if (night_flag == 1) {
            //APP_LOG(APP_LOG_LEVEL_DEBUG, "check two");
            day2_icon_bitmap = gbitmap_create_with_resource(WEATHER_ICONS[new_tuple->value->uint32 + 0]);
            //bitmap_layer_set_bitmap(day2_icon_layer, day2_icon_bitmap);
        }
        else {
            //APP_LOG(APP_LOG_LEVEL_DEBUG, "check three");
        }
        break;

    case WEATHER_DAY3_ICON_KEY:
        if (day3_icon_bitmap) {
            gbitmap_destroy(day3_icon_bitmap);
        }
        bitmap_layer_set_bitmap(day3_icon_layer, day3_icon_bitmap);
        day3_icon_bitmap = gbitmap_create_with_resource(WEATHER_ICONS[new_tuple->value->uint32 + night_flag]);
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY3_ICON_KEY %lu + night_flag %d", new_tuple->value->uint32, night_flag);
        }
        break;

    case WEATHER_DAY4_ICON_KEY:
        if (day4_icon_bitmap) {
            gbitmap_destroy(day4_icon_bitmap);
        }
        bitmap_layer_set_bitmap(day4_icon_layer, day4_icon_bitmap);
        day4_icon_bitmap = gbitmap_create_with_resource(WEATHER_ICONS[new_tuple->value->uint32 + night_flag]);
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY4_ICON_KEY %lu + night_flag %d", new_tuple->value->uint32, night_flag);
        }
        break;

    case WEATHER_DAY5_ICON_KEY:
        if (day5_icon_bitmap) {
            gbitmap_destroy(day5_icon_bitmap);
        }
        bitmap_layer_set_bitmap(day5_icon_layer, day5_icon_bitmap);
        day5_icon_bitmap = gbitmap_create_with_resource(WEATHER_ICONS[new_tuple->value->uint32 + night_flag]);
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY5_ICON_KEY %lu + night_flag %d", new_tuple->value->uint32, night_flag);
        }
        break;

    case WEATHER_DAY0_TEMP_KEY:
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY0_TEMP_KEY %s", new_tuple->value->cstring);
        }
        current_temperature = new_tuple->value->cstring;
        text_layer_set_text(day0_temperature_layer, current_temperature);
        break;

    case WEATHER_DAY1_TEMP_KEY:
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY1_TEMP_KEY %s", new_tuple->value->cstring);
        }
        if (night_flag == 0) {
            text_layer_set_text(day1_temp_layer, new_tuple->value->cstring);
        } else if (night_flag == 1) {
            text_layer_set_text(day2_temp_layer, new_tuple->value->cstring);
        }
        break;

    case WEATHER_DAY2_TEMP_KEY:
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY2_TEMP_KEY %s", new_tuple->value->cstring);
        }
        if (night_flag == 1) {
            text_layer_set_text(day1_temp_layer, new_tuple->value->cstring);
        } else if (night_flag == 0) {
            text_layer_set_text(day2_temp_layer, new_tuple->value->cstring);
        }
        break;

    case WEATHER_DAY3_TEMP_KEY:
        today_hilo = new_tuple->value->cstring;
        static char todayHiLoCounter[32];
        strcpy(todayHiLoCounter, today_hilo);
        int today_hilo_count = countChar(todayHiLoCounter);
        text_layer_set_text(day3_temp_layer, new_tuple->value->cstring);
        if (debug_flag > 0) {

            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY3_TEMP_KEY %s", new_tuple->value->cstring);
            APP_LOG(APP_LOG_LEVEL_DEBUG, "STRING %s has %d characters", today_hilo, today_hilo_count);
        }

        if (today_hilo_count > 9) {
            text_layer_set_font(day3_temp_layer, custom_font_tinytemp);
            text_layer_set_font(day4_temp_layer, custom_font_tinytemp);
            text_layer_set_font(day5_temp_layer, custom_font_tinytemp);
        } else if (today_hilo_count <= 9) {
            text_layer_set_font(day3_temp_layer, custom_font_temp);
            text_layer_set_font(day4_temp_layer, custom_font_temp);
            text_layer_set_font(day5_temp_layer, custom_font_temp);
        }
        break;

    case WEATHER_DAY4_TEMP_KEY:
        tomorrow_hilo = new_tuple->value->cstring;
        text_layer_set_text(day4_temp_layer, new_tuple->value->cstring);
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY4_TEMP_KEY %s", new_tuple->value->cstring);
        }
        break;

    case WEATHER_DAY5_TEMP_KEY:
        nextday_hilo = new_tuple->value->cstring;
        text_layer_set_text(day5_temp_layer, new_tuple->value->cstring);
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_DAY5_TEMP_KEY %s", new_tuple->value->cstring);
        }
        break;

    case WEATHER_LOCATION_KEY:
        new_location = new_tuple->value->cstring;
        text_layer_set_text(location_layer, new_location);
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_LOCATION_KEY %s", new_tuple->value->cstring);
        }
        static char location_counter[32];  //= "White Center";
        strcpy(location_counter, new_location);
        int charCount = countChar(location_counter);
        int changer = 10;
        if (debug_flag > 6) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "STRING [02] %s has %d characters", location_counter, charCount);
        }

        if (charCount < 10 ) {
            //GFont custom_font_time = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_TAHOMA_BOLD_28));
            //text_layer_set_font(location_layer, custom_font_time);

            if (debug_flag > 6) {
                APP_LOG(APP_LOG_LEVEL_DEBUG, "charCount %d reads less than 10", charCount);
                APP_LOG(APP_LOG_LEVEL_DEBUG, "setting location_layer, custom_font_large_location");
                APP_LOG(APP_LOG_LEVEL_DEBUG, "setting ocation_layer, GTextOverflowModeTrailingEllipsis");
            }


        } else if (charCount < 16) {
            if (debug_flag > 6) {
                APP_LOG(APP_LOG_LEVEL_DEBUG, "charCount %d reads greater than 10 less than 16", charCount);
            }
            text_layer_set_overflow_mode(location_layer, GTextOverflowModeWordWrap);
            GFont custom_font_small_location = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_ARIAL_18));

            if (debug_flag > 6) {
                APP_LOG(APP_LOG_LEVEL_DEBUG, "setting location_layer, custom_font_small_location");
                APP_LOG(APP_LOG_LEVEL_DEBUG, "setting ocation_layer, GTextOverflowModeWordWrap");
            }
        } else
        {
            if (debug_flag > 6) {
                APP_LOG(APP_LOG_LEVEL_DEBUG, "charCount %d reads 17 or more", charCount);
                APP_LOG(APP_LOG_LEVEL_DEBUG, "setting location_layer, custom_font_tiny_location");
                APP_LOG(APP_LOG_LEVEL_DEBUG, "setting ocation_layer, GTextOverflowModeWordWrap");
            }
            GFont custom_font_tiny_location = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_ARIAL_BOLD_16));

            text_layer_set_font(location_layer, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));

            text_layer_set_overflow_mode(location_layer, GTextOverflowModeWordWrap);
        }
        if (debug_flag > 6) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "exiting location charCount if/then stack");
        }
        break;



    case WEATHER_SUNRISE_KEY:
        sunriseInt = new_tuple->value->uint32;
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_SUNRISE_KEY sunriseInt: %lu", sunriseInt);
        }
        //handle_minute_tick();
        break;

    case WEATHER_SUNSET_KEY:
        sunsetInt = new_tuple->value->uint32;
        if (debug_flag > 0) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "WEATHER_SUNSET_KEY sunsetInt: %lu", sunsetInt);
        }
        handle_minute_tick();
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
    struct tm *timer_tm;
    timer_tm = localtime (&zuluTime);






    char displayTimeString[32];
    strftime(displayTimeString, sizeof(displayTimeString), "%A %l:%M%P", timer_tm);

    timer_tm = localtime (&lclTime);
    strftime(displayTimeString, sizeof(displayTimeString), "%A %l:%M%P", timer_tm);



    time_t display_time_t = sunriseInt;
    timer_tm = localtime (&display_time_t);

    strftime(displayTimeString, sizeof(displayTimeString), "%A %l:%M%P", timer_tm);
    if (debug_flag > 3) {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "GMT sunrise: %s", displayTimeString);
        APP_LOG(APP_LOG_LEVEL_DEBUG, "adjusted sunrise %s, and adjusted sunriseInt %% 86400 %lu", displayTimeString, (sunriseInt % 86400));
    }
    uint32_t localSunriseInt = sunriseInt - (3600*offsetInt);
    display_time_t = localSunriseInt;
    timer_tm = localtime (&display_time_t);
    strftime(displayTimeString, sizeof(displayTimeString), "%A %l:%M%P", timer_tm);

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

        if (lclTimeInt % 3600 == 0) {
            handle_hour_tick();
        }
        // commenting this out disables auto updates
    }
}

static void handle_second_tick(struct tm* tick_time, TimeUnits units_changed) {


    if (counter_one == 0) {
        if (debug_flag > 8) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "counter_one = 0");
        }
    } else if (counter_one == 1) {
        switchFlag = 2;
        windowSwitch();
        counter_one = 0;
    } else {
        counter_one = counter_one - 1;
        if (debug_flag > 4) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "counter_one = %d", counter_one);
        }
    }

    static char time_text[] = "00:00AAA"; // Needs to be static because it's used by the system later. "%l:%M %y"

    strftime(time_text, sizeof(time_text), "%l:%M%p", tick_time);
    text_layer_set_text(time_layer, time_text);

    static char date_text[] = "00/00";
    strftime(date_text, sizeof(date_text), "%d", tick_time);
    text_layer_set_text(date_layer, date_text);




    strftime(date_text, sizeof(date_text), "%d", tick_time);
    text_layer_set_text(date_layer, date_text);

    static char day_text[] = "aaa";
    static char day1_text[] = "aaa";
    static char day2_text[] = "aaa";

    time_t current   = time(0);


    time_t today   		= todayInt 		- (offsetInt*3600);
    time_t inOneDay 	= tomorrowInt	- (offsetInt*3600); // 60 minutes of 60 sec.
    time_t inTwoDays 	= nextdayInt	- (offsetInt*3600);
    struct tm *timer_tm;
    timer_tm = localtime (&today);
    strftime(day_text, sizeof(day_text), "%a", timer_tm);
    text_layer_set_text(day3_time_layer, day_text);
    if (debug_flag > 8) {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "day[0]text: %s", day_text);
        APP_LOG(APP_LOG_LEVEL_DEBUG, "day[0]Int = %lu", todayInt);
    }


    timer_tm = localtime (&current);




    timer_tm = localtime (&inOneDay);
    strftime(day1_text, sizeof(day1_text), "%a", timer_tm);
    text_layer_set_text(day4_time_layer, day1_text);

    if (debug_flag > 8) {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "day[1]text: %s", day1_text);
        APP_LOG(APP_LOG_LEVEL_DEBUG, "day[1]Int = %lu", tomorrowInt);
    }
    timer_tm = localtime (&inTwoDays);
    strftime(day2_text, sizeof(day2_text), "%a", timer_tm);
    text_layer_set_text(day5_time_layer, day2_text);
    if (debug_flag > 8) {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "day[2]text %s", day2_text);
        APP_LOG(APP_LOG_LEVEL_DEBUG, "day[2]Int = %lu", nextdayInt);
    }


    time_t nowInt = time(NULL);
    if (nowInt % 60 == 0 ) {
        handle_minute_tick();
        fetch_message();

    }
    if (debug_flag > 8) {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "%lu", (nowInt % 12));
    }
    if (nowInt % 600 == 0) {
    }

    int xPos = nowInt % 60;
    xPos = (144 * xPos) / 60;
    layer_set_frame(second_layer, GRect(xPos, 37, 2, 2));
    layer_set_update_proc(second_layer, white_layer_update_callback);

    if (nowInt % 12 == 0) {
        if (debug_flag > 8) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "show day!");
        }
        layer_set_hidden(text_layer_get_layer(day1_temp_layer), true);
        layer_set_hidden(text_layer_get_layer(day2_temp_layer), true);
        layer_set_hidden(text_layer_get_layer(day1_cond_layer), true);
        layer_set_hidden(text_layer_get_layer(day2_cond_layer), true);
        layer_set_hidden(text_layer_get_layer(day1_time_layer), false);
        layer_set_hidden(text_layer_get_layer(day2_time_layer), false);

        layer_set_hidden(text_layer_get_layer(day3_temp_layer), true);
        layer_set_hidden(text_layer_get_layer(day4_temp_layer), true);
        layer_set_hidden(text_layer_get_layer(day5_temp_layer), true);
        layer_set_hidden(text_layer_get_layer(day3_cond_layer), true);
        layer_set_hidden(text_layer_get_layer(day4_cond_layer), true);
        layer_set_hidden(text_layer_get_layer(day5_cond_layer), true);
        layer_set_hidden(text_layer_get_layer(day3_time_layer), false);
        layer_set_hidden(text_layer_get_layer(day4_time_layer), false);
        layer_set_hidden(text_layer_get_layer(day5_time_layer), false);

        layer_set_hidden(text_layer_get_layer(day0_status_layer), false);
        layer_set_hidden(text_layer_get_layer(day0_conditions_layer), true);
        layer_set_hidden(text_layer_get_layer(day0_barometer_layer), true);


    } else if (nowInt % 12 == 4) {
        if (debug_flag > 8) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "show conditions!");
        }
        layer_set_hidden(text_layer_get_layer(day1_temp_layer), true);
        layer_set_hidden(text_layer_get_layer(day2_temp_layer), true);
        layer_set_hidden(text_layer_get_layer(day1_cond_layer), false);
        layer_set_hidden(text_layer_get_layer(day2_cond_layer), false);
        layer_set_hidden(text_layer_get_layer(day1_time_layer), true);
        layer_set_hidden(text_layer_get_layer(day2_time_layer), true);

        layer_set_hidden(text_layer_get_layer(day3_temp_layer), true);
        layer_set_hidden(text_layer_get_layer(day4_temp_layer), true);
        layer_set_hidden(text_layer_get_layer(day5_temp_layer), true);
        layer_set_hidden(text_layer_get_layer(day3_cond_layer), false);
        layer_set_hidden(text_layer_get_layer(day4_cond_layer), false);
        layer_set_hidden(text_layer_get_layer(day5_cond_layer), false);
        layer_set_hidden(text_layer_get_layer(day3_time_layer), true);
        layer_set_hidden(text_layer_get_layer(day4_time_layer), true);
        layer_set_hidden(text_layer_get_layer(day5_time_layer), true);
        layer_set_hidden(text_layer_get_layer(day0_status_layer), true);
        layer_set_hidden(text_layer_get_layer(day0_conditions_layer), false);
        layer_set_hidden(text_layer_get_layer(day0_barometer_layer), true);

    } else if (nowInt % 12 == 8) {
        if (debug_flag > 8) {
            APP_LOG(APP_LOG_LEVEL_DEBUG, "show temperature!");
        }
        layer_set_hidden(text_layer_get_layer(day1_temp_layer), false);
        layer_set_hidden(text_layer_get_layer(day2_temp_layer), false);
        layer_set_hidden(text_layer_get_layer(day1_cond_layer), true);
        layer_set_hidden(text_layer_get_layer(day2_cond_layer), true);
        layer_set_hidden(text_layer_get_layer(day1_time_layer), true);
        layer_set_hidden(text_layer_get_layer(day2_time_layer), true);

        layer_set_hidden(text_layer_get_layer(day3_temp_layer), false);
        layer_set_hidden(text_layer_get_layer(day4_temp_layer), false);
        layer_set_hidden(text_layer_get_layer(day5_temp_layer), false);
        layer_set_hidden(text_layer_get_layer(day3_cond_layer), true);
        layer_set_hidden(text_layer_get_layer(day4_cond_layer), true);
        layer_set_hidden(text_layer_get_layer(day5_cond_layer), true);
        layer_set_hidden(text_layer_get_layer(day3_time_layer), true);
        layer_set_hidden(text_layer_get_layer(day4_time_layer), true);
        layer_set_hidden(text_layer_get_layer(day5_time_layer), true);

        layer_set_hidden(text_layer_get_layer(day0_status_layer), true);
        layer_set_hidden(text_layer_get_layer(day0_conditions_layer), true);
        layer_set_hidden(text_layer_get_layer(day0_barometer_layer), false);
    }
}

void infolines_init(void) {
    //to call infolines_init();
    if (debug_flag > 2) {
        APP_LOG(APP_LOG_LEVEL_INFO, "infolines init START");
    }
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

    if (debug_flag > 2) {
        APP_LOG(APP_LOG_LEVEL_INFO, "infolines init END");
    }

}

static void window_load(Window *window) {

    if (debug_flag > 2) {
        APP_LOG(APP_LOG_LEVEL_INFO, "window_load START");
    }


    GFont custom_font_time = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_TAHOMA_BOLD_28));
    GFont custom_font_location = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_TAHOMA_BOLD_24));
    GFont custom_font_status = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_ARIAL_17));
    GFont custom_font_status_16 = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_ARIAL_16));
    GFont custom_font_temp 		= fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD);

    if (debug_flag > 2) {
        APP_LOG(APP_LOG_LEVEL_INFO, "Tuplets START");
    }

    Tuplet initial_values[] = {
        TupletCString(WEATHER_DAY0_BARO_KEY, "       "),
        TupletInteger(WEATHER_DAY0_ICON_KEY, (int) 14),
        TupletInteger(WEATHER_DAY1_ICON_KEY, (int) 14),
        TupletInteger(WEATHER_DAY2_ICON_KEY, (int) 14),
        TupletInteger(WEATHER_DAY3_ICON_KEY, (int) 14),
        TupletInteger(WEATHER_DAY4_ICON_KEY, (int) 14),
        TupletInteger(WEATHER_DAY5_ICON_KEY, (int) 14),
        TupletCString(WEATHER_DAY0_TEMP_KEY, "     "),
        TupletCString(WEATHER_DAY1_TEMP_KEY, "     "),
        TupletCString(WEATHER_DAY2_TEMP_KEY, "     "),
        TupletCString(WEATHER_DAY3_TEMP_KEY, "     "),
        TupletCString(WEATHER_DAY4_TEMP_KEY, "     "),
        TupletCString(WEATHER_DAY5_TEMP_KEY, "     "),
        TupletCString(WEATHER_DAY0_CONDITIONS_KEY, "         "),
        TupletCString(WEATHER_DAY1_CONDITIONS_KEY, "         "),
        TupletCString(WEATHER_DAY2_CONDITIONS_KEY, "         "),
        TupletCString(WEATHER_DAY3_CONDITIONS_KEY, "     "),
        TupletCString(WEATHER_DAY4_CONDITIONS_KEY, "     "),
        TupletCString(WEATHER_DAY5_CONDITIONS_KEY, "     "),
        TupletInteger(WEATHER_DAY0_TIMESTAMP_KEY, (int) 999993600),
        TupletInteger(WEATHER_DAY1_TIMESTAMP_KEY, (int) 999993600),
        TupletInteger(WEATHER_DAY2_TIMESTAMP_KEY, (int) 999993600),
        TupletInteger(WEATHER_DAY3_TIMESTAMP_KEY, (int) 999993600),
        TupletInteger(WEATHER_DAY4_TIMESTAMP_KEY, (int) 999993600),
        TupletInteger(WEATHER_DAY5_TIMESTAMP_KEY, (int) 999993600),
        TupletCString(WEATHER_LOCATION_KEY, "         "),
        TupletInteger(WEATHER_SUNRISE_KEY, (int) 999928800), //1395410913 ),
        TupletInteger(WEATHER_SUNSET_KEY, (int) 999979200), //1395455062 ),

    };

    if (debug_flag > 2) {
        APP_LOG(APP_LOG_LEVEL_INFO, "Tuplets END");
    }
    Layer *window_layer = window_get_root_layer(window);
    infolines_init();

    //	int hite = 58;
    int hite = 43;
    int w_size = 48;
    int h_size = 50;
    int downset = -1; //perfect for ARIAL_15

    int downTempSet = -2; //This is for GOTHIC 18


    bt_layer = text_layer_create(GRect(2, 41, 15, 19));

    text_layer_set_text_alignment(bt_layer, GTextAlignmentCenter);
    text_layer_set_background_color(bt_layer, GColorBlack);
    text_layer_set_text_color(bt_layer, GColorWhite);
    text_layer_set_font(bt_layer, fonts_get_system_font(FONT_KEY_GOTHIC_14_BOLD));
    text_layer_set_text(bt_layer, "B");

    time_layer = text_layer_create(GRect(0, 1, 144 * .75, 50));
    date_layer = text_layer_create(GRect(92+4, -1, 52, 32));

    location_layer = text_layer_create(GRect(-2, 125, 148, 40));



    day0_icon_layer = bitmap_layer_create(GRect(9, 58-43, 50, 50));
    day0_temperature_layer = text_layer_create(GRect(64, 63-43, 124, 36));
    day0_status_layer = text_layer_create(GRect(65, 92-43, 144, 36));
    day0_conditions_layer = text_layer_create(GRect(65, 92-43, 144, 36));
    day0_barometer_layer = text_layer_create(GRect(65, 92-43, 144, 36));



    text_layer_set_text_alignment(day0_status_layer, GTextAlignmentLeft);
    text_layer_set_text_alignment(day0_conditions_layer, GTextAlignmentLeft);
    text_layer_set_font(day0_temperature_layer, custom_font_time);
    text_layer_set_font(day0_status_layer, custom_font_status);
    text_layer_set_font(day0_conditions_layer, custom_font_status);
    text_layer_set_font(day0_barometer_layer, custom_font_status);
    text_layer_set_overflow_mode(day0_status_layer, GTextOverflowModeFill);
    text_layer_set_overflow_mode(day0_conditions_layer, GTextOverflowModeTrailingEllipsis);
    text_layer_set_overflow_mode(day0_barometer_layer, GTextOverflowModeTrailingEllipsis);


    //GRect X, Y, Width, Height

    day3_icon_layer 		= bitmap_layer_create(GRect(0, hite, w_size, h_size));
    day4_icon_layer		= bitmap_layer_create(GRect(48, hite, w_size, h_size));
    day5_icon_layer 		= bitmap_layer_create(GRect(96, hite, w_size, h_size));
    day3_time_layer 		= text_layer_create(GRect(0, hite + h_size + downset, w_size, h_size));
    day4_time_layer 		= text_layer_create(GRect(48, hite + h_size + downset, w_size, h_size));
    day5_time_layer 		= text_layer_create(GRect(96, hite + h_size + downset, w_size, h_size));

    day3_cond_layer 		= text_layer_create(GRect(0, hite + h_size + downset, w_size, h_size));
    day4_cond_layer		= text_layer_create(GRect(48, hite + h_size + downset, w_size, h_size));
    day5_cond_layer 		= text_layer_create(GRect(96, hite + h_size + downset, w_size, h_size));

    day3_temp_layer 		= text_layer_create(GRect(0-50, hite + h_size + downTempSet, w_size+100, h_size+100));
    day4_temp_layer		= text_layer_create(GRect(48-50, hite + h_size + downTempSet, w_size+100, h_size));
    day5_temp_layer 		= text_layer_create(GRect(96-50, hite + h_size + downTempSet, w_size+100, h_size));

    text_layer_set_text_alignment(day3_temp_layer, GTextAlignmentCenter);
    text_layer_set_text_alignment(day4_temp_layer, GTextAlignmentCenter);
    text_layer_set_text_alignment(day5_temp_layer, GTextAlignmentCenter);


    text_layer_set_overflow_mode(day3_cond_layer, GTextOverflowModeWordWrap);
    text_layer_set_overflow_mode(day4_cond_layer, GTextOverflowModeWordWrap);
    text_layer_set_overflow_mode(day5_cond_layer, GTextOverflowModeWordWrap);

    text_layer_set_overflow_mode(day3_temp_layer, GTextOverflowModeWordWrap);
    text_layer_set_overflow_mode(day4_temp_layer, GTextOverflowModeWordWrap);
    text_layer_set_overflow_mode(day5_temp_layer, GTextOverflowModeWordWrap);


    text_layer_set_background_color(day3_temp_layer, GColorClear);
    text_layer_set_background_color(day4_temp_layer, GColorClear);
    text_layer_set_background_color(day5_temp_layer, GColorClear);

    date_border_layer 		= bitmap_layer_create(GRect(99+4, 1, 38, 35));

    bitmap_layer_set_background_color(day3_icon_layer, GColorClear);
    bitmap_layer_set_background_color(day4_icon_layer, GColorClear);
    bitmap_layer_set_background_color(day5_icon_layer, GColorClear);
    bitmap_layer_set_background_color(date_border_layer, GColorClear);
    bitmap_layer_set_alignment(day3_icon_layer, GAlignCenter);
    bitmap_layer_set_alignment(day4_icon_layer, GAlignCenter);
    bitmap_layer_set_alignment(day5_icon_layer, GAlignCenter);


    day0_icon_bitmap = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_UNKNOWN);
    day3_icon_bitmap = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_UNKNOWN);
    day4_icon_bitmap = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_UNKNOWN);
    day5_icon_bitmap = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_UNKNOWN);
    date_layer_bitmap = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_DATE_BORDER);

    bitmap_layer_set_bitmap(day0_icon_layer, day0_icon_bitmap);
    bitmap_layer_set_bitmap(day3_icon_layer, day3_icon_bitmap);
    bitmap_layer_set_bitmap(day4_icon_layer, day4_icon_bitmap);
    bitmap_layer_set_bitmap(day5_icon_layer, day5_icon_bitmap);
    bitmap_layer_set_bitmap(date_border_layer, date_layer_bitmap);

    text_layer_set_text_alignment(day3_cond_layer, GTextAlignmentCenter);
    text_layer_set_text_alignment(day4_cond_layer, GTextAlignmentCenter);
    text_layer_set_text_alignment(day5_cond_layer, GTextAlignmentCenter);
    text_layer_set_text_alignment(day3_time_layer, GTextAlignmentCenter);
    text_layer_set_text_alignment(day4_time_layer, GTextAlignmentCenter);
    text_layer_set_text_alignment(day5_time_layer, GTextAlignmentCenter);

    text_layer_set_overflow_mode(day3_cond_layer, GTextOverflowModeFill);
    text_layer_set_overflow_mode(day4_cond_layer, GTextOverflowModeFill);
    text_layer_set_overflow_mode(day5_cond_layer, GTextOverflowModeFill);
    text_layer_set_background_color(day3_cond_layer, GColorClear);
    text_layer_set_background_color(day4_cond_layer, GColorClear);
    text_layer_set_background_color(day5_cond_layer, GColorClear);

    text_layer_set_font(day3_cond_layer, custom_font_status);
    text_layer_set_font(day4_cond_layer, custom_font_status);
    text_layer_set_font(day5_cond_layer, custom_font_status);
    text_layer_set_font(day3_temp_layer, custom_font_temp);
    text_layer_set_font(day4_temp_layer, custom_font_temp);
    text_layer_set_font(day5_temp_layer, custom_font_temp);
    text_layer_set_font(day3_time_layer, custom_font_status);
    text_layer_set_font(day4_time_layer, custom_font_status);
    text_layer_set_font(day5_time_layer, custom_font_status);


    text_layer_set_text_alignment(day3_cond_layer, GTextAlignmentCenter);
    text_layer_set_text_alignment(day4_cond_layer, GTextAlignmentCenter);
    text_layer_set_text_alignment(day5_cond_layer, GTextAlignmentCenter);

    text_layer_set_background_color(time_layer, GColorClear);
    text_layer_set_text_alignment(time_layer, GTextAlignmentLeft);

    text_layer_set_font(time_layer, custom_font_time);
    text_layer_set_overflow_mode(time_layer, GTextOverflowModeFill);

    text_layer_set_background_color(date_layer, GColorClear);
    text_layer_set_text_alignment(date_layer, GTextAlignmentCenter);
    text_layer_set_font(date_layer, fonts_get_system_font(FONT_KEY_GOTHIC_28));

    text_layer_set_text_color(location_layer, GColorBlack);
    text_layer_set_background_color(location_layer, GColorClear);
//    text_layer_set_font(location_layer, custom_font_location);
    text_layer_set_font(location_layer, custom_font_time);
    text_layer_set_text_alignment(location_layer, GTextAlignmentCenter);

    layer_add_child(window_layer, text_layer_get_layer(day3_cond_layer));
    layer_add_child(window_layer, text_layer_get_layer(day4_cond_layer));
    layer_add_child(window_layer, text_layer_get_layer(day5_cond_layer));

    layer_add_child(window_layer, text_layer_get_layer(day3_temp_layer));
    layer_add_child(window_layer, text_layer_get_layer(day4_temp_layer));
    layer_add_child(window_layer, text_layer_get_layer(day5_temp_layer));

    layer_add_child(window_layer, text_layer_get_layer(day3_time_layer));
    layer_add_child(window_layer, text_layer_get_layer(day4_time_layer));
    layer_add_child(window_layer, text_layer_get_layer(day5_time_layer));

    layer_add_child(window_layer, text_layer_get_layer(time_layer));
    layer_add_child(window_layer, bitmap_layer_get_layer(date_border_layer));
    layer_add_child(window_layer, text_layer_get_layer(date_layer));

    layer_add_child(window_layer, bitmap_layer_get_layer(day3_icon_layer));
    layer_add_child(window_layer, bitmap_layer_get_layer(day4_icon_layer));
    layer_add_child(window_layer, bitmap_layer_get_layer(day5_icon_layer));

    layer_set_hidden(text_layer_get_layer(bt_layer), true);

    layer_add_child(window_layer, text_layer_get_layer(location_layer));

    //app_sync_init(&sync, sync_buffer, sizeof(sync_buffer), initial_values, ARRAY_LENGTH(initial_values), sync_tuple_changed_callback, sync_error_callback, NULL);


    todayForecastLayer = layer_create(GRect(0, 43, 144, 85));
    layer_set_update_proc(todayForecastLayer, white_layer_update_callback);
    day1_icon_layer = bitmap_layer_create(GRect(0, 0, 72, 50));
    day2_icon_layer = bitmap_layer_create(GRect(72, 0, 72, 50));
    day1_cond_layer = text_layer_create(GRect(0, 51-2, 72, 38));
    day2_cond_layer = text_layer_create(GRect(72, 51-2, 72, 38));
    day1_temp_layer = text_layer_create(GRect(0, 51, 72, 38));
    day2_temp_layer = text_layer_create(GRect(72, 51, 72, 38));
    day1_time_layer = text_layer_create(GRect(5, 51, 72-10, 38));
    day2_time_layer = text_layer_create(GRect(72+5, 51, 72-10, 38));

    currentConditionsLayer = layer_create(GRect(0, 43, 144, 85));
    layer_set_update_proc(currentConditionsLayer, white_layer_update_callback);

    text_layer_set_text_alignment(day1_cond_layer, GTextAlignmentCenter);
    text_layer_set_text_alignment(day2_cond_layer, GTextAlignmentCenter);
    text_layer_set_text_alignment(day1_time_layer, GTextAlignmentCenter);
    text_layer_set_text_alignment(day2_time_layer, GTextAlignmentCenter);
    text_layer_set_font(day1_cond_layer, custom_font_status);
    text_layer_set_font(day2_cond_layer, custom_font_status);
    text_layer_set_font(day1_time_layer, custom_font_status);
    text_layer_set_font(day2_time_layer, custom_font_status);
    text_layer_set_overflow_mode(day1_time_layer, GTextOverflowModeWordWrap);
    text_layer_set_overflow_mode(day2_time_layer, GTextOverflowModeWordWrap);

    text_layer_set_text_alignment(day1_temp_layer, GTextAlignmentCenter);
    text_layer_set_text_alignment(day2_temp_layer, GTextAlignmentCenter);
    text_layer_set_font(day1_temp_layer, custom_font_status);
    text_layer_set_font(day2_temp_layer, custom_font_status);

    day2_time_layer_inverter_layer = inverter_layer_create(GRect(72+ 3, 0, 72 - (3*2), 50));

    layer_add_child(window_layer, todayForecastLayer);
    layer_add_child(todayForecastLayer, bitmap_layer_get_layer(day1_icon_layer));
    layer_add_child(todayForecastLayer, bitmap_layer_get_layer(day2_icon_layer));
    layer_add_child(todayForecastLayer, text_layer_get_layer(day1_cond_layer));
    layer_add_child(todayForecastLayer, text_layer_get_layer(day2_cond_layer));
    layer_add_child(todayForecastLayer, text_layer_get_layer(day2_temp_layer));
    layer_add_child(todayForecastLayer, text_layer_get_layer(day1_temp_layer));
    layer_add_child(todayForecastLayer, text_layer_get_layer(day1_time_layer));
    layer_add_child(todayForecastLayer, text_layer_get_layer(day2_time_layer));
    //layer_add_child(todayForecastLayer, inverter_layer_get_layer(day2_time_layer_inverter_layer));

    layer_add_child(window_layer, currentConditionsLayer);
    layer_add_child(currentConditionsLayer, bitmap_layer_get_layer(day0_icon_layer));
    layer_add_child(currentConditionsLayer, text_layer_get_layer(day0_temperature_layer));
    layer_add_child(currentConditionsLayer, text_layer_get_layer(day0_status_layer));
    layer_add_child(currentConditionsLayer, text_layer_get_layer(day0_barometer_layer));
    layer_add_child(currentConditionsLayer, text_layer_get_layer(day0_conditions_layer));


    inverter_layer = inverter_layer_create(GRect(0, 0, 144, 168));
    layer_set_hidden(inverter_layer_get_layer(inverter_layer), true);


    layer_add_child(window_layer, text_layer_get_layer(bt_layer));

    layer_add_child(window_layer, inverter_layer_get_layer(inverter_layer));


    layer_set_hidden(currentConditionsLayer, false);
    layer_set_hidden(todayForecastLayer, true);


    send_cmd();
    tick_timer_service_subscribe(SECOND_UNIT, &handle_second_tick);
    handle_minute_tick();
    handle_hour_tick();
    bluetooth_connection_service_subscribe(&handle_bluetooth);
    bluetooth_init(bluetooth_connection_service_peek());
    if (debug_flag > 2) {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "next line sets battery service subscribe on");
    }
    battery_state_service_subscribe(handle_battery);
    if (debug_flag > 2) {
        APP_LOG(APP_LOG_LEVEL_INFO, "next line peeks at battery state");
    }
    handle_battery(battery_state_service_peek());

    if (debug_flag > 2) {
        APP_LOG(APP_LOG_LEVEL_INFO, "window_load END");
    }
    accel_tap_service_subscribe(accel_tap_handler);
    handle_minute_tick();


    app_sync_init(&sync, sync_buffer, sizeof(sync_buffer), initial_values, ARRAY_LENGTH(initial_values), sync_tuple_changed_callback, sync_error_callback, NULL);

    //app_sync_init(&sync, sync_buffer, sizeof(sync_buffer), initial_values, ARRAY_LENGTH(initial_values), sync_tuple_changed_callback, sync_error_callback, NULL);

    //send_cmd();
}

static void window_unload(Window *window) {

    //Layer *window_layer = window_get_root_layer(window);

    text_layer_destroy(bt_layer);
    text_layer_destroy(time_layer);
    text_layer_destroy(date_layer);
    text_layer_destroy(location_layer);

    layer_destroy(top_line_layer);
    layer_destroy(bottom_line_layer); //
    layer_destroy(info_line_layer);
    layer_destroy(power_bar_layer);
    layer_destroy(second_layer);
//    layer_remove_from_parent(day2_temp_layer);
//    layer_destroy(todayForecastLayer);
//    layer_remove_child_layers(todayForecastLayer);
//    layer_remove_child_layers(window_layer);
//    layer_remove_from_parent(text_layer_get_layer(day5_cond_layer));
    /*

    text_layer_destroy(day5_temp_layer);
    text_layer_destroy(day4_temp_layer);
    text_layer_destroy(day3_temp_layer);
    //    text_layer_destroy(day2_temp_layer);
    text_layer_destroy(day5_cond_layer);
    text_layer_destroy(day4_cond_layer);
    text_layer_destroy(day3_cond_layer);
    text_layer_destroy(day5_time_layer);
    text_layer_destroy(day4_time_layer);
    text_layer_destroy(day3_time_layer);
    text_layer_destroy(day0_barometer_layer);
    text_layer_destroy(day0_status_layer);
    text_layer_destroy(day0_temperature_layer);

    bitmap_layer_destroy(date_border_layer);
    if (date_layer_bitmap) {
        gbitmap_destroy(date_layer_bitmap);
    }
     */

    //    bitmap_layer_destroy(day5_icon_layer);
    //    bitmap_layer_destroy(day4_icon_layer);
    //    bitmap_layer_destroy(day3_icon_layer);
    //    bitmap_layer_destroy(day2_icon_layer);
    //    bitmap_layer_destroy(day1_icon_layer);
    bitmap_layer_destroy(day0_icon_layer);


    if (day5_icon_bitmap) {
        gbitmap_destroy(day5_icon_bitmap);
    }
    if (day4_icon_bitmap) {
        gbitmap_destroy(day4_icon_bitmap);
    }
    if (day3_icon_bitmap) {
        gbitmap_destroy(day3_icon_bitmap);
    }
    if (day2_icon_bitmap) {
        gbitmap_destroy(day2_icon_bitmap);
    }
    if (day1_icon_bitmap) {
        gbitmap_destroy(day1_icon_bitmap);
    }
    if (day0_icon_bitmap) {
        gbitmap_destroy(day0_icon_bitmap);
    }

    //	inverter_layer_destroy(inverter_layer);
    //  inverter_layer_destroy(inverter_layer);
    //  inverter_layer_destroy(day2_time_layer_inverter_layer);

    /*
     text_layer_destroy(day2_time_layer);
     text_layer_destroy(day1_time_layer);
     text_layer_destroy(day2_temp_layer);
     text_layer_destroy(day1_temp_layer);
     text_layer_destroy(day2_cond_layer);
     text_layer_destroy(day1_cond_layer);

     */





    //    layer_destroy(todayForecastLayer);
    //    layer_destroy(currentConditionsLayer);
    fonts_unload_custom_font(custom_font_time);
    /*	fonts_unload_custom_font(custom_font_tiny_temp);
    	fonts_unload_custom_font(custom_font_temp);
    	fonts_unload_custom_font(custom_font_large_location);
    	fonts_unload_custom_font(custom_font_small_location);
    	fonts_unload_custom_font(custom_font_location);
    	fonts_unload_custom_font(custom_font_status);
    	fonts_unload_custom_font(custom_font_status_16);
    */

}


void handle_init(void) {
    window = window_create();
    window_set_fullscreen(window, true);
    window_set_window_handlers(window, (WindowHandlers) {
        .load = window_load,
         .unload = window_unload,
    });
    const int inbound_size = 1024;
    const int outbound_size = 1024;
    app_message_open(inbound_size, outbound_size);
    window_stack_push(window, true /* Animated */);
}

/*
void infolines_deinit(void) {
//to call infolines_deinit();

layer_destroy(top_line_layer);
layer_destroy(bottom_line_layer); //
layer_destroy(info_line_layer);
layer_destroy(power_bar_layer);
layer_destroy(second_layer);
}
*/


void handle_deinit(void) {

//    infolines_deinit();
    window_destroy(window);
    //    layer_destroy(text_layer_get_layer(day0_conditions_layer));

}

int main(void) {
    handle_init();
    app_event_loop();
    handle_deinit();
}