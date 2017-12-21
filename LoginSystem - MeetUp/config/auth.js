// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '175760833020000', // your App ID
        'clientSecret'  : '73fefd590f6bd8add8758673143e32cb', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },

   

    'googleAuth' : {
        'clientID'      : '669636149567-8g6a5umsh7q4teo1e7v313sv0mf0r06d.apps.googleusercontent.com',
        'clientSecret'  : 'NuTfzr5EAbSRO-V1w2fkX69H',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};

