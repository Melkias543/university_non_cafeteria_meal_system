<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use Illuminate\Support\Str;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    // Tell Laravel the ID is a string, not an integer
    protected $keyType = 'string';
    public $incrementing = false;

    // Automatically generate a UUID for the token's own ID when creating
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($item) {
            if (empty($item->{$item->getKeyName()})) {
                $item->{$item->getKeyName()} = (string) Str::uuid();
            }
        });
    }
}
