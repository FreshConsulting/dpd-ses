/**
* Module dependencies
*/

var Resource = require('deployd/lib/resource'),
		util = require('util'),
		exec = require('child_process').exec,
		child;

// load aws sdk
var aws = require('aws-sdk');

/**
* Module setup.
*/

function SES( options ) {

	Resource.apply( this, arguments );

}
util.inherits( SES, Resource );

SES.prototype.clientGeneration = true;

SES.events = ['post'];

SES.basicDashboard = {
	settings: [
		{
			name        : 'accessKey',
			type        : 'text',
			description : 'The AWS access key id'
		}, {
			name        : 'accessSecret',
			type        : 'text',
			description : 'The AWS secret access key'
		}, {
			name        : 'region',
			type        : 'text',
			description : 'The AWS region'
		}, {
			name        : 'defaultFromAddress',
			type        : 'text',
			description : 'Optional; if not provided you will need to provide a \'from\' address in every request'
		}, {
			name        : 'internalOnly',
			type        : 'checkbox',
			description : 'Only allow internal scripts to send email'
		}
	]
};

/**
* Module methodes
*/

SES.prototype.handle = function ( ctx, next ) {

	if ( ctx.req && ctx.req.method !== 'POST' ) {
		return next();
	}

	if ( !ctx.req.internal && this.config.internalOnly ) {
		return ctx.done({ statusCode: 403, message: 'Forbidden' });
	}

	var options = ctx.body || {};
	options.from = options.from || this.config.defaultFromAddress;

	var errors = {};
	if ( !options.to ) {
		errors.to = '\'to\' is required';
	}
	if ( !options.from ) {
		errors.from = '\'from\' is required';
	}
	if ( !options.message ) {
		errors.message = '\'message\' is required';
	}
	if ( Object.keys(errors).length ) {
		console.log('errors: '+ JSON.stringify(errors));
		return next();
	}



	SES.send(options, ctx, this);

};

SES.send = function (options, ctx, that) {
	aws.config.update({
		accessKeyId: that.config.accessKey,
		secretAccessKey: that.config.accessSecret,
		region: that.config.region
	});

	// load AWS SES
	var ses = new aws.SES({apiVersion: '2010-12-01'});

	ses.sendEmail( {
		Source: options.from,
		Destination: { ToAddresses: [options.to] },
		Message: {
			Subject: {
				Data: options.subject
			},
			Body: {
				Text: {
					Data: options.message,
				}
			}
		}
	}, function(err, data) {
		if(err) {
			console.log(JSON.stringify(err));
			return ctx.done( err );
		}else{
			console.log('Email sent:');
			console.log(data);
			ctx.done( null, { message : data } );
		}
	});
};

/**
* Module export
*/

module.exports = SES;