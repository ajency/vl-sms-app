<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SmsNotification extends Model
{
    public function getPublishedNotification($limit, $offset, $search_query)
    {
        $current_date=date('Y-m-d');

        $sms_notifications = SmsNotification::join('sms_notification_trips', 'sms_notification_trips.trip_id', '=', 'sms_notifications.trip_id')
        ->join('sms_notification_departures','sms_notification_departures.departure_id','=','sms_notifications.departure_id')
        ->whereRaw("'".$current_date."' between date(starts_at) and date(ends_at)");

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
