# Realtime AI Moderation application with Clarifai and Pusher

## Reason behind tutorial's existence (Feel free to skip)

Realtime Web is becoming more mainstream, most of the major browsers
now have a good support for [**WebSockets**](https://goo.gl/fn6c2h), each and every day, 
people are increasingly building experiences and services that feel more realtime and
provides the user with the information they want anywhere. **[Pusher](https://pusher.com)** let's us easily manage all these realtime connections and provides fallback solutions as every browser isn't equipped with all these shiny WebSockets implementations.

Understanding and making sense of all this data at a matching speed is not a task of humans
and here Artificial Intelligence can play a big role. However, it's time consuming and intensive task, [Clarifai](https://clarifai.com) let's us stand on the shoulder of giants by providing us one of the best Visual Recognition Images and Video Recognition API and makes the process of recognizing way too easier.

Pusher and Clarifai together, give us a powerful ability of recognizing images coming in real time and take accurate decisions based on the data really quick. With the help of these technologies we are going to build an application that allows us to recognize the Cat images and broadcat them to all the users, so internet gets an accurate always changing source of Cat images as long as possible

## Goals at the end of the tutorial
Throughout this this tutorial, we'll be building an applation, that consists of the
following major parts

- Server which analyzes images using Clarifai and triggers event to our Pusher instance
- Client which allows the user to send the url to the server, and binds to pusher events 

## Prerequisites

Only real prerequisite for this tutorial is, **Curiosity**, however, in order to get the most 
out of this tutorial, it's good to have some experience with the following technologies

- JavaScript
- Node.js
- Accessing REST APIs

## Getting started with APIs

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

Pusher provides with an all time available and reliable connection for our realtime applications, Pusher has a good multi language support too. We'll be using Pusher to trigger events on channel whenever we want to notify client of a new cat image, triggering an event can be as simple as doing

```js
// Trigger a new_cat event on cat_channel
pusher.trigger('cat_channel', 'new_cat', {
    url: 'https://example.com/cat.jpg'
})

```

[Create an account](https://dashboard.pusher.com/accounts/sign_up) on Pusher, and make note of your `app_id`, `app_key` and `app_secret`, you'll need those later in the application, also checkout their [JavaScript Quick Start](https://pusher.com/docs/javascript_quick_start) guide to get a better understanding of how we do things with Pusher.

## Let's build
