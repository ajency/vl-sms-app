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

    public function participants(Request $request)
    {
        $departure_id = $request->input('departure_id');
        
        $res = $this->client->request('GET', $this->api_url . '/api/v1/admin/departures/' . $departure_id . '?ac_api_key=' . $this->api_key . '&user_secret=' . $this->user_secrete . '&include_booking_custom_forms=all&include_bookings=true&include_trip=true');

        $data = json_decode($res->getBody(), true);
        //print_r($data);
        $final_data = array();

        foreach ($data['bookings'] as $dvalue) {
            if (!empty($dvalue['primary_contact_person'])) {
                $name_pri=isset($dvalue['primary_contact_person']['full_name']) ? $dvalue['primary_contact_person']['full_name'] : "";
                $phone_pri=isset($dvalue['primary_contact_person']['phone']) ? $dvalue['primary_contact_person']['phone'] : "";
                $booking_status=isset($dvalue['state']) ? $dvalue['state'] : "";
                $final_data[] = [
                    "booking_id"        => $dvalue['booking_ref'],
                    "booking_ref_url"   => '',
                    "passenger_name"    => $name_pri,
                    "primary"           => true,
                    "phone_no"          => $phone_pri,
                    "phone_type"        => '',
                    "booking_status"    => $booking_status,
                    "redundant_contact" => '',
                ];
            }
            if (!empty($dvalue['passengers'])) {
                
                $booking_status=isset($dvalue['state']) ? $dvalue['state'] : "";

                foreach ($dvalue['passengers'] as $passenger_val) {

                    if (!empty($passenger_val['custom_form_values'])) {

                        foreach ($passenger_val['custom_form_values'] as $cus_key => $cus_value) {

                            if (strpos($cus_key, 'vl_full_name_with_title') !== false) {

                                $first_name_other=isset($cus_value['first_name'])?$cus_value['first_name']:"";
                                $last_name_other=isset($cus_value['last_name'])?$cus_value['last_name']:"";

                                $final_data[] = [
                                    "booking_id"        => $dvalue['booking_ref'],
                                    "booking_ref_url"   => '',
                                    "passenger_name"    => $first_name_other . '' . $last_name_other,
                                    "primary"           => false,
                                    "phone_no"          => "914521258442",
                                    "phone_type"        => '',
                                    "booking_status"    => $booking_status,
                                    "redundant_contact" => '',
                                ];
                            }
                        }
                    }
                }
            }
        }

        return [
            "status" => "success",
            "msg"    => "ok",
            "data"   => $final_data,
        ];

    }

}
