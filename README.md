# Sound Off README Instructions

The config.json is already setup to contact the Virgil Security and Twilio accounts.

To build:
```
$ npm install
```

To run:
```
$ npm run start
```

## Deploying the Node.js app on Azure VM

Currently the app is deployed as a systemd service on the VM.
The service config file is located at `/etc/systemd/system/nodeserver.service`.

1. SSH to the VM
```
$ ssh sndoffadmin@13.77.142.177
```
2. Check the status of the app
```
$ systemctl status nodeserver.service
```
3. Stop the app
```
$ sudo systemctl stop nodeserver.service
```
4. cd to the project directory
```
$ cd ~/soundoff-backend-nodejs
```
5. Get the latest from Github:
```
$ git pull
```
6. Compile the app
```
$ npm install
$ npm run compile
```
7. Start the app
```
$ sudo systemctl start nodeserver.service
```



# Original README Instructions for Twilio Programmable Chat

# Demo Virgil & Twilio E2EE Chat - Backend

Follow these instructions to install a sample Node backend for Virgil Security's end-to-end encrypted messaging SDK for Twilio's Programmable Chat API. This sample backend is necessary for the client/mobile apps to work: it generates user tokens for Twilio's and Virgil's APIs.

> Client/mobile apps: [ios](https://github.com/VirgilSecurity/chat-twilio-ios/tree/sample-v5) and [android](https://github.com/VirgilSecurity/demo-twilio-chat-android).


## Clone & Configure

Clone the repository from GitHub.

```
$ git clone https://github.com/VirgilSecurity/demo-twilio-chat-js.git
```

## Download your Virgil app config

If you don't yet have a Virgil account, [sign up for one](https://VirgilSecurity.com/getstarted).

Create a new app, download the app's ```config.json``` file from the app's page and copy it into the root of this node sample.

## Add your Twilio account data to config.json

| Variable Name                     | Description                    |
|-----------------------------------|--------------------------------|
| VIRGIL_APP_ID                   | This is your Virgil app's ID - no need to touch it |
| VIRGIL_API_KEY                  | This is your Virgil API key - no need to touch it |
| VIRGIL_API_KEY_ID               | This is your Virgil API key ID - no need to touch it |
| TWILIO_ACCOUNT_SID                | Your primary Twilio account identifier - [find this in the console here.](https://www.twilio.com/console)        |
| TWILIO_CHAT_API_KEY                    | SID of Twilio Api Key. Used for authentication on twilio services. Generated with TWILIO_API_SECRET|
| TWILIO_CHAT_API_SECRET                 | Twilio API key secret: [generate one here](https://www.twilio.com/console/chat/runtime/api-keys) |
| TWILIO_CHAT_SERVICE_SID            | A service instance where all the data for our application is stored and scoped. [Generate one in the console here.](https://www.twilio.com/console/chat/dashboard) |

## Install dependencies and run the app

```
$ npm install
$ npm run interactive
```





# Original README Instructions for Twilio Programmable Voice

Programmable Voice: Quickstart Application Server - Node
===
This repository contains the server-side web application required to run the [Twilio Programmable Voice iOS SDK Quickstart](https://www.twilio.com/docs/api/voice-sdk/ios/getting-started) and [Android SDK Quickstart](https://www.twilio.com/docs/api/voice-sdk/android/getting-started) mobile sample apps.

Looking for the Quickstart mobile app?

Download the client-side Quickstart Applications in Swift and iOS here:

- [Swift Quickstart Mobile App](https://github.com/twilio/voice-quickstart-swift)
- [Objective-C Quickstart Mobile App](https://github.com/twilio/voice-quickstart-objc)

Download the client-side Quickstart Application for Android here:

- [Android Quickstart Mobile App](https://github.com/twilio/voice-quickstart-android)

Prerequisites
---

* A Twilio Account. Don't have one? [Sign up](https://www.twilio.com/try-twilio) for free!
* Follow the [iOS full quickstart tutorial here](https://www.twilio.com/docs/api/voice-sdk/ios/getting-started) or [Android full quickstart tutorial here](https://www.twilio.com/docs/api/voice-sdk/android/getting-started).

## Setting up the Application

Create a configuration file for your application:

```bash
cp .env.example .env
```

Edit `.env` with the three configuration parameters we gathered from above.

Next, we need to install our dependencies from npm:

```bash
npm install
```

Now we should be all set! Run the application using the `node` command.

```bash
node .
```

Visit [http://localhost:3000](http://localhost:3000) to ensure the server is running.

### Up and running

This web application needs to be accessbile on the public internet in order to receive webhook requests from Twilio. [Ngrok](https://ngrok.com/) is a great options for getting this done quickly.

Once you have the application running locally, in a separate terminal window, make your server available to the public internet with the following:

```bash
    ngrok http 3000
```

You should see a dynamically generated public Ngrok URL in the command window. Ngrok will now tunnel all HTTP traffic directed at this URL to your local machine at port 3000.

### Test the app

Test your app by opening the `{YOUR_SERVER_URL}/accessToken` endpoint in your browser. Use the publicly accessible domain on ngrok. You should see a long string. This is an Access Token. You can examine its contents by pasting it into a JWT tool like [jwt.io](http://jwt.io).

## License

MIT
