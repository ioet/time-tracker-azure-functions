# Azure Functions

 
# CosmosDB bindings with Serverless Framework:
 
To use CosmosDB bindings modify the host.json on your main folder to:
``` yaml
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[1.*, 2.0.0)"
  }
}
 ```
 
## There is two types of CosmosDB bindings: 
### "cosmosdbtrigger" 
 
The Azure Cosmos DB Trigger uses the Azure Cosmos DB Change Feed to listen for inserts and updates across partitions. The change feed publishes inserts and updates, not deletions.
 
To set-up this binding in the serverless framework, add this event to the serverless.yml
 ``` yaml
events:
      - cosmosDB: true
        x-azure-settings:
          name: documents # name of input parameter in function signature
          databaseName: <dbName>
          direction: in
          leaseCollectionName: leases
          connectionStringSetting: <ConnectionStringToTheCosmosDB>
          collectionName: <collectionName>
          createLeaseCollectionIfNotExists: true
          leaseCollectionPrefix: <prefixUsedIntheLeaseDB>
 ```
 
### "cosmosdb"
 
The Azure Cosmos DB output binding lets you write a new document to an Azure Cosmos DB database using the SQL API.
To set-up this binding in the serverless framework, add this event to the serverless.yml
 ``` yaml
      - cosmosDB: true
        x-azure-settings:
          direction: out
          name: events # name the output in function signature 
          databaseName: <dbName>
          collectionName: <collectionName>
          leaseCollectionName: leases
          createLeaseCollectionIfNotExists: true
          connectionStringSetting: <ConnectionStringToTheCosmosDB>
          createIfNotExists: true # A boolean value to indicate whether the collection is created 
 ```
Problems with the CosmosDB bindings and the serverless framework: 
If there is only one event with the direction set to out, the serverless framework will change the name of this binding to “$return” this will cause problems because this name needs to be the same as the defined in the  function signature, to solve this, instead of defining the name in the function signature like this:
``` py
def main(documents: func.DocumentList, events: func.Out[func.Document]):
```

Define the return of the function like this:
``` py
def main(documents: func.DocumentList) -> func.Document:
```
And return directly the document that you want to add to the database. 
