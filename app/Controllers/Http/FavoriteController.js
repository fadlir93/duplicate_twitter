'use strict'
const Favorite = use('App/Models/Favorite')
class FavoriteController {
    async Favorite({request, auth, response}) {
        const user = auth.current.user

        const tweetId = request.input('tweet_id')

        const favorite = await Favorite.findOrCreate(
            {user_id: user.id, tweet_id: tweetId},
            {user_id: user.id, tweet_id: tweetId}
        )
        return response.json({
            status: 'success',
            data: favorite
        })
    }
}

module.exports = FavoriteController
