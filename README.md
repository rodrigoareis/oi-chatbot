# Oi Chat - Conversation Sample Application

This Node.js app demonstrates the Conversation service in a simple mobile carrier chatbot. This was built on top of a github Sample project called [conversation-simple][sample_git_url] produced by IBM.


### Setting up the Conversation service

1. At the command line, go to the local project directory (`oi-chatbot`).

1. Connect to Bluemix with the Cloud Foundry command-line tool. For more information, see the Watson Developer Cloud [documentation][cf_docs].

1. Create an instance of the Conversation service in Bluemix. For example:

    ```bash
    cf create-service Conversation free conversation-service
    ```

### Importing the Conversation workspace

1. In your browser, navigate to your Bluemix console.

1. From the **All Items** tab, click the newly created Conversation service in the **Services** list.

1. On the Service Details page, click **Launch tool**.

1. Click **Import** in the Conversation service tool. Specify the location of the workspace JSON file in your local copy of the app project:

    `<project_root>/training/oi_workspace.json`

1. Select **Everything (Intents, Entities, and Dialog)** and then click **Import**. The car dashboard workspace is created.

### Configuring the Conversation Service

1. A file named .env file is used to provide the service keys for your service instances to the application. Create a .env file in the root directory of your clone of the project repository by copying the sample .env.example file using the following command:

    ```bash
    cp .env.example .env
    ```

1. Create a service key in the format `cf create-service-key <service_instance> <service_key>`. For example:

    ```bash
    cf create-service-key conversation-service conversation-service-key1
    ```

1. Retrieve the credentials from the service key using the command `cf service-key <service_instance> <service_key>`. For example:

    ```bash
    cf service-key conversation-service conversation-service-key1
    ```

   The output from this command is a JSON object, as in this example:

    ```JSON
    {
      "password": "87iT7aqpvU7l",
      "url": "https://gateway.watsonplatform.net/conversation/api",
      "username": "ca2905e6-7b5d-4408-9192-e4d54d83e604"
    }
    ```

1. Paste  the `password` and `username` values (without quotation marks) from the JSON into the `CONVERSATION_PASSWORD` and `CONVERSATION_USERNAME` variables in the `.env` file. For example:

    ```
    CONVERSATION_USERNAME=ca2905e6-7b5d-4408-9192-e4d54d83e604
    CONVERSATION_PASSWORD=87iT7aqpvU7l
    ```

1. In your Bluemix console, open the Conversation service instance where you imported the workspace.

1. Click the menu icon in the upper-right corner of the workspace tile, and then select **View details**.

1. Click the icon to copy the workspace ID to the clipboard.

1. On the local system, paste the workspace ID into the WORKSPACE_ID variable in the `.env` file. Save and close the file.

### Create a Cloudant NoSQL database service

1. Create an instance of the Cloudant NoSQL database service using the shared plan

    ```bash
    cf create-service cloudantNoSQLDB Lite cloudant-service
    ```

1. Create a service key in the format `cf create-service-key <service_instance> <service_key>`. For example:

    ```bash
    cf create-service-key cloudant-service cloudant-service-key1
    ```

1. Retrieve the credentials from the service key using the command `cf service-key <service_instance> <service_key>`. For example:

    ```bash
    cf service-key cloudant-service cloudant-service-key1
    ```

   The output from this command is a JSON object, as in this example:

    ```JSON
    {
      "username": "3b0269d9-1683-4945-bd99-19439a2fbece-bluemix",
      "password": "4257ba3d74115fc7b83f291689427f0dbac960a040f546fa9ce14a3b0db3ca27",
      "host": "3b0269d9-1683-4945-bd99-19439a2fbece-bluemix.cloudant.com",
      "port": 443,
      "url": "https://3b0269d9-1683-4945-bd99-19439a2fbece-bluemix:4257ba3d74115fc7b83f291689427f0dbac960a040f546fa9ce14a3b0db3ca27@3b0269d9-1683-4945-bd99-19439a2fbece-bluemix.cloudant.com"
    }
    ```

1. Paste  the `url`, `password` and `username` values (without quotation marks) from the JSON into the `CLOUDANT_URL`, `CLOUDANT_PASS` and `CLOUDANT_USER` variables in the `.env` file. For example:

    ```
    CLOUDANT_URL=https://3b0269d9-1683-4945-bd99-19439a2fbece-bluemix:4257ba3d74115fc7b83f291689427f0dbac960a040f546fa9ce14a3b0db3ca27@3b0269d9-1683-4945-bd99-19439a2fbece-bluemix.cloudant.com
    CLOUDANT_USER=3b0269d9-1683-4945-bd99-19439a2fbece-bluemix
    CLOUDANT_PASS=4257ba3d74115fc7b83f291689427f0dbac960a040f546fa9ce14a3b0db3ca27
    ```

### Installing and starting the app

1. Install the demo app package into the local Node.js runtime environment:

    ```bash
    npm install
    ```

1. Start the app:

    ```bash
    node server.js
    ```

1. Point your browser to http://localhost:3000 to try out the app.

## Testing the app

At the first time, the application will create a database and store data that will be used. You will see a message 'Database connected' on console.

After your app is installed and running, experiment with it to see how it responds.
    
## Deploying to Bluemix

You can use Cloud Foundry to deploy your local version of the app to Bluemix.

1. In the project root directory, open the `manifest.yml` file:

    * In the `applications` section of the `manifest.yml` file, change the `name` value to a unique name for your version of the demo app.
    * In the `services` section, specify the name of the Conversation service instance you created for the demo app. If you do not remember the service name, use the `cf services` command to list all services you have created.
    * In the `env` section, add `WORKSPACE_ID` and specify the value from the `.env` file.

    The following example shows a modified `manifest.yml` file:

    ```YAML
    ---
    declared-services:
     conversation-service:
       label: conversation
       plan: free
    applications:
    - name: oi-chatbot
     command: npm start
     path: .
     memory: 256M
     instances: 1
     services:
     - conversation-service
     env:
       NPM_CONFIG_PRODUCTION: false
       WORKSPACE_ID: fdeab5e4-0ebe-4183-8d10-6e5557a6d842
    ```

1. Push the app to Bluemix:

    ```bash
    cf push
    ```

    Access your app on Bluemix at the URL specified in the command output.

## Troubleshooting

If you encounter a problem, you can check the logs for more information. To see the logs, run the `cf logs` command:

```bash
cf logs <application-name> --recent
```

[sample_git_url]: https://github.com/watson-developer-cloud/conversation-simple
[cf_docs]: (https://www.ibm.com/watson/developercloud/doc/getting_started/gs-cf.shtml)
