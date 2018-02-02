<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

/*Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::post('login', 'Auth\LoginController@login');

Route::post('sms-notifications', 'SmsController@smsNotifications');


Route::group(['middleware' => ['isValidUser']], function () {
  Route::post('trip-passengers', 'ExternalApiController@participants');
  Route::post('trips', 'ExternalApiController@trips');
  Route::post('departures', 'ExternalApiController@departures'); 
  Route::post('send-sms', 'SmsController@sendSms');
});

