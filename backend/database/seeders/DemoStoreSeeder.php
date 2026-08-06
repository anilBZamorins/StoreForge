<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Cart;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use App\Services\ProvisionTenant;
use App\Services\TenantDatabase;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeds the "Aura Living" demo tenant — the same dataset the Angular apps
 * ship in their mock.ts files, so useMocks:false looks identical to mock mode.
 */
class DemoStoreSeeder extends Seeder
{
    public function run(): void
    {
        $growth = Plan::where('name', 'Growth')->firstOrFail();

        $store = Store::updateOrCreate(['slug' => 'auraliving'], [
            'name' => 'Aura Living',
            'database' => TenantDatabase::databaseNameFor('auraliving'),
            'plan_id' => $growth->id,
            'billing_cycle' => 'monthly',
            'status' => 'active',
            'theme_color' => '#FF5A36',
            'support_email' => 'support@auraliving.com',
            'support_phone' => '+1 (555) 220-4471',
            'address' => '221 Birchwood Lane, Austin, TX 78701',
        ]);

        // Create + migrate the tenant's OWN database, then seed into it.
        $provisioner = app(ProvisionTenant::class);
        $provisioner->createDatabase($store);
        $provisioner->migrate($store);
        TenantDatabase::use($store);

        // ---- Users ----
        User::updateOrCreate(['email' => 'owner@auraliving.com'], [
            'name' => 'Nikhil Rao', 'password' => Hash::make('password'),
            'role' => 'store_owner', 'store_id' => $store->id,
        ]);
        User::updateOrCreate(['email' => 'admin@storeforge.io'], [
            'name' => 'Platform Admin', 'password' => Hash::make('password'),
            'role' => 'super_admin', 'store_id' => null,
        ]);

        // ---- Categories (parent => subs) ----
        $tree = [
            'Home Textiles' => ['textiles', ['Bedding & Linen' => 'bedding', 'Rugs & Throws' => 'rugs']],
            'Decor' => ['decor', ['Lighting' => 'lighting', 'Wall Art' => 'wallart', 'Vases & Planters' => 'vases']],
            'Furniture' => ['furniture', ['Seating' => 'seating', 'Tables' => 'tables']],
        ];
        $subs = [];
        foreach ($tree as $parentName => [$parentSlug, $children]) {
            $parent = Category::updateOrCreate(
                ['slug' => $parentSlug],
                ['name' => $parentName, 'parent_id' => null],
            );
            foreach ($children as $childName => $childSlug) {
                $subs[$childSlug] = Category::updateOrCreate(
                    ['slug' => $childSlug],
                    ['name' => $childName, 'parent_id' => $parent->id],
                );
            }
        }

        // ---- Products ----
        $products = [
            ['Linen Weave Duvet Set', 'bedding', 129, 10, 52, 'AL-BED-101', '🛏️', 4.7, true, false, 'Woven from pre-washed European linen, this duvet set softens with every wash while keeping its shape season after season.'],
            ['Organic Cotton Pillowcases (Pair)', 'bedding', 39, 0, 88, 'AL-BED-114', '🛏️', 4.5, false, true, 'A pair of breathable, GOTS-certified organic cotton pillowcases with a smooth sateen finish.'],
            ['Handwoven Jute Area Rug', 'rugs', 189, 15, 21, 'AL-RUG-208', '🧶', 4.6, true, false, 'Handwoven by artisan partners using natural jute fiber — warmth and texture underfoot.'],
            ['Chunky Knit Throw Blanket', 'rugs', 69, 0, 9, 'AL-RUG-219', '🧣', 4.8, false, true, 'Oversized and cable-knit from a soft acrylic-wool blend.'],
            ['Rattan Pendant Light Shade', 'lighting', 99, 0, 34, 'AL-LGT-303', '💡', 4.4, true, false, 'Hand-woven natural rattan casts warm, dappled light across any room.'],
            ['Ceramic Table Lamp', 'lighting', 79, 12, 5, 'AL-LGT-311', '🪔', 4.3, false, false, 'A hand-glazed ceramic base paired with a soft linen shade.'],
            ['Abstract Line Art Print Set', 'wallart', 59, 0, 62, 'AL-ART-402', '🖼️', 4.6, false, true, 'A set of three minimalist line-art prints on archival matte paper.'],
            ['Terracotta Wall Planter Trio', 'vases', 45, 8, 0, 'AL-VAS-517', '🪴', 4.2, false, false, 'Three graduated terracotta planters with hidden wall mounts.'],
            ['Fluted Ceramic Vase, Large', 'vases', 65, 0, 27, 'AL-VAS-522', '🏺', 4.7, true, false, 'A sculptural fluted vase in matte-glazed ceramic.'],
            ['Boucle Accent Armchair', 'seating', 449, 5, 6, 'AL-FUR-601', '🛋️', 4.8, true, true, 'Curved boucle upholstery over a solid hardwood frame.'],
            ['Oak Round Side Table', 'tables', 219, 0, 14, 'AL-FUR-612', '🪑', 4.5, false, true, 'Solid white oak with a hand-oiled finish.'],
            ['Woven Rattan Bench', 'seating', 279, 10, 3, 'AL-FUR-618', '🪑', 4.4, false, false, 'A breezy rattan-and-teak bench for entryways and bedroom ends.'],
        ];
        $productIds = [];
        foreach ($products as $i => [$name, $sub, $price, $disc, $stock, $sku, $emoji, $rating, $featured, $latest, $desc]) {
            $p = Product::updateOrCreate(['sku' => $sku], [
                'category_id' => $subs[$sub]->id, 'name' => $name, 'price' => $price,
                'discount_percent' => $disc, 'stock' => $stock, 'emoji' => $emoji,
                'rating' => $rating, 'featured' => $featured, 'latest' => $latest, 'description' => $desc,
            ]);
            $productIds[$i + 1] = $p->id;   // mock ids 1..12 -> real ids
        }

        // ---- Customers ----
        $customers = [
            ['Grace Kim', 'grace.kim@gmail.com', '+1 512 555 0142', 'Austin', '2025-01-12'],
            ['Marcus Cole', 'marcus.cole@gmail.com', '+1 720 555 0177', 'Denver', '2025-03-03'],
            ['Priya Chandran', 'priya.c@outlook.com', '+1 206 555 0118', 'Seattle', '2025-05-21'],
            ['Daniel Osei', 'daniel.osei@gmail.com', '+1 503 555 0164', 'Portland', '2025-09-02'],
            ['Sofia Martinez', 'sofia.m@yahoo.com', '+1 512 555 0199', 'Austin', '2025-11-19'],
            ['Ravi Desai', 'ravi.desai@gmail.com', '+1 312 555 0155', 'Chicago', '2025-01-27'],
            ['Emily Zhang', 'emily.zhang@gmail.com', '+1 415 555 0188', 'San Francisco', '2025-06-10'],
            ['Noah Bennett', 'noah.bennett@gmail.com', '+1 646 555 0102', 'New York', '2025-07-14'],
            ['Aaliyah Brooks', 'aaliyah.b@outlook.com', '+1 773 555 0141', 'Chicago', '2025-08-30'],
            ['Chris Palmer', 'chris.palmer@gmail.com', '+1 214 555 0176', 'Dallas', '2025-10-05'],
            ['Isabella Turner', 'isabella.t@yahoo.com', '+1 617 555 0193', 'Boston', '2025-12-01'],
            ["Liam O'Connor", 'liam.oconnor@gmail.com', '+1 619 555 0133', 'San Diego', '2026-01-15'],
            ['Emma Fischer', 'emma.f@gmail.com', '+1 615 555 0121', 'Nashville', '2026-02-20'],
        ];
        $byEmail = [];
        foreach ($customers as [$name, $email, $phone, $city, $joined]) {
            $byEmail[$email] = Customer::updateOrCreate(['email' => $email], [
                'name' => $name, 'phone' => $phone, 'city' => $city, 'joined_at' => $joined,
            ]);
        }

        // ---- Orders (mock product-id => qty per order) ----
        $orders = [
            ['AL-3081', 'grace.kim@gmail.com', '2026-07-06', 'Delivered', 'USPS3384211', '12 Willow St, Austin, TX 78701', [[1, 1], [4, 1]]],
            ['AL-3082', 'marcus.cole@gmail.com', '2026-07-07', 'Out for Delivery', 'USPS3384255', '44 Elmwood Ave, Denver, CO 80202', [[3, 1]]],
            ['AL-3083', 'priya.c@outlook.com', '2026-07-07', 'Shipped', 'USPS3384299', '7B Lakeview Dr, Seattle, WA 98101', [[5, 1], [7, 1], [9, 1]]],
            ['AL-3084', 'daniel.osei@gmail.com', '2026-07-08', 'Processing', null, '21 Cedar Ln, Portland, OR 97201', [[10, 1]]],
            ['AL-3085', 'sofia.m@yahoo.com', '2026-07-08', 'Pending', null, '5 Ridge Rd, Austin, TX 78704', [[2, 1], [9, 1]]],
            ['AL-3086', 'liam.oconnor@gmail.com', '2026-07-09', 'Pending', null, '18 Bayview St, San Diego, CA 92101', [[6, 1]]],
            ['AL-3087', 'emma.f@gmail.com', '2026-07-09', 'Cancelled', null, '9 Rose Ct, Nashville, TN 37201', [[9, 1]]],
            ['AL-3088', 'ravi.desai@gmail.com', '2026-07-09', 'Processing', null, '33 Highland Ave, Chicago, IL 60614', [[3, 1], [7, 1]]],
        ];
        foreach ($orders as [$number, $email, $date, $status, $tracking, $addr, $lines]) {
            $customer = $byEmail[$email];
            $order = Order::updateOrCreate(['number' => $number], [
                'customer_id' => $customer->id, 'status' => $status, 'payment_method' => 'COD',
                'total' => 0, 'tracking_number' => $tracking,
                'customer_name' => $customer->name, 'customer_phone' => $customer->phone,
                'delivery_address' => $addr, 'placed_at' => $date,
            ]);
            $order->items()->delete();
            $total = 0;
            foreach ($lines as [$mockId, $qty]) {
                $product = Product::find($productIds[$mockId]);
                $order->items()->create([
                    'product_id' => $product->id, 'name' => $product->name,
                    'quantity' => $qty, 'unit_price' => $product->finalPrice(),
                ]);
                $total += $product->finalPrice() * $qty;
            }
            $order->update(['total' => $total]);
        }

        // ---- Carts pending checkout (hours idle from the mock) ----
        $carts = [
            ['emily.zhang@gmail.com', 5, [[1, 1], [5, 2]]],
            ['noah.bennett@gmail.com', 312, [[10, 1]]],
            ['aaliyah.b@outlook.com', 14, [[3, 1], [9, 1], [11, 1]]],
            ['chris.palmer@gmail.com', 487, [[6, 1]]],
            ['isabella.t@yahoo.com', 22, [[2, 3], [7, 1]]],
        ];
        Cart::query()->delete();
        foreach ($carts as [$email, $hoursIdle, $lines]) {
            $cart = Cart::create([
                'customer_id' => $byEmail[$email]->id,
                'last_activity_at' => now()->subHours($hoursIdle),
            ]);
            foreach ($lines as [$mockId, $qty]) {
                $cart->items()->create(['product_id' => $productIds[$mockId], 'quantity' => $qty]);
            }
        }

        // ---- Banners ----
        $banners = [
            ['Homepage Banner', 'Summer Refresh', 'Up to 20% off Bedding & Linen', '#0F172A', '#16213E'],
            ['Category Banner', 'New in Decor', 'Lighting & wall art just landed', '#3B2F6C', '#6C4FCE'],
            ['Offer Banner', 'Free Shipping', 'On orders over $99 this week', '#B4790C', '#FF5A36'],
        ];
        foreach ($banners as [$kind, $title, $sub, $c1, $c2]) {
            Banner::updateOrCreate(['title' => $title], [
                'kind' => $kind, 'subtitle' => $sub, 'color1' => $c1, 'color2' => $c2, 'active' => true,
            ]);
        }

        // ---- Invoices ----
        $invoices = [
            ['INV-0231', '2026-06-09', 'Growth', 49], ['INV-0198', '2026-05-09', 'Growth', 49],
            ['INV-0165', '2026-04-09', 'Starter', 19], ['INV-0142', '2026-03-09', 'Starter', 19],
        ];
        foreach ($invoices as [$number, $date, $plan, $amount]) {
            Invoice::updateOrCreate(['store_id' => $store->id, 'number' => $number], [
                'plan_name' => $plan, 'amount' => $amount, 'status' => 'Paid', 'issued_at' => $date,
            ]);
        }
    }
}
