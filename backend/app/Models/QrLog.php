<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class QrLog extends Model
{



    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['order_id', 'scanned_by', 'scanned_at', 'is_valid', 'expired_at'];

public static function booted()
    {
        static::creating(fn($model) => $model->id = $model->id ?? (string) Str::uuid());
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    public function admin()
    {
        return $this->belongsTo(User::class, 'scanned_by');
    }




}
