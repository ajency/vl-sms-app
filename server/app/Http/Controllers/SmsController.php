<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class SmsController extends Controller
{

    public function sendSms(Request $request)
    {
        $json = $request->input('json');

        $phone_number = $json['sms'];

        $message = $json['message'];

        return $this->initiateSmsGuzzle($phone_number, $message);

        // return redirect()->back()->with('message', 'Message has been sent successfully');
    }

    public function initiateSmsGuzzle($phone_number, $message)
    {
        $api_key     = env('SMS_API_KEY', '');
        $sender_id   = env('SMS_SENDER_ID', '');
        $environment = env('APP_ENV', 'dev');

        $client = new Client();
        foreach ($phone_number as $ph_value) {
            $sms_no_arr[] = array('to' => $ph_value);
        }

        if ($environment == 'prod') {
            $json_data = json_encode([
                "message" => $message,
                "sender"  => $sender_id,
                "sms"     => $sms_no_arr,
            ]);
        } else {
            $json_data = json_encode([
                "message" => "test",
                "sender"  => $sender_id,
                "sms"     => [
                    [
                        "to" => "919923036263",
                    ]],
            ]);

        }

        $response = $client->post('https://global.solutionsinfini.com/api/v4/?api_key=' . $api_key . '&method=sms.json&json=' . $json_data);

        if ($response['status'] == 'OK') {
            return [
                "status" => "success",
                "msg"    => "ok",
            ];
        }

        return $response;
    }
}
