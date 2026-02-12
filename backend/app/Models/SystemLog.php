<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class SystemLog extends Model
{

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['user_id', 'action', 'details'];

    public static function booted()
    {
        static::creating(fn($model) => $model->id = $model->id ?? (string) Str::uuid());
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
