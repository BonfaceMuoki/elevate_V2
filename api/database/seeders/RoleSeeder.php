<?php
namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $roles = ['Super Admin', 'Contributor', 'Supplier'];
        // DB::table('roles')->truncate();
        foreach ($roles as $role) {
           
            if (Role::where("name",$role)->exists()) {

            } else {
                Role::create([
                    'name' => $role,
                    'slug' => strtolower($role),
                ]);
            }

        }

    }
}
