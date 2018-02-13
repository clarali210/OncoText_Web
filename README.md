# OncoText_Web

## Setup

To setup on a new server, git clone this repository and mup deploy, following the steps below:
1) ``git clone https://github.com/clarali210/OncoText_Web.git``

2) Install the necessary dependencies: ``meteor npm install --save @babel/runtime react react-mounter prop-types material-ui react-tap-event-plugin react-csv react-checkbox-group react-dom react-toggle``. You can check if it runs locally with ``meteor run`` and navigating to [``localhost:3000``](http://localhost:3000) in your browser

3) We are going to deploy the meteor app using [``meteor-up``](https://github.com/zodern/meteor-up). Run ``mup setup``, navigate into the ``.deploy`` directory, and edit ``mup.js`` according to your server settings (refer to http://meteor-up.com/docs.html and our [example](/example_mup.js)). Enter ``mup deploy`` to deploy the app. You might need to change root permissions on your server with ``sudo visudo`` and replace ``%sudo ALL=(ALL:ALL) ALL`` with ``%sudo ALL=(ALL:ALL) NOPASSWD:ALL`` to deploy the webapp successfully.

4) And you're done! Navigate to your server domain in your browser (preferably Firefox or Safari) and you'll be ready to go!

5) Remember to ``mup deploy`` after your changes (for ex. adding more diagnoses to extractions.json).
