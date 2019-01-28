'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})
Route.post('/signup','UserController.signup')
Route.post('/login', 'UserController.login')
Route.group(() => {
  Route.get('/me', 'UserController.me')
  Route.put('/update_profile', 'UserController.updateProfile')
})
  .prefix('account')
  .middleware(['auth:jwt'])
Route.put('/change_password', 'UserController.changePassword')
//This route takes a username as the route parameter. This makes the route dynamic as different usernames can be passed to it. 
Route.get(':username', 'UserController.showProfile')
Route.group(() => {
  Route.get('users_to_follow', 'UserController.usersToFollow');
})
  .prefix('users')
  .middleware(['auth:jwt'])
//unfollow user
Route.delete('/unfollow/:id', 'UsersController.unFollow')
Route.get('/timeline', 'UserController.timeline')
Route.post('/tweet', 'TweetController.tweet').middleware(['auth:jwt'])
Route.get('/tweets/:id', 'TweetController.show')
Route.post('/tweets/reply/:id', 'TweetController.reply').middleware(['auth:jwt'])