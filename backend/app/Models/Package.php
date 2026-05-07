<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = [
        'title',
        'meta',
        'description',
        'price',
        'image_path',
        'is_active',
        'is_special',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'is_special' => 'boolean',
        'price'      => 'integer',
    ];
}
