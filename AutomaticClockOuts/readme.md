# AutomaticClockOuts function

This function will automatically clock out any entry that 
has not been clock out taking into account the timezone_diff
of the user. It will run each hour.

## Development 
If you want to apply any change, you will need to have
NodeJS 10.16.3. Azure recommends having a LTS version so that's why

You will also need to install the following module globally

```
npm i -g azure-functions-core-tools@core --unsafe-perm true
```

If you want to start this project use

```
func start
```

## Deployment
The above-install module will allow you to deploy the function
from the CLI running this command:

```
func azure functionapp publish time-tracker-azure-functions
```

NOTE:
Don't forget to set the following environment variables to make the app work locally:

```sh
ENDPOINT='XXX'
KEY='XXX'
CLIENT_ID='XXX'
AUTHORITY='XXX'
CLIENT_SECRET='XXX'
SLACK_WEBHOOK='XXX'
``` 
Check the pinned message in our slack channel to get these values
