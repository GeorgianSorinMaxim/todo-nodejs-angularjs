module.exports = {

    'facebookAuth' : {
        'clientID'        : '1683298361950584', // App ID
        'clientSecret'    : '6dfad6c2e6fc21bca68cf9139e72c221', // App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : 'your-consumer-key-here', // Customer Key
        'consumerSecret'     : 'your-client-secret-here', // App Secret
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : 'your-secret-clientID-here', // App ID
        'clientSecret'     : 'your-client-secret-here', // App Secret
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

};
