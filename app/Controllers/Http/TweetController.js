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

    async show ({ params, response}) {
        try {
            const tweet = await Tweet.query()
                .where('id', params.id)
                .with('user')
                .with('replies')
                .with('replies.user')
                .with('favorites')
                .firstOrFail()

            return response.json({
                status: 'success',
                data: tweet
            })
        } catch (error) {
            return response.status(404).json({
                status: 'error',
                message: 'Tweet Not Found'       
            })
        }
    }

}

module.exports = TweetController
