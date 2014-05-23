#pragma once
	
void layer_set_hidden (Layer *layer, bool hidden); 	
void handle_bluetooth(bool); 
char *translate_error(AppMessageResult result); 
//void handle_battery(BatteryChargeState charge_state);