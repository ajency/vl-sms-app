<?php

namespace App\Http\Controllers;

use App\SmsNotification;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class SmsController extends Controller
{

    public function sendSms(Request $request)
    {

        $phone_number        = $request->input('to');
        $message             = $request->input('message');
        $publishnotification = $request->input('publishnotification');
        $departure_id        = $request->input('departure_id');

        if ($publishnotification) {
            $notification               = new SmsNotification;
            $notification->departure_id = $departure_id;
            $notification->message      = $message;
            $notification->send_to      = serialize($phone_number);
            $notification->created_at   = date('Y-m-d h:m:i');
            $notification->save();

        }
        return $this->initiateSmsGuzzle($phone_number, $message);

    }

    public function initiateSmsGuzzle($phone_number, $message)
    {
        $api_key     = env('SMS_API_KEY', '');
        $sender_id   = env('SMS_SENDER_ID', '');
        $environment = env('APP_ENV', 'dev');

        $client     = new Client();
        $sms_no_arr = array();

        if ($environment == 'prod') {
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
}
