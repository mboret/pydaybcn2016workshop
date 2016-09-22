# Pyday BCN 2016 WorkShop - Serverless with Zappa

![N|Solid](http://www.claranet.fr/sites/all/themes/claranet_responsive_2015/logo.png)

This repository content the datas related to the WorkShop.
If you want to try it, think to:

  - generate your access key and secret key for your user in your AWS account.
  - create a DynamoDB database(name: 'deployment_tracking' with a partition key 'deploy_id'(type: Number)
  - launch the script run_deploy_tracking.py(in the resources folder) to populate the dynamoDB table.
  - create an S3 Bucket to store your static file and make it public(information in the WorkShop document). And think to replace every s3 references in the documents by your bucket.
  - in the WorkShop document you can use only dev(and not devXX) for the Zappa env
  - When you have finish, think to make "zappa undeploy dev" to delete every AWS resources and manuelly delete the DynamoDB table.


