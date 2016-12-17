/**
 * pusher.js
 * We are using powers of Pusher for the real time functionality
 * With it's easy to use API, Pusher makes using Real time features
 * of way really easy.
 *
 * All the communications between the server and clients is handled by Pusher,
 * We just trigger an event and leave the event handling to the Pusher
 * 
 * Go to pusher.com and Signup for free
 */

const Pusher = require('pusher')
let pusherConfig

if (pusherConfig) {
  pusherConfig = require('config').pusher
} else {
  pusherConfig = process.env
}

const pusher = new Pusher({
  appId: pusherConfig.appId,
  key: pusherConfig.appKey,
  secret: pusherConfig.appSecret
})

module.exports = pusher
