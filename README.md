# Realtime AI Moderation application with [Clarifai](https://clarifai.com) and [Pusher](https://pusher.com)

## Reason behind this demo' existence (Feel free to skip)

Realtime Web is becoming more mainstream, most of the major browsers
now have a good support for [**WebSockets**](https://goo.gl/fn6c2h), each and every day, 
people are increasingly building experiences and services that feel more realtime and
provides the user with the information they want anywhere. **[Pusher](https://pusher.com)** let's us easily manage all these realtime connections and provides fallback solutions as every browser isn't equipped with standardized WebSockets implementations.

Understanding and making sense of all this data at a matching speed is not a task humans can perform efficiently and here Artificial Intelligence can play a big role. However, it's time consuming and intensive task, [Clarifai](https://clarifai.com) let's us stand on the shoulder of giants by providing us one of the best Visual Recognition Images and Video Recognition API and makes the process of recognizing images way too easy.

Pusher and Clarifai together, give us a powerful ability of recognizing images coming in real time and take accurate decisions based on the data really quick. With the help of these technologies we are going to build an application that allows us to recognize the Cat images and broadcat them to all the users, so internet gets an accurate always changing source of Cat images as long as possible

### Clarifai

Clarifai's API provides major API Clients for most of the languages, you can get started and learn more about the Clarifai API by reading the comprehensive guide available [here](https://developer.clarifai.com/guide/#getting-started), we'll be using their **Predict** functionality to detect cats using `general-v1.3` model. We are most interested in their **node.js** client, which allows us to predict images in code as simple as below

```js
app.models.predict(Clarifai.GENERAL_MODEL, imageUrl)
    .then(function (response) {
        // Do something with the response here 
    })
```

In order to signup for Clarifai go to [https://developer.clarifai.com/signup/](https://developer.clarifai.com/signup/), create a new application and save the `Client Id` and `Client Secret`, you'll need these later in application we are building

### Pusher

Pusher provides with an all time available and reliable connection for our realtime applications, Pusher has a good multi language support too. We'll be using Pusher to trigger events on channel whenever we want to notify client of a new cat image, triggering an event on a channel such as `cat_channel` can be as simple as doing

```js
// Trigger a new_cat event on cat_channel
pusher.trigger('cat_channel', 'new_cat', {
    url: 'https://example.com/cat.jpg'
})

```

[Create an account](https://dashboard.pusher.com/accounts/sign_up) on Pusher, and make note of your `app_id`, `app_key` and `app_secret`, you'll need those later in the application, also checkout their [JavaScript Quick Start](https://pusher.com/docs/javascript_quick_start) guide to get a better understanding of how we do things with Pusher.

### Let's run the demo

Check out this demo's source code on this [repository](https://github.com/abdulhannanali/realtime-moderation)
here, clone it on your computer and replace the placeholder keys in `config/default.yml`
with your own keys from Clarifai and Pusher.

Afterwards, run a `npm start` in order to start your application on the default PORT `3000` which can be changed from within the source code. 


### Complete Architecture Overview
![Architecuture of Realtime Moderation Application](data/architecture.svg)

#### LICENSE
MIT License. See [LICENSE](LICENSE) for more details