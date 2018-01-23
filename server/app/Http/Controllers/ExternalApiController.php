<?php

namespace App\Http\Controllers;

class ExternalApiController extends Controller
{
    public function trips()
    {
        return [
            "status" => "success",
            "msg"    => "ok",
            "data"   => [
                [
                    [
                        "id"   => "1",
                        "name" => "Little Rann of Kutch 1",
                        "code" => "LROK1",
                    ],
                    [
                        "id"   => "2",
                        "name" => "Little Rann of Kutch 2",
                        "code" => "LROK2",
                    ],
                    [
                        "id"   => "3",
                        "name" => "Little Rann of Kutch 3",
                        "code" => "LROK3",
                    ],
                    [
                        "id"   => "4",
                        "name" => "Little Rann of Kutch 4",
                        "code" => "LROK3",
                    ],
                    [
                        "id"   => "5",
                        "name" => "Little Rann of Kutch 5",
                        "code" => "LROK3",
                    ],
                    [
                        "id"   => "6",
                        "name" => "Little Rann of Kutch 6",
                        "code" => "LROK3",
                    ],

                ],
            ],
        ];
    }

    public function departures()
    {
        return [
            "status" => "success",
            "msg"    => "ok",
            "data"   => [[
                [
                    "departure_id" => 1,
                    "starts_at"    => '2017-09-16T09:00:00',
                    "ends_at"      => '2017-09-19T10:00:00',
                ],
                [
                    "departure_id" => 2,
                    "starts_at"    => '2017-09-18T09:00:00',
                    "ends_at"      => '2017-10-22T10:00:00',
                ],
                [
                    "departure_id" => 3,
                    "starts_at"    => '2017-09-21T09:23:00',
                    "ends_at"      => '2017-09-27T10:00:00',
                ],
                [
                    "departure_id" => 4,
                    "starts_at"    => '2017-09-20T21:00:00',
                    "ends_at"      => '2017-10-16T10:00:00',
                ],
                [
                    "departure_id" => 5,
                    "starts_at"    => '2017-11-06T00:00:00',
                    "ends_at"      => '2017-11-09T10:00:00',
                ],
                [
                    "departure_id" => 6,
                    "starts_at"    => '2017-12-16T09:00:00',
                    "ends_at"      => '2018-01-01T10:00:00',
                ],
            ]],
        ];
    }

    public function participants()
    {
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
            ]];

    }

}
