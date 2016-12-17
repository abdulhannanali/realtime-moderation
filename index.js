// IIFE To not expose the scope
(function () {
    const SUBMIT_ENDPOINT = 'https://realtime-moderation.herokuapp.com/cat'

    // Declaring constants related to Pusher, neatly
    const APP_KEY = 'fb469c3b79cf2998b305'
    const CAT_CHANNEL = 'cat_channel'
    const NEW_CAT_EVENT = 'new_cat'
    const NOT_CAT_EVENT = 'not_cat' 

    const pusher = new Pusher(APP_KEY)

    // Subscribing to CAT_CHANNEL, you can subscribe to as many channels as you want
    const catChannel = pusher.subscribe(CAT_CHANNEL)

    // DOM Elements
    const submitButton = document.getElementsByClassName('submit-btn')[0]
    const inputText = document.getElementsByClassName('url-input')[0]
    const inputItems = document.getElementsByClassName('input-items')[0]

    // Variable initialized for socketId
    let socketId

    // Listening to Pusher Specific Events

    /**
     * Emitted when the State of Pusher's connection changes
     */
    pusher.connection.bind('state_change', function (states) {
        const currentState = states.current
        
        if (currentState === 'connected') {
            socketId = pusher.connection.socket_id
            showToast('Connected to Pusher')
            
            // Inputs are shown when the state is connected
            showInputs()
        }
        
        // handle the state change for the UI
        changeState(currentState)
    })


    // Cat Channel Pusher's specific event

    // Binding to Cat Channel's event for a new Cat
    // eventData contains all the data passed from the server
    catChannel.bind(NEW_CAT_EVENT, function newCatEvent (eventData) {
        const displayImg = document.getElementsByClassName('display-image')[0]
        
        if (eventData && eventData.url) {
            // Setting the displayImg's url to that of the new cat's url
            displayImg.src = eventData.url
            showToast('New cat there 🙀🙀🙀')
            displayTags(eventData.concepts)
        }
        
    })

    // Binding to a Cat Channel's event if we sent a Cat which didn't get accepted
    // eventData contains all the data related to event
    catChannel.bind(NOT_CAT_EVENT, function notCatEvent (eventData) {
        const url = eventData.url

        // Checking if this client sent the message, using socketId (Unique for every Client)
        if (socketId === eventData.socketId) {
            showToast('Not a cat really 😸😸😸')
        }
    })

    // DOM Specific Events

    // Call the function when someone clicks Submit Button
    submitButton.addEventListener('click', function (event) {
        const text = inputText.value

        if (text && text.trim()) {
            // Passing the text to submitImage function
            submitImage(text, socketId || '')
                .then(function () {
                    // If the request was successful
                    showToast('Image submitted to Clarifai 🤖🤖🤖')
                })
                .catch (function () {
                    // If error occured in the way
                    showToast('Error occured while submitting image to Clarifai')
                })
        }
    })


    /**
     * showToast
     * shows a toast
     * 
     * @param {String} - text - to show for a toast
     * @param {Number} - timeout - time in ms for which to show a toast
     */
    function showToast (text, timeout = 3000) {
        Materialize.toast(text, timeout)
    }

    /**
     * submitImage
     * submits the image to the server, for further processing
     * for the clarifai to process the image
     * 
     * @param {String} - imageUrl image of the url to be submitted
     * @return {Promise} - returns a promise successful, if the image is submitted successfully
     */
    function submitImage (imageUrl, socketId) {
        return axios({
            method: 'post',
            url: SUBMIT_ENDPOINT,
            data: {
                url: imageUrl,
                socketId: socketId
            }
        })
    }

    /**
     * displayTags
     * displays the tags in the form of Material chips
     * 
     * @param {Array} - array of the tags to be displayed
     * @return {undefined}
     */
    function displayTags (tags) {
        const conceptsName = document.getElementsByClassName('clarifai-tags')[0]
        
        // Simple mapping through every concept and returning a chip with
        // name for everyone of it
        const materialTags = tags.map(function (tag) {
            return '<div class="chip">' + tag.name + "</div>"
        }).join(' ')

        conceptsName.innerHTML = materialTags
    }

    /**
     * changeState
     * called when the pusher connection state changes, you can do
     * anything with this function, there can be a `switch` statement here
     * too that does a separate thing for every state, but I keep it simple
     * 
     * @param {String} - state is a string
     * @return {undefined} - nothing is returned from this function, as this function performs side effects
     */
    function changeState (state) {
        const statusText = document.querySelector('.status-text')

        if (state && state.trim()) {
            statusText.innerHTML = '<b>' + state.toUpperCase() + '</b>'
        }
    }

    function showInputs () {
        inputItems.style.display = ""
    }
})()
