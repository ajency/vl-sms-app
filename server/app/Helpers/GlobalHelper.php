<?php

namespace App\Helpers;

use App\Account;

class GlobalHelper
{
    public function getUserApiSecret($user_id)
    {
        $user = Account::where('user_id', $user_id)->first()->toArray();
        return $user;
    }
}
