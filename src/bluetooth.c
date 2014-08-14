#include <pebble.h>

TextLayer *bt_layer;
Layer *top_line_layer;
Layer *bottom_line_layer;
//static BitmapLayer 	*battery_bar_bitmap_layer;
//static GBitmap 		*battery_bar_bitmap = NULL;

void handle_bluetooth(bool connected) {
    layer_set_hidden(text_layer_get_layer(bt_layer), connected ? true : false);
    vibes_short_pulse();
}

void bluetooth_init(bool connected) {
    layer_set_hidden(text_layer_get_layer(bt_layer), connected ? true : false);
//	layer_set_hidden(text_layer_get_layer(bt_border_layer), connected ? true : false);
}

void bluetooth_deinit(void) {
    layer_set_hidden(text_layer_get_layer(bt_layer), true);
//	layer_set_hidden(text_layer_get_layer(bt_border_layer), true);
}

//static

char *translate_error(AppMessageResult result) {
    switch (result) {
    case APP_MSG_OK:
        return "APP_MSG_OK";
    case APP_MSG_SEND_TIMEOUT:
        return "APP_MSG_SEND_TIMEOUT";
    case APP_MSG_SEND_REJECTED:
        return "APP_MSG_SEND_REJECTED";
    case APP_MSG_NOT_CONNECTED:
        return "APP_MSG_NOT_CONNECTED";
    case APP_MSG_APP_NOT_RUNNING:
        return "APP_MSG_APP_NOT_RUNNING";
    case APP_MSG_INVALID_ARGS:
        return "APP_MSG_INVALID_ARGS";
    case APP_MSG_BUSY:
        return "APP_MSG_BUSY";
    case APP_MSG_BUFFER_OVERFLOW:
        return "APP_MSG_BUFFER_OVERFLOW";
    case APP_MSG_ALREADY_RELEASED:
        return "APP_MSG_ALREADY_RELEASED";
    case APP_MSG_CALLBACK_ALREADY_REGISTERED:
        return "APP_MSG_CALLBACK_ALREADY_REGISTERED";
    case APP_MSG_CALLBACK_NOT_REGISTERED:
        return "APP_MSG_CALLBACK_NOT_REGISTERED";
    case APP_MSG_OUT_OF_MEMORY:
        return "APP_MSG_OUT_OF_MEMORY";
    case APP_MSG_CLOSED:
        return "APP_MSG_CLOSED";
    case APP_MSG_INTERNAL_ERROR:
        return "APP_MSG_INTERNAL_ERROR";
    default:
        return "UNKNOWN ERROR";
    }
}
