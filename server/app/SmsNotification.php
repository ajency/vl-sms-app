<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SmsNotification extends Model
{
    public function getPublishedNotification($limit, $offset, $search_query)
    {
        $sms_notifications = SmsNotification::join('sms_notification_trips', 'sms_notification_trips.trip_id', '=', 'sms_notifications.trip_id');

        if (trim($search_query) != '') {
            $sms_notifications->where('name','like',"%$search_query%")->orWhere('code','like',"%$search_query%");
        }

       return $sms_notifications->select('sms_notification_trips.trip_id as id', 'code', 'name')
            ->distinct('sms_notifications.trip_id')
            ->limit($limit)
            ->offset($offset)
            ->get()
            ->toArray();

    }
}
