<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = array(
            array('name' => 'View Admin Dashboard', 'slug' => 'view admin dashboard'),
            array('name' => 'View All Users', 'slug' => 'view all users'),
            array('name' => 'Invite User', 'slug' => 'invite user'),
            array('name' => 'View Contributor Dashboard', 'slug' => 'view contributor dashboard'),
            array('name' => 'View Contributor Contributions', 'slug' => 'view contributor contributions'),
            array('name' => 'View All Contributor Contributions', 'slug' => 'view all contributor contributions'),
            array('name' => 'Add supplier', 'slug' => 'Add supplier'),
            array('name' => 'View Suppliers', 'slug' => 'view suppliers'),
            array('name' => 'Delete Suppliers', 'slug' => 'delete suppliers'),
            array('name' => 'Add supplier Supplier', 'slug' => 'Add supplier'),
            array('name' => 'View Supplier Products', 'slug' => 'view supplier products'),
            array('name' => 'Delete Supplier Product', 'slug' => 'delete supplier product'),
            array('name' => 'Activate and Deactivate User', 'slug' => 'activate and Deactivate user'),
            array('name' => 'Verify Payment', 'slug' => 'verify payment'),
            array('name' => 'Delete Suppliers', 'slug' => 'delete suppliers'),
            array('name' => 'process order', 'slug' => 'process order'),
        );

        // DB::table('permissions')->truncate();
        foreach ($permissions as $permission) {
            if (Permission::where("name", $permission['name'])->exists()) {

            } else {
                $role = Role::where('slug', 'super admin')->first();
                $createdpermission = Permission::create([
                    'name' => $permission['name'],
                    'slug' => strtolower($permission['name']),
                ]);
                $role->permissions()->attach($createdpermission);
            }
        }

    }
}
