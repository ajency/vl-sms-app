<?php

namespace App\Http\Controllers;

use App\Account;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $email       = $request->input('email');
        $password    = $request->input('password');
        $api_key     = $request->input('api_key');
        $user_secret = $request->input('user_secret');

         $validatedData = $request->validate([
        'email' => 'required|unique:users|max:255',
        'password' => 'required',
        'api_key' => 'required',
        'user_secret' => 'required',
        ]);

       
            $user             = new User;
            $user->name      = $email;
            $user->email      = $email;
            $user->password   = Hash::make($password);
            $user->created_at = date('Y-m-d h:m:i');
            $user->save();
            $lastInsertedId = $user->id;

            $account          = new Account;
            $account->user_id = $lastInsertedId;
            $account->api_key = $api_key;
            $account->user_secret = $user_secret;
            $account->save();
            
            return array('User Successfully Created');
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
