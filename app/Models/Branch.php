<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Warehouse; // Don't forget to import Warehouse model

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'phone',
    ];

    public function warehouses()
    {
        return $this->hasMany(Warehouse::class);
    }
}
