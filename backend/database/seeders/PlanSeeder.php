<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Starter', 'description' => 'For new stores getting started',
                'monthly_price' => 19, 'yearly_price' => 190,
                'product_limit' => 200, 'admin_user_limit' => 1, 'custom_domain_limit' => 0,
                'features' => ['200 products', '1 admin user', 'Subdomain store URL', 'Email support'],
                'featured' => false,
            ],
            [
                'name' => 'Growth', 'description' => 'For growing stores that need more',
                'monthly_price' => 49, 'yearly_price' => 490,
                'product_limit' => 2000, 'admin_user_limit' => 5, 'custom_domain_limit' => 1,
                'features' => ['2,000 products', '5 admin users', '1 custom domain', 'Priority support + chat'],
                'featured' => true,
            ],
            [
                'name' => 'Enterprise', 'description' => 'For high-volume stores',
                'monthly_price' => 129, 'yearly_price' => 1290,
                'product_limit' => null, 'admin_user_limit' => null, 'custom_domain_limit' => null,
                'features' => ['Unlimited products', 'Unlimited admin users', 'Unlimited custom domains', 'Dedicated account manager'],
                'featured' => false,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['name' => $plan['name']], $plan);
        }
    }
}
