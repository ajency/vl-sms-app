<?php

namespace App\Http\Middleware;

use App\User;
use Closure;

class IsValidUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {   
        $access_token = $request->input('access_token');
        $user_data    = User::where('access_token', $access_token)->first();

        if ($user_data == null) {
            
            if($request->route()->uri=="api/trip-passengers" || $request->route()->uri=="api/send-sms"){
                abort(401);
            }
            $user_id = 1; //default config 

        } else {
            $user_id = $user_data->id;
        }
        $request->attributes->add(['user_id' => $user_id]);
        return $next($request);
    }
}
