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

    protected $casts = [
        'scanned_at' => 'datetime',
        'expired_at' => 'datetime',
        'is_valid' => 'boolean',
    ];

public static function booted()
    {
        static::creating(fn($model) => $model->id = $model->id ?? (string) Str::uuid());


        static::creating(function ($qrLog) {
            if (!$qrLog->expired_at) {
                $qrLog->expired_at = now()->addHours(2);
            }
        });
        
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }


    // Optional: mark as scanned
    // public function markAsScanned($userId)
    // {
    //     $this->update([
    //         'scanned_by' => $userId,
    //         'scanned_at' => now(),
    //     ]);
    // }
    public function scannedBy()
    {
        return $this->belongsTo(User::class, 'scanned_by');
    }
}
