'use strict'

const Tweet = user('App/Models/Tweet')
class TweetController {
    async tweet ({ request, auth, response}) {
        // get currently authenticated user
        const user = auth.current.user

        //save tweet to database
        const tweet = await Tweet.create({
            user_id = user.id,
            tweet: request.input('tweet')
        })

        //fetch tweet relations
        await tweet.loadMany(['user', 'favorites', 'replies'])

        return response.json({
            status: 'success',
            message: 'Tweet Posted !',
            data: tweet
        })
    }
}

module.exports = TweetController
