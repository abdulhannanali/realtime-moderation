/**
 * Server for RealTime moderation tool built using Pusher and Clarifai
 */
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const identifyCatImage = require('./clarifai')
const pusherApp = require('./pusher')

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

const NODE_ENV = process.env.NODE_ENV || 'development'

const CAT_CHANNEL = 'cat_channel'

const NEW_CAT_EVENT = 'new_cat'
const NOT_CAT_EVENT = 'not_cat'

const app = express()

// Logger for development environment
if (NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Doing CORS like this is not safe in data sensitive websites,
// You should specify the origin here, which I haven't done
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

/**
 * Serving the Client Side files
 * These files can be served separately with out the need of the server too
 */
app.use(express.static('./public'))

/**
 * Route for submitting a cat url to identify the cat
 * We send a post request with following things in the body
 * - url
 * - socketId
 * 
 * The response for every request is 200,
 * Clarifai related moderation data is sent using Pusher
 */
// Add POST route here
app.post('/cat', function (req, res, next) {
    const imageUrl  = req.body.url
    const addedAt   = (new Date ()).toISOString()
    const socketId  = req.body.socketId

    if (imageUrl) {
        identifyAndTrigger({ imageUrl, addedAt, socketId })
    } else {
        next(new Error('valid `imageUrl` not provided'))
    }

    res.send(200)
})

/**
 * identifyAndTrigger
 * identifies cat in the image using Clarifai and triggers an event on
 * Pusher if found
 *
 * @param {String} - imageUrl
 * @return {unefined} - nothing is returned
 */
function identifyAndTrigger ({ imageUrl, addedAt, socketId }) {
    // identify the Cat Image using `identifyCatImage` function with the help of Clarifai
    return identifyCatImage(imageUrl)
        .then(function ({isCat, concepts}) {
            if (isCat) {
                // Triggering a `NEW_CAT_EVENT` on CAT_CHANNEL
                console.log('Cat identified, trigger an event ' + imageUrl)

                // Trigger an event for the pusher here if cat found
                // and pass the relevant data
                pusherApp.trigger(CAT_CHANNEL, NEW_CAT_EVENT, {
                    url: imageUrl,
                    added_at: addedAt,
                    socketId,
                    concepts
                })

                console.log('+TRIGGGGERRRED')                
            } else {
                console.log('Cat not identified, trigger an event ' + imageUrl)

                // Trigger a `NOT_CAT_EVENT` in `CAT_CHANNEL` if Cat Not Found
                // As well as pass the relevant data
                pusherApp.trigger(CAT_CHANNEL, NOT_CAT_EVENT, {
                    url: imageUrl,
                    added_at: addedAt,
                    socketId,
                    concepts
                })

                console.log('-TRIGGGGERRRED')
            }

            return isCat
        })
        .catch(function (error) {
            console.error('Error occured while identifying image ' + imageUrl)
            console.error(error)
        })
}

/**
 * Listening on the provided PORT and HOST
 */
app.listen(PORT, HOST, function (error) {
    if (!error) {
        console.log(`Server is listening on ${HOST}:${PORT}`)
    } else {
        throw error
    }
})
