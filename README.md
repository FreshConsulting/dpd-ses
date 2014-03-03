# dpd-ses v0.1.1

[Deployd](http://www.deployd.com) resource module for sending emails via Amazon AWS SES

## Install

	npm install dpd-ses

## Configuration

Add a resource in the deployd dashboard selecting SES and name your resource. In the config for your new resource, you'll need to supply:

-	AWS Access Key
- 	AWS Secret
-	AWS region (SES is typically operating out of us-east-1 only)

*additional optional configurations:*

-	Default 'from' address.   If one is not provided you will need to provide a 'from' address in every request to the resource.
-	Internal only.  Only allow the resource to be accessed from internal deployd requests, and not from general public requests.

*example*

	var email = {
        to:'someone@mail.com',
        subject:'Check out Depolyd',
        message:'Deployd is a really sweet node.js based platform for building API services'
    };
    dpd.emailShare.post(email, function(result){
        console.log('returned from email request: '+JSON.stringify(result));
    });

## TODO's

- 	Add HTML message body support