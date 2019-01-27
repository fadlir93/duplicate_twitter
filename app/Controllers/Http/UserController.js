'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')
class UserController {
    //setting User Signup
    async signup ({request, auth, response}) {
        //get user data from signup form
        const userData = request.only(['name', 'username', 'email', 'password'])
    
        try {
            //save user to database
            const user = await User.create(userData)
            //generate JWT Token for user
            const token = await auth.generate(user)
    
            return response.json({
                status: 'success',
                data: token
            })
        } catch(error) {
            return response.status(400).json({
                status: 'error',
                message: 'There was a problem creating the user, plese try again'
            })
        }
    }
    
    //setting user login
    async login ({request, auth, response}){
        try{
            //validate the user credentials and generate a JWT Token
            const token = await auth.attempt(
                request.input('email'),
                request.input('password')    
            )
            return response.json({
                status: 'success',
                data: token
            })
        } catch(error) {
            return response.status(400).json({
                status: 'error',
                message: 'Invalid email / password'
            })
        }
    }
    //Authenticated User
    async me ({auth, response}){
        const user = await User.query()
        // the result of a query on the users table for where the ID matches that of the currently authenticated use
            .where('id', auth.current.user.id)
            .with('tweets', builder => {
                builder.with('user'),
                builder.with('favorites'),
                builder.with('replies')
            })
            .with('following')
            .with('followers')
            .with('favorites')
            .with('favorites.tweet', builder => {
                builder.with('user')
                builder.with('favorites')
                builder.with('replies')
            })
            .firstOrFail()

        return response.json({
            status: 'success',
            data: user
        })
    }
    //Setting Update User Profile
    async updateProfile({request, auth, response}) {
        try {
            //get currently authenticated user
            const user = auth.current.user

            //update with new data entered
            user.name = request.input('name')
            user.username = request.input('username')
            user.email = request.input('email')
            user.location = request.input('location')
            user.location = request.input('bio')
            user.website_url = request.input('website_url')

            await user.save()

            return response.json({
                status: 'success',
                message: 'Profile Update',
                data: user
            })
        } catch(error){
            return response.status(400).json({
                status: 'error',
                message: 'There was a problem updating profile, please try again later. '
            })
        }
    }
    async changePassword({ request, auth, response}){
        //get currently authenticated user
        const user = auth.current.user
        
        //Verify if current password matches
        const verifyPassword = await Hash.verify(
            request.input('password'),
            user.password
        )
        //display appropriate message
        if(!verifyPassword) {
            return response.status(400).json({
                status: 'error',
                message: 'Current Password could not be verified! please try again'
            })
        }

        //hash and save new password
        user.password = await Hash.make(request.input('newPassword'))
        await user.save()

        return response.json({
            status: 'success',
            message: 'password updated !'
        })
    }
    async showProfile ({request, params, response}){
        try {
            const user = await User.query()
                .where('username', params.username)
                .with('tweets', builder => {
                    builder.with('user')
                    builder.with('favorites')
                    builder.with('replies')
                })
                .with('following')
                .with('followers')
                .with('favorites')
                .with('favorites.tweet', builder => {
                    builder.with('user')
                    builder.with('favorites')
                    builder.with('replies')
                })
                .firstOrFail()

                return response.json({
                    status: 'success',
                    data: user
                })
        } catch {
            return response.status(404).json({
                status: 'error',
                message: 'User not found'
            })
        }
    }
    async usersToFollow ({params, auth, response}){
        //get currently authenticated user
        const user = auth.current.user
        
        //get the ID's of users the currently authenticated user is already following
        const usersAlreadyFollowing = await user.following().ids()
        
        //fetch users the currently authenticated user is not already following
        const usersToFollow = await User.query()
            .whereNot('id', user.id)
            .whereNotIn('id', usersAlreadyFollowing)
            .pick(3)

        return response.json({
            status: 'success',
            data: usersToFollow
        })
    }
}
//add to the top of the file

module.exports = UserController