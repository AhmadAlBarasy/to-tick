# To Tick✅, a simple working to-do list manager service
## Your all-in-one, simple, seamless, and easy-to-use to-do list service!
To Tick is a simple website that I've developed and worked on as a practice for learning express framework, MongoDB, Mongoose, and Pug templating engine.
The website enables you to create a list, add tasks to it, and mark them as done when you achieve them,
the website also comes with an authentication system built using JWT that allows you to sign up to create a new user, you can also change your basic information (your name and profile picture) using the profile page,
you can also change your password by sending a reset password link to your email, I used Mailtrap as a mail service for learning purposes, but you can use any mail service you want.
The website also comes with an API that you can use to access all of the features of the website, the API documentation link is provided above.
## Installation
* First of all, clone the project into your local machine using git clone
  ```
  https://github.com/AhmadAlBarasy/to-tick.git
  ```
* Install the dependencies using npm
  ```
  npm install
  ```
* then you should edit the [config.env](https://github.com/AhmadAlBarasy/to-tick/blob/main/config.env), add a MongoDB connection string to the **DB** variable and also use your own **DB_USERNAME**, **DB_PASSWORD**,
  also, change the mail service credentials to the mail service that you're going to use, last but not least use a good **JWT_KEY**.

