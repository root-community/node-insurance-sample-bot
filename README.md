# Root Insurance Sample Bot (Node.js)

A sample bot backed by [DialogFlow](https://console.dialogflow.com) that interacts with the Root Insurance API to issue Term Life policies.

## How To Run

1) Install dependencies using `yarn` or `npm install`
2) Add a `.env` file in the root directory with the following enviroment variables:
    ```
    # HTTP port to listen on (defaults to 3000)
    APP_PORT=3000

    # Your Root API key, as generated in your Organization settings
    ROOT_API_KEY=...

    # Root API base URL to use (defaults to https://sandbox.root.co.za/v1/insurance)
    ROOT_BASE_URL=https://sandbox.root.co.za/v1/insurance
    ```
3) Start the app with `npm run dev` - this will run the app using [`nodemon`](https://github.com/remy/nodemon) for auto-restart on changes

PS: You'll also likely want to point your DialogFlow Fulfillment to your app using [`ngrok`](https://ngrok.com).

## Contributing
If you wish to contribute to this repository, please fork it and send a PR our way.

Some ideas for improvements:

* Get the user's preferred cover amount (currently hardcoded to `10000000`)
* Get the user's education status (currently hardcoded to `undergraduate_degree`)
* Check if the policyholder already exists, and if so, issue the policy for the existing policyholder

## Code of Conduct
Root’s developers and our community are expected to abide by the [Contributor Covenant Code of Conduct](https://github.com/root-community/root-insurance-go/tree/master/CODE_OF_CONDUCT.md). Play nice.
