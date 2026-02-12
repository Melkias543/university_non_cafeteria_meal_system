<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderItem extends Model
{


    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['order_id', 'menu_id', 'quantity', 'price'];

                  public static function booted()
                        {
                            static::creating(fn($model) => $model->id = $model->id ?? (string) Str::uuid());
                        }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }



}
