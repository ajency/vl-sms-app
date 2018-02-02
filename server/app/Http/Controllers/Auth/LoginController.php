<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function login(Request $request){
      
       $email = $request->input('username');
       $password = $request->input('password');

       $user_results = User::where('email', $email)->first();

        if (empty($user_results)) {
            return array('status' =>'error','msg' => 'Wrong Username');
        }

        if (Hash::check($password, $user_results->password)) {
         
            $access_token=md5(uniqid($email, true));

            User::where('id', $user_results->id)
              ->update(['access_token' => $access_token]);

           // $access_token  = $user_results->createToken('access-token')->accessToken;
            return array('status' =>'success','msg' => 'ok' ,'token' =>$access_token );
        }
        return array('status' =>'error','msg' => 'Wrong Password');     
    }
}
