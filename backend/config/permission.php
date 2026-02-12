<?php

return [

    /*
     * Spatie DEFAULTS (this is what actually matters)
     */
    'defaults' => [
        'guard_name' => 'sanctum',
    ],

    /*
     * Models
     */
    'models' => [

        'permission' => Spatie\Permission\Models\Permission::class,

        'role' => Spatie\Permission\Models\Role::class,
    ],

    /*
     * Table names
     */
    'table_names' => [
        'roles' => 'roles',
        'permissions' => 'permissions',
        'model_has_permissions' => 'model_has_permissions',
        'model_has_roles' => 'model_has_roles',
        'role_has_permissions' => 'role_has_permissions',
    ],

    /*
     * Column names (UUID support)
     */
    'column_names' => [
        'role_pivot_key' => null,
        'permission_pivot_key' => null,

        // UUID users
        'model_morph_key' => 'model_id',

        'team_foreign_key' => 'team_id',
    ],

    /*
     * Permission checks
     */
    'register_permission_check_method' => true,

    'register_octane_reset_listener' => false,

    'events_enabled' => false,

    'teams' => false,

    'team_resolver' => \Spatie\Permission\DefaultTeamResolver::class,

    'use_passport_client_credentials' => false,

    'display_permission_in_exception' => false,
    'display_role_in_exception' => false,

    'enable_wildcard_permission' => false,

    /*
     * Cache
     */
    'cache' => [
        'expiration_time' => \DateInterval::createFromDateString('24 hours'),
        'key' => 'spatie.permission.cache',
        'store' => 'default',
    ],
];
