<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Deposit extends Model
{


    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = ['user_id', 'amount', 'month'];

    protected static function booted()
    {
        static::creating(fn($model) => $model->id = $model->id ?? (string) Str::uuid());
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }


}
