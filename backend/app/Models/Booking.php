<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'booking_code', 'customer_name', 'customer_phone', 'customer_email',
        'package_id', 'package_name', 'booking_date', 'slot_time',
        'total_price', 'status', 'notes', 'addon_ids',
    ];

    protected $casts = [
        'total_price'  => 'integer',
        'booking_date' => 'date',
        'addon_ids'    => 'array',   // otomatis encode/decode JSON
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
