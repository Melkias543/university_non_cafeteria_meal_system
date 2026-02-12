<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DepositController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Controller; // ✅ Correct
use App\Http\Controllers\Api\UserController;
use App\Models\User;
use GuzzleHttp\Middleware;
use Symfony\Component\Routing\Route as RoutingRoute;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/ping', function () {
    return response()->json(['status' => 'OK'], 200);
});
Route::get('/user-health', function () {

  $admin=  User::where('email', 'admin@gmail.com')->first()->hasRole('admin');
  $studnet=  User::where('email', 'student@gmail.com')->first()->hasRole('student');

  return response()->json(['admin'=>$admin,'student'=>$studnet], 200);
});






Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/health', function () {
    return response()->json(['status' => 'OK'], 200);
});

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |---------------------------------------
    | Menus - Everyone logged in can view
    |---------------------------------------
    */
    Route::get('/menus', [MenuController::class, 'index']);
    Route::get('/menus/{id}', [MenuController::class, 'show']);

    Route::put('/users/{user}', [UserController::class, 'update'])->middleware("role:admin");
    Route::get('/users/{user}', [UserController::class, 'show'])->middleware("role:admin");
    /*
    |---------------------------------------
    | Admin Only Routes
    |---------------------------------------
    */
    Route::middleware('role:admin')->group(function () {
        Route::post('/menus', [MenuController::class, 'store']);
        Route::put('/menus/{id}', [MenuController::class, 'update']);
        Route::delete('/menus/{menu}', [MenuController::class, 'destroy']);
        Route::put('/availability/{menu}',[MenuController::class, 'availability']);
        Route::get('/users', [UserController::class, 'index']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        Route::patch('/users/status/{user}', [UserController::class, 'changeUserStatus']);
        Route::post('/wallet/top-up/{user}', [DepositController::class, 'topUp']);

    });



  
    
      /*
    |---------------------------------------
    | Student Only Routes
    |---------------------------------------
    */

//  Route::middleware('role:student')->group(function () {
//         Route::post('/menus', [MenuController::class, 'store']);
//         Route::put('/menus/{id}', [MenuController::class, 'update']);
//         Route::delete('/menus/{id}', [MenuController::class, 'destroy']);
//     });
});
