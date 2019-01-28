'use strict'

const Tweet = use('App/Models/Tweet')
const Reply = use('App/Models/Reply')
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
    async reply({request, auth, params, response}) {
        //get currently authenticated user
        const user = auth.current.user

        //get tweet with the specified ID
        const tweet = await Tweet.find(params.id)

        //persist to database
        const reply = await Reply.create({
            user_id: user.id,
            tweet_id: tweet.id,
            reply: request.input('reply')
        })

        //fetch user that made the reply
        await reply.load('user')

        return response.json({
            status: 'success',
            message: 'reply posted !',
            data: reply
        })
    }

}

module.exports = TweetController
