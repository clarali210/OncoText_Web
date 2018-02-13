module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: 'localhost',
      username: 'root',
      // pem: './path/to/pem'
      password: '******'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'OncoText_Web',
    path: '/home/nlp/OncoText_Web',

    servers: {      
      one: {},
    },

    buildOptions: {
      serverOnly: false,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'http://domain.com',
      MONGO_URL: 'mongodb://localhost/OncoText_Web',
    },

    // ssl: { // (optional)
    //   // Enables let's encrypt (optional)
    //   autogenerate: {
    //     email: 'email.address@domain.com',
        docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:node-8.4.0-base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  }
};
