<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use DB;
class AdminPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $superadmin_role = Role::where('slug', 'super admin')->first();
        $admin_permissions = array(
            array('name' => 'View Admin Dashboard','slug' => 'view admin dashboard'),
            array('name' => 'View All Users','slug' => 'view all users'),
            array('name' => 'Invite User','slug' => 'invite user'),
            array('name' => 'View Contributor Dashboard','slug' => 'view contributor dashboard'),
            array('name' => 'View Contributor Contributions','slug' => 'view contributor contributions'),
            array('name' => 'View All Contributor Contributions','slug' => 'view all contributor contributions'),  
            array('name' => 'Add supplier','slug' => 'Add supplier'),  
            array('name' => 'View Suppliers','slug' => 'view suppliers'), 
            array('name' => 'Delete Suppliers','slug' => 'delete suppliers'), 
            array('name' => 'Add supplier Supplier','slug' => 'Add supplier'),  
            array('name' => 'View Supplier Products','slug' => 'view supplier products'), 
            array('name' => 'Delete Supplier Product','slug' => 'delete supplier product'), 
            array('name' => 'Activate and Deactivate User','slug' => 'activate and Deactivate user'),  
            array('name' => 'Verify Payment','slug' => 'verify payment'), 
            array('name' => 'Delete Suppliers','slug' => 'delete suppliers'),     
            array('name' => 'process order','slug' => 'process order'),            
              );        
          foreach ($admin_permissions as $permission) {
            $perm = Permission::where("name", $permission['name'])->first();
            $axist=DB::table("roles_permissions")->where("permission_id",$perm->id)->where("role_id",$superadmin_role->id)->get();
            if(sizeof($axist)==0){                
                $superadmin_role->permissions()->attach($perm);
             }
            
        }
    }
}
