<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class SmsController extends Controller
{

    public function sendSms(Request $request)
    {
        $phone_number = '919923036263';

        $message = "A message has been sent to you";

        return $this->initiateSmsGuzzle($phone_number, $message);

        // return redirect()->back()->with('message', 'Message has been sent successfully');
    }

    public function initiateSmsGuzzle($phone_number, $message)
    {
        $api_key   = env('SMS_API_KEY', '');
        $sender_id = env('SMS_SENDER_ID', '');

        $client = new Client();

        $json_data = json_encode([
            "message" => "test",
            "sender"  => $sender_id,
            "sms"     => [
                [
                    "to" => "919923036263",
                ]],
        ]);

        $response = $client->post('https://global.solutionsinfini.com/api/v4/?api_key=' . $api_key . '&method=sms.json&json=' . $json_data);

        return $response = json_decode($response->getBody(), true);
    }
}
