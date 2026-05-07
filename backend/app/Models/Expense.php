<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = ['expense_date', 'category', 'description', 'amount'];

    protected $casts = [
        'amount'       => 'integer',
        'expense_date' => 'date',
    ];
}
