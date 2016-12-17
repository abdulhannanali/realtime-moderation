/**
 * clarifai.js
 *
 * Clarifai is the best AI based Image And Visual Recognition API
 * which helps in all kinds of tasks based on Visuals.
 * We are going to use Clarifai's API in order to check images for certain using
 * their General Model
 *
 * Check out Clarifai's demo on https://clarifai.com/demo
 * Check out Clarifai's v2 Quick Start guide here https://developer-preview.clarifai.com/quick-start/
 * 
 * Clarifai offers free image recognition upto 5000 images/month
 * OMG! OMG! OMG! Awesome!
 */
const Clarifai = require('clarifai')

if (process.env.NODE_ENV === 'development') {
    const clarifaiConfig = require('config')
} else {
    const clarifaiConfig = process.env
}

const app = new Clarifai.App(
    clarifaiConfig.clientId,
    clarifaiConfig.clientSecret
)

const conceptsForCat = ['cat']

/**
 * identifyCatImage
 * identifies if image contains cat
 * 
 * @param {String} - url of the required image
 * @param {Boolean} - `true` if the cat in image is identified :clap:
 * 
 * TBD
 */
function identifyCatImage (url) {
    // Call the Clarifai API here for the image
    // TBD
    return app.models.predict(Clarifai.GENERAL_MODEL, url)
        .then(function (response) {
            // Storing the Array of concepts from the response in concepts
            const concepts = response.data.outputs[0].data.concepts

            const isCat = concepts.some((concept) => conceptsForCat.indexOf(concept.name) !== -1)

            return {
                isCat,
                concepts
            } 
        })
}

module.exports = identifyCatImage
