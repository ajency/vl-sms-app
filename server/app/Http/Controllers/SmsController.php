<?php

namespace App\Http\Controllers;

use App\SmsNotification;
use App\SmsNotificationDeparture;
use App\SmsNotificationTrip;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class SmsController extends Controller
{

    public function sendSms(Request $request)
    {

        $phone_number        = $request->input('to');
        $message             = $request->input('message');
        $publishnotification = $request->input('publishnotification');
        $departure           = $request->input('departure');
        $trip                = $request->input('trip');

        if ($publishnotification) {
            $notification               = new SmsNotification;
            $notification->departure_id = $departure['departure_id'];
            $notification->trip_id      = $trip['id'];
            $notification->message      = $message;
            $notification->send_to      = serialize($phone_number);
            //$notification->created_at   = date('Y-m-d h:m:i');
            $notification->save();

            $departure_notification = new SmsNotificationDeparture;
            if (!SmsNotificationDeparture::where('departure_id', '=', $departure['departure_id'])->exists()) {
                $departure_notification->departure_id = $departure['departure_id'];
                $departure_notification->trip_id      = $trip['id'];
                $departure_notification->starts_at    = $departure['starts_at'];
                $departure_notification->ends_at      = $departure['ends_at'];
                //$departure_notification->created_at             = date('Y-m-d h:m:i');
                $departure_notification->save();
            }

            $trip_notification = new SmsNotificationTrip;
            if (!SmsNotificationTrip::where('trip_id', '=', $trip['id'])->exists()) {
                $trip_notification->trip_id = $trip['id'];
                $trip_notification->name    = $trip['name'];
                $trip_notification->code    = $trip['code'];
                // $trip_notification->created_at = date('Y-m-d h:m:i');
                $trip_notification->save();
            }

        }
        // return array('success');

        return $this->initiateSmsGuzzle($phone_number, $message);

    }

    public function initiateSmsGuzzle($phone_number, $message)
    {
        $api_key     = env('SMS_API_KEY', '');
        $sender_id   = env('SMS_SENDER_ID', '');
        $environment = env('APP_ENV', 'local');

        $client     = new Client();
        $sms_no_arr = array();

        if ($environment == 'production') {
            foreach ($phone_number as $ph_value) {
                $sms_no_arr[] = array('to' => $ph_value);
            }
            $json_data = json_encode([
                "message" => $message,
                "sender"  => $sender_id,
                "sms"     => $sms_no_arr,
            ]);
        } else {

            $test_no     = env('SMS_TEST_NO', '');
            $test_no_arr = explode(',', $test_no);

            foreach ($test_no_arr as $ph_value) {
                $sms_no_arr[] = array('to' => $ph_value);
            }

            $json_data = json_encode([
                "message" => $message,
                "sender"  => $sender_id,
                "sms"     => $sms_no_arr,
            ]);

        }

        $response = $client->post('https://global.solutionsinfini.com/api/v4/?api_key=' . $api_key . '&method=sms.json&json=' . $json_data);

        return [
            "status" => "success",
            "msg"    => "ok",
        ];
    }

    public function smsNotifications(Request $request)
    {
        $departure_id = $request->input('departure_id');

        $sms_notification = SmsNotification::where('departure_id', $departure_id)->select('message', 'created_at as date')->get();

        return [
            "status" => "success",
            "msg"    => "ok",
            "data"   => $sms_notification,
        ];
    }

    public function smsNotificaitonTrips(Request $request)
    {

        // set search query is passed
        if ($request->has('search')) {
            $search_query = $request->input('search');
        } else {
            $search_query = '';
        }

        // set offset is passed
        if ($request->has('offset')) {
            $offset = $request->input('offset');
        } else {
            $offset = 0;
        }

        // set limit is passed
        if ($request->has('limit')) {
            $limit = $request->input('limit');
        } else {
            $limit = 100;
        }

        $smsnotification = new SmsNotification;

        $final_data = $smsnotification->getPublishedNotification($limit, $offset, $search_query);

        $totalCount = SmsNotification::groupBy('sms_notifications.trip_id')->count();

        return [
            "status"     => "success",
            "msg"        => "ok",
            "data"       => $final_data,
            "count"      => count($final_data),
            "totalCount" => $totalCount,
        ];
    }

    public function smsNotificaitonDepartures(Request $request)
    {
        $filters    = $request->input('filters');
        $trip_id    = $filters['trip_id'];
        $final_data = SmsNotificationDeparture::where('trip_id', $trip_id)->select('departure_id', 'starts_at', 'ends_at')->get()->toArray();

        return [
            "status" => "success",
            "msg"    => "ok",
            "data"   => $final_data,
        ];
    }
}
