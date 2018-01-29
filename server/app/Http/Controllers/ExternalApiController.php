<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class ExternalApiController extends Controller
{

    public function __construct(Client $client)
    {
        $this->client       = $client;
        $this->api_key      = env('USER_API_KEY');
        $this->user_secrete = env('USER_SECRET_KEY');
        $this->api_url      = env('EXTERNAL_API_URL');
    }

    public function trips(Request $request)
    {
        $request_url = $this->api_url . '/admin/trips.json?ac_api_key=' . $this->api_key . '&user_secret=' . $this->user_secrete . '&count=true&totalCount=true&order_by[]=state.asc&order_by[]=code.asc&order_by[]=id.desc&search_fields[]=name&search_fields[]=code&search_fields[]=supplier_name';

        
        // set search query is passed 
        if ($request->has('search')){
            $search_query = $request->input('search');
            $request_url = $request_url .'&search=' . $search_query ;
        }
        else{
            $search_query = '';
        }

        
        // set offset is passed 
        if ($request->has('offset')){
            $offset = $request->input('offset');
        }
        else{
            $offset = 0;
        } 

        if($offset){
            $request_url = $request_url .'&offset=' . $offset ;
        }
        
        // set limit is passed 
        if ($request->has('limit')){
            $limit = $request->input('limit');
        }
        else{
            $limit = 100;
        } 

        if($limit){
            $request_url = $request_url .'&limit=' . $limit ;
        }
        


        $res = $this->client->request('GET', $request_url );

        $data = json_decode($res->getBody(), true);

        foreach ($data['trips'] as $dvalue) {
            if ($dvalue['code'] != null) {
                $final_data[] = [
                    "id"   => $dvalue['id'],
                    "name" => $dvalue['name'],
                    "code" => $dvalue['code'],
                ];
            }
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

            if ($end_date >= $current_date) {
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

        $status_arr = array(
            "confirmed"            => "confirmed",
            "pending_confirmation" => "pending_confirmation",
            "pending_inquiry"      => "pending_inquiry",
            "cancelled"            => "cancelled",
            "rejected"             => "rejected",
            "complete"             => "unconfirmed",
            "incomplete"           => "incomplete",
            "cart_abandoned"       => "cart_abandoned",
        ); //complete status label is different

        $res = $this->client->request('GET', $this->api_url . '/api/v1/admin/departures/' . $departure_id . '?ac_api_key=' . $this->api_key . '&user_secret=' . $this->user_secrete . '&include_booking_custom_forms=all&include_bookings=true&include_trip=true');

        $data = json_decode($res->getBody(), true);
        //print_r($data);
        $final_data = array();
        $primary_contact_person = array();
        
        $primary_alt_contact = array();

        foreach ($data['bookings'] as $dvalue) {

            $booking_status  = isset($dvalue['state']) ? $status_arr[$dvalue['state']] : "";
            $booking_ref_url = $this->api_url . '/admin/itineraries#/bookings/' . $dvalue['id'] . '/edit';

            if (!empty($dvalue['primary_contact_person'])) {

                $name_pri      = isset($dvalue['primary_contact_person']['full_name']) ? $dvalue['primary_contact_person']['full_name'] : "";
                $phone_pri     = isset($dvalue['primary_contact_person']['phone']) ? $dvalue['primary_contact_person']['phone'] : "";
                $phone_alt_pri = isset($dvalue['primary_contact_person']['phone_alt']) ? $dvalue['primary_contact_person']['phone_alt'] : "";

                if ($phone_pri == 'no phone given') {
                    $phone_pri = '';
                }

                //primary phoneno data
                $primary_contact_person = [
                    "booking_id"        => $dvalue['booking_ref'],
                    "booking_ref_url"   => $booking_ref_url,
                    "passenger_name"    => $name_pri,
                    "primary"           => true,
                    "phone_no"          => $phone_pri,
                    "phone_type"        => '',
                    "booking_status"    => $booking_status,
                    "redundant_contact" => false,
                ];

                $final_data[] = $primary_contact_person;


                //alt phoneno -data
                if ($phone_alt_pri != '' && $phone_alt_pri != null) {

                    $primary_alt_contact = [
                        "booking_id"        => $dvalue['booking_ref'],
                        "booking_ref_url"   => $booking_ref_url,
                        "passenger_name"    => $name_pri,
                        "primary"           => true,
                        "phone_no"          => $phone_alt_pri,
                        "phone_type"        => '',
                        "booking_status"    => $booking_status,
                        "redundant_contact" => true,
                    ];

                    $final_data[] = $primary_alt_contact;
                }

            }
            if (!empty($dvalue['passengers'])) {

                foreach ($dvalue['passengers'] as $passenger_val) {

                    if (!empty($passenger_val['custom_form_values'])) {
                        $other_passenger_details = array();
                        foreach ($passenger_val['custom_form_values'] as $cus_key => $cus_value) {

                            if (strpos($cus_key, 'vl_full_name_with_title') !== false) {

                                $first_name_other = isset($cus_value['first_name']) ? $cus_value['first_name'] : "";
                                $last_name_other  = isset($cus_value['last_name']) ? $cus_value['last_name'] : "";

                                $other_passenger_details['vl_first_name'] = $first_name_other;
                                $other_passenger_details['vl_last_name']  = $last_name_other;

                            } else if (strpos($cus_key, 'vl_first_name') !== false) {

                                $other_passenger_details['vl_first_name'] = $cus_value;

                            } else if (strpos($cus_key, 'vl_last_name') !== false) {

                                $other_passenger_details['vl_last_name'] = $cus_value;

                            } else if (strpos($cus_key, 'vl_phone') !== false) {

                                $other_passenger_details['vl_phone'] = $cus_value['country_code'] . $cus_value['number'];
                                if (!isset($other_passenger_details['vl_first_name'])) {
                                    $other_passenger_details['vl_first_name'] = $other_passenger_details['vl_phone'];
                                    $other_passenger_details['vl_last_name']  = '';
                                }

                            }

                        }
                        if (!empty($other_passenger_details) ) {
                            $final_other_passenger_data = [
                                "booking_id"        => $dvalue['booking_ref'],
                                "booking_ref_url"   => $booking_ref_url,
                                "passenger_name"    => $other_passenger_details['vl_first_name'] . ' ' . $other_passenger_details['vl_last_name'],
                                "primary"           => false,
                                "phone_no"          => isset($other_passenger_details['vl_phone']) ? $other_passenger_details['vl_phone'] : "",
                                "phone_type"        => '',
                                "booking_status"    => $booking_status,
                                "redundant_contact" => '',
                            ];

                            if ( ($final_other_passenger_data['phone_no'] != $primary_contact_person['phone_no']) || ( isset($primary_alt_contact['phone_no']) and $final_other_passenger_data['phone_no'] != $primary_alt_contact['phone_no']) ){

                                $final_data[] = $final_other_passenger_data;

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
