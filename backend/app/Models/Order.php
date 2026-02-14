<?php

namespace App\Models;

use App\Models\OrderItem;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{

    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['id', 'user_id', 'total_price', 'status', 'qr_code', 'qr_image_url'];


    

    protected static function booted()
    {
        static::creating(fn($model) => $model->id = $model->id ?? (string) Str::uuid());
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function qrLogs()
    {
        return $this->hasMany(QrLog::class);
    }
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }


}
