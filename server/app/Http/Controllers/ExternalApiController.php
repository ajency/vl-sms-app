<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use App\Helpers\GlobalHelper;
class ExternalApiController extends Controller
{
    protected $request;

    public function __construct(Client $client, Request $request)
    {
        $this->client       = $client;
        // $this->api_key      = env('USER_API_KEY');
        // $this->user_secrete = env('USER_SECRET_KEY');
        $this->api_url      = env('EXTERNAL_API_URL');
    }

    public function trips(Request $request)
    {
        
        $user_id = \Request::get('user_id');

        $globalhelper=new GlobalHelper;
        $user = $globalhelper->getUserApiSecret($user_id);

        if(empty($user)){
            return [ "message" => "Unauthenticated."];
        }
         

        $final_data = array();

        $request_url = $this->api_url . '/admin/trips.json?ac_api_key=' . $user['api_key'] . '&user_secret=' . $user['user_secret'] . '&count=true&totalCount=true&order_by[]=state.asc&order_by[]=code.asc&order_by[]=id.desc&search_fields[]=name&search_fields[]=code&search_fields[]=supplier_name';

 
        // set search query is passed
        if ($request->has('search')) {
            $search_query = $request->input('search');
            $request_url  = $request_url . '&search=' . $search_query;
        } else {
            $search_query = '';
        }

        // set offset is passed
        if ($request->has('offset')) {
            $offset = $request->input('offset');
        } else {
            $offset = 0;
        }

        if ($offset) {
            $request_url = $request_url . '&offset=' . $offset;
        }

        // set limit is passed
        if ($request->has('limit')) {
            $limit = $request->input('limit');
        } else {
            $limit = 100;
        }

        if ($limit) {
            $request_url = $request_url . '&limit=' . $limit;
        }

        $res = $this->client->request('GET', $request_url);

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
            "status"     => "success",
            "msg"        => "ok",
            "data"       => $final_data,
            "count"      => $data['count'],
            "totalCount" => $data['totalCount'],
        ];
    }

    public function departures(Request $request)
    {
        $user_id = \Request::get('user_id');
        $globalhelper=new GlobalHelper;
        $user = $globalhelper->getUserApiSecret($user_id);

        if(empty($user)){
        return [ "message" => "Unauthenticated."];
        } 

        $filters = $request->input('filters');

        $current_date = date('Y-m-d');
        $fromdate     = date('Y-m-d', strtotime('-60 days', strtotime($current_date))); // last 60 days
        $trip_id      = $filters['trip_id'];

        $res = $this->client->request('GET', $this->api_url . '/api/v1/admin/departures.json?ac_api_key=' . $user['api_key'] . '&user_secret=' . $user['user_secret'] . '&departure_from=' . $fromdate . '&limit=1000&trip_ids=' . $trip_id);

        
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
         $user_id = \Request::get('user_id');

         $globalhelper=new GlobalHelper;
        $user = $globalhelper->getUserApiSecret($user_id);

        if(empty($user)){
        return [ "message" => "Unauthenticated."];
        }

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

        $res = $this->client->request('GET', $this->api_url . '/api/v1/admin/departures/' . $departure_id . '?ac_api_key=' . $user['api_key'] . '&user_secret=' . $user['user_secret'] . '&include_booking_custom_forms=all&include_bookings=true&include_trip=true');

        $data = json_decode($res->getBody(), true);
       
        $final_data             = array();
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
                    "phone_type"        => 'Phone number',
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
                        "phone_type"        => 'Phone number alt',
                        "booking_status"    => $booking_status,
                        "redundant_contact" => true,
                    ];

                    $final_data[] = $primary_alt_contact;
                }

                /**
                 * additional phone no for primary contact
                 */
                if (!empty($dvalue['custom_form_values'])) {
                    $additional_primary_details = array();

                    foreach ($dvalue['custom_form_values'] as $cus_key => $cus_value) {

                        if (strpos($cus_key, 'vl_phone') !== false) {

                            $phone_type = isset($data['booking_custom_forms']['']);

                            if (isset($cus_value['country_code']) && isset($cus_value['number'])) {
                                $additional_primary_details['vl_phone'] = $cus_value['country_code'] . $cus_value['number'];
                                if (!isset($additional_primary_details['vl_first_name'])) {

                                    $additional_primary_details['vl_first_name'] = $additional_primary_details['vl_phone'];
                                    $additional_primary_details['vl_last_name']  = '';
                                    $additional_phone_type                       = '';
                                    foreach ($data['booking_custom_forms'] as $booking_custom_value) {
                                        $additional_phone_type = isset($booking_custom_value['json_schema'][$cus_key]['title']) ? $booking_custom_value['json_schema'][$cus_key]['title'] : "Country code and phone number";
                                    }

                                    $additional_primary_details['vl_phone_type'] = $additional_phone_type;

                                }
                            }
                        }
                    }

                    $final_additional_primary_data=array();
                    if (!empty($additional_primary_details)) {
                            if($additional_primary_details['vl_first_name']!=''){
                            $final_additional_primary_data = [
                                "booking_id"        => $dvalue['booking_ref'],
                                "booking_ref_url"   => $booking_ref_url,
                                "passenger_name"    => $additional_primary_details['vl_first_name'] . ' ' . $additional_primary_details['vl_last_name'],
                                "primary"           => false,
                                "phone_no"          => isset($additional_primary_details['vl_phone']) ? $additional_primary_details['vl_phone'] : "",
                                "phone_type"        => '',
                                "booking_status"    => $booking_status,
                                "redundant_contact" => '',
                            ];

                            $final_data[] = $final_additional_primary_data;
                        }

                    }
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

                                if (isset($cus_value['country_code']) && isset($cus_value['number'])) {
                                    $other_passenger_details['vl_phone'] = $cus_value['country_code'] . $cus_value['number'];
                                    if (!isset($other_passenger_details['vl_first_name'])) {
                                        $other_passenger_details['vl_first_name'] = $other_passenger_details['vl_phone'];
                                        $other_passenger_details['vl_last_name']  = '';
                                    }

                                    $other_phone_type      = '';
                                    $additional_phone_type = isset($data['pax_custom_form']['json_schema'][$cus_key]['title']) ? $data['pax_custom_form']['json_schema'][$cus_key]['title'] : "Country code and phone number";

                                    $other_passenger_details['vl_phone_type'] = $additional_phone_type;

                                }

                            }

                        }

                        $final_other_passenger_data=array();
                        if (!empty($other_passenger_details)) {
                            if($other_passenger_details['vl_first_name'] !=''){
                                $final_other_passenger_data = [
                                    "booking_id"        => $dvalue['booking_ref'],
                                    "booking_ref_url"   => $booking_ref_url,
                                    "passenger_name"    => $other_passenger_details['vl_first_name'] . ' ' . $other_passenger_details['vl_last_name'],
                                    "primary"           => false,
                                    "phone_no"          => isset($other_passenger_details['vl_phone']) ? $other_passenger_details['vl_phone'] : "",
                                    "phone_type"        => isset($other_passenger_details['vl_phone_type'])?$other_passenger_details['vl_phone_type']:"",
                                    "booking_status"    => $booking_status,
                                    "redundant_contact" => "",
                                ];

                                // if ( ($final_other_passenger_data['phone_no'] != $primary_contact_person['phone_no']) || ( isset($primary_alt_contact['phone_no']) and $final_other_passenger_data['phone_no'] != $primary_alt_contact['phone_no']) ){

                                $final_data[] = $final_other_passenger_data;
                            }

                            // }
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
