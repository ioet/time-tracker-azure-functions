# Time Tracker Azure Functions

## Requirements

- NodeJS 10

## Considerations

The functions run in **Serverless Framework** and use **Linux** like OS to run functions.

## Install

Install Serverless

```bash
npm install -g serverless
```

Check Install

```bash
serverless -v
```

Install azure plugins

```bash
serverless plugin install --name serverless-azure-functions
```


In case that you have **make** installed in your computer you can use

```bash
make install-serverless-plugins
```

## Azure Account

### Install Azure CLI

[More Information](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### Login

```bash
az login
```

## NodeJs Functions

### Create new function
Go to *nodejs-functions/*, to add a new function, you need create a new directory in *src/handlers/*, inside of directory you need create a **index.js** file

And how last step you need add reference to this function in **serverless.yml**, check the azure serverless documentation [here](https://www.serverless.com/framework/docs/providers/azure/guide/intro/) for more information.

### Add Third Parties Dependencies
Add *package.json* with the modules that you need inside of function directory. Then add the follow line in **Makefile** inside of *nodejs-functions/*:

```bash
install-dependencies-nodejs:
	cd src/handlers/automatic-clock-outs ; pwd ; $(MAKE) install
	cd src/handlers/my-awesome-function ; pwd ; $(MAKE) install ## add function path. Dont forget use tabs

```


## Python Functions

Go to *python-functions/*, to add a new function, you need create a new directory in *src/handlers/*, inside of directory you need create a _ _ init _ _.py file

And how last step you need add reference to this function in **serverless.yml**, check the azure serverless documentation [here](https://www.serverless.com/framework/docs/providers/azure/guide/intro/) for more information.


## Ops Work
In case that you need:
- Add a new Environment Variable
- Create some function with third parties dependencies
- Error in Pipeline
- Some Question :)
