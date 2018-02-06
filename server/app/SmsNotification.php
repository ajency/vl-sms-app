<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SmsNotification extends Model
{
    public function getPublishedNotification($limit, $offset, $search_query)
    {
        return SmsNotification::join('sms_notification_trips', 'sms_notification_trips.trip_id', '=', 'sms_notifications.trip_id')
            ->select('sms_notification_trips.trip_id as id', 'code', 'name')
            ->distinct('sms_notifications.trip_id')
            ->limit($limit)
            ->offset($offset)
            ->get()
            ->toArray();
    }
}
