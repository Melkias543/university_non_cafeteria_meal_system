<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Deposit;
use App\Models\Order;
use App\Models\QrLog;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Testing\Fluent\Concerns\Has;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles; // Add this line

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable , HasUuids ,HasRoles, HasApiTokens;
    protected $guard_name = 'sanctum'; // important for API


    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'full_name',
        'status', 
        'email',
        'password',
    
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function wallet() { return $this->hasOne(Wallet::class); }
    public function orders() { return $this->hasMany(Order::class); }
    public function deposits() { return $this->hasMany(Deposit::class); }
    public function transactions() { return $this->hasMany(Transaction::class); }
    public function qrLogs() { return $this->hasMany(QrLog::class,'scanned_by'); }
    
    
    
    
}
