# Bank Account Connection - Technical Challenge

In this technical challenge, I work with Plaid and integrate their API into a web application to provide users with a personalized financial dashboard, budgeting tool, and expense tracking app. I implement a functional backend to enable users to connect to their bank accounts and guarantee the security. For the tech stack, I choose to use React.js for frontend, Node.js for backend, and firestore database. I handle Authentication by implementing user authentication and store access tokens securely.

I use Plaid API endpoints to retrieve users' financial data, such as account balances and transaction history.

I route the plaid sample data into a Firestore database.

## Requirements

-   Plaid API keys - Sign up for a free Sandbox account if you don't already have one
-   [Sign up for a free ngrok account](https://dashboard.ngrok.com/signup) to obtain an authtoken

## Getting Started

1. Update the `.env` file with your Plaid API keys and OAuth redirect uri.

2. Update the `ngrok.yml` file in the ngrok folder with your ngrok authtoken. 

1. You will also need to configure an allowed redirect URI for your client ID through the Plaid developer dashboard.

1. Start the services. 
    ```shell
    make start
    ```
1. Open http://localhost:3001 in a web browser.
1. View the logs
    ```shell
    make logs
    ```
1. When you're finished, stop the services.
    ```shell
    make stop
    ```
#### MacOS instructions for using https with localhost

If you are using MacOS, in your terminal, change to the client folder:

```bash
cd client
```

Use homebrew to install mkcert:

```bash
brew install mkcert
```

Then create your certificate for localhost:

```bash
mkcert -install
mkcert localhost
```

This will create a certificate file localhost.pem and a key file localhost-key.pem inside your client folder.

Then in the package.json file in the client folder, replace this line on line 26

```bash
  "start": "PORT=3001 react-scripts start",
```

with this line instead:

```bash
"start": "PORT=3001 HTTPS=true SSL_CRT_FILE=localhost.pem SSL_KEY_FILE=localhost-key.pem react-scripts start",
```

In the `Dockerfile` in the client folder, add these two lines below line 6:

```
COPY ["localhost-key.pem", "/opt/client"]
COPY ["localhost.pem", "/opt/client"]
```

Finally, in the wait-for-client.sh file in the main pattern folder, replace this line on line 6

```bash
while [ "$(curl -s -o /dev/null -w "%{http_code}" -m 1 localhost:3001)" != "200" ]
```

with this line instead:

```bash
while [ "$(curl -s -o /dev/null -w "%{http_code}" -m 1 https://localhost:3001)" != "200" ]
```

After starting up the Pattern sample app, you can now view it at https://localhost:3001.

## Architecture

-   Frontend: React.js in client folder
-   Backend: Node.js in server folder
-   Database: Firestore
