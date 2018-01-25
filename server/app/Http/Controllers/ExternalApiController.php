<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class ExternalApiController extends Controller
{
    public function __construct(Client $client)
    {
        $this->client       = $client;
        $this->api_key      = 'd2e6472accb6dae0ba363ae3fff153a2';
        $this->user_secrete = 'e2a6bf9a-eeeb-4956-887d-968645feed99';
        $this->api_url      = env('EXTERNAL_API_URL');
    }
    public function trips()
    {

        $res = $this->client->request('GET', $this->api_url . '/admin/trips.json?ac_api_key=' . $this->api_key . '&user_secret=' . $this->user_secrete . '&offset=0&count=true&totalCount=true&limit=1000&order_by[]=state.asc,code.asc,id.desc&search_fields[]=name,code,supplier_name&search=tri');

        $data = json_decode($res->getBody(), true);

        foreach ($data['trips'] as $dvalue) {
            $final_data[] = [
                "id"   => $dvalue['id'],
                "name" => $dvalue['name'],
                "code" => $dvalue['code'],
            ];
        }

        return [
            "status" => "success",
            "msg"    => "ok",
            "data"   => $final_data,
        ];
    }

    public function departures(Request $request)
    {

        $filters = $request->input('filters');

        $current_date = date('Y-m-d');
        $fromdate     = date('Y-m-d', strtotime('-60 days', strtotime($current_date))); // last 60 days
        $trip_id      = $filters['trip_id'];

        $res = $this->client->request('GET', $this->api_url . '/api/v1/admin/departures.json?ac_api_key=' . $this->api_key . '&user_secret=' . $this->user_secrete . '&departure_from=' . $fromdate . '&limit=1000&trip_ids=' . $trip_id);

        $data = json_decode($res->getBody(), true);

        $final_data = array();
        foreach ($data['departures'] as $dvalue) {

            $end_date = explode('T', $dvalue['ends_at'])[0];

            if ($end_date <= $current_date) {
                $final_data[] = [
                    "departure_id" => $dvalue['id'],
                    "starts_at"    => $dvalue['starts_at'],
                    "ends_at"      => $dvalue['ends_at'],
                ];
            }
        }

        return [
            "status" => "success",
            "msg"    => "ok",
            "data"   => $final_data,
        ];
    }

    public function participants()
    {

       /* $res = $this->client->request('GET',  $this->api_url.'/api/v1/admin/departures/39420?ac_api_key=' . $this->api_key . '&user_secret=' . $this->user_secrete . '&include_booking_custom_forms=all&include_bookings=true&include_trip=true');

        $data = json_decode($res->getBody(), true);
        print_r($data);
        $final_data = array();*/
        /* foreach ($data['departures'] as  $dvalue) {
        $final_data[]= [
        "departure_id"   => $dvalue['id'],
        "starts_at" => $dvalue['starts_at'],
        "ends_at" => $dvalue['ends_at'],
        ];
        }

        return [
        "status" => "success",
        "msg"    => "ok",
        "data"   => $final_data
        ];*/

        return [
    "status" => "success",
    "msg"    => "ok",
    "data"   => [
    ["booking_id" => "BD5681236413", "passenger_id" => "1245", "passenger_name" => "Darcy P.", "primary" => true, "phone_no" => "914521258442", "phone_type" => 'mobile-self', "booking_status" => 'confirmed'],
    ["booking_id" => "BD461256413", "passenger_id" => "1245", "passenger_name" => "Loraine S.", "primary" => true, "phone_no" => "914526518442", "phone_type" => 'mobile-self', "booking_status" => 'confirmed'],
    ["booking_id" => "FD368456413", "passenger_id" => "1245", "passenger_name" => "Blossom D.", "primary" => false, "phone_no" => "914525658442", "phone_type" => 'Emergency mobile', "booking_status" => 'confirmed'],
    ["redundant_contact" => true, "booking_id" => "BD268456413", "passenger_id" => "1245", "passenger_name" => "Gerald N.", "primary" => false, "phone_no" => "914522658442", "phone_type" => 'Emergency mobile', "booking_status" => 'pending_confirmation'],
    ["booking_id" => "DE5456413", "passenger_id" => "1245", "passenger_name" => "Helga T.", "primary" => false, "phone_no" => "914254658442", "phone_type" => 'Emergency mobile', "booking_status" => 'confirmed'],
    ["redundant_contact" => true, "booking_id" => "GH6456413", "passenger_id" => "1245", "passenger_name" => "Jean R.", "primary" => true, "phone_no" => "914523665442", "phone_type" => 'mobile-self', "booking_status" => 'confirmed'],
    ["booking_id" => "LM58456413", "passenger_id" => "1245", "passenger_name" => "Nadia L.", "primary" => true, "phone_no" => "914548558442", "phone_type" => 'mobile-self', "booking_status" => 'pending-confirmation'],
    ["booking_id" => "NKJ8456413", "passenger_id" => "1245", "passenger_name" => "Nicole D.", "primary" => true, "phone_no" => "914523628442", "phone_type" => 'mobile-self', "booking_status" => 'confirmed'],
    ["redundant_contact" => true, "booking_id" => "VUD38456413", "passenger_id" => "1245", "passenger_name" => "Sania K.", "primary" => false, "phone_no" => "914517858442", "phone_type" => 'Father mobile', "booking_status" => 'confirmed'],
    ["redundant_contact" => true, "booking_id" => "YUDD8456413", "passenger_id" => "1245", "passenger_name" => "Hermoine F.", "primary" => false, "phone_no" => "914523635442", "phone_type" => 'Father mobile', "booking_status" => 'unconfirmed'],
    ["redundant_contact" => true, "booking_id" => "HJBF456413", "passenger_id" => "1245", "passenger_name" => "Duglus F.", "primary" => false, "phone_no" => "914845658442", "phone_type" => 'Father mobile', "booking_status" => 'pending_confirmation'],
    ["booking_id" => "TYF08456413", "passenger_id" => "1245", "passenger_name" => "Jackson J.", "primary" => true, "phone_no" => "914523759842", "phone_type" => 'Father mobile', "booking_status" => 'unconfirmed'],
    ["booking_id" => "UDO09456413", "passenger_id" => "1245", "passenger_name" => "Thomas K.", "primary" => false, "phone_no" => "914265984442", "phone_type" => 'Father mobile', "booking_status" => 'confirmed'],
    ["booking_id" => "SEA07456413", "passenger_id" => "1245", "passenger_name" => "Linda T", "primary" => false, "phone_no" => "914514588442", "phone_type" => 'mobile-self', "booking_status" => 'confirmed'],
    ]
    ];
     
    }

}
