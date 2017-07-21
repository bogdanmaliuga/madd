'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const api_key = 'key-bd3e66c3dcacd16ea5366457c38ba845';
const domain = 'mg.imaginemad.com';
//const siteUrl = 'http://localhost:3000';
const siteUrl = 'http://nodewebsolutions.com/demo/projectmgt/';

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
//const gmailEmail = encodeURIComponent(functions.config().gmail.email);
//const gmailPassword = encodeURIComponent(functions.config().gmail.password);




// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendEmailConfirmation = functions.database.ref('/unregisteredUser/connections/{pushId}').onWrite(event => {
  // Only edit data when it is first created.
      if (event.data.previous.exists()) {
        return;
      }
      // Exit when the data is deleted.
      if (!event.data.exists()) {
        return;
      }

  const snapshot = event.data;
  const val = snapshot.val();
  console.log(val);
  /*if (!snapshot.changed('subscribedToMailingList')) {
    return;
  }*/
if(val)
{
  
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
  
  var data = {
    from: 'MADD <me@samples.mailgun.org>',
    //to: 'soyab.s@techmanha.com',
    to: val.invitationTo,
    subject: 'MADD User Invitation',
    html: '<b>Hi,</b><p>You have received connection invitation from '+val.senderName+' ('+val.senderEmail+').</p><p>To respond this invitation please signup in <a href="'+siteUrl+'/#/register">MADD</a>.</p><p>Thank you,</p><p>MADD Support</p>'
  };
  
  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });
}
else
{

}
});
exports.sendEmailMADDCoins = functions.database.ref('/madcoins/{pushId}').onWrite(event => {
  // Only edit data when it is first created.
      if (event.data.previous.exists()) {
        return;
      }
      // Exit when the data is deleted.
      if (!event.data.exists()) {
        return;
      }
  const snapshot = event.data;
  const val = snapshot.val();
  console.log(val);
  /*if (!snapshot.changed('subscribedToMailingList')) {
    return;
  }*/
if(val)
{

  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
  
  var data = {
    from: 'MADD <me@samples.mailgun.org>',
    //to: 'soyab.s@techmanha.com',
    to: val.clientEmail,
    subject: 'MADD Coins Received',
    html: '<b>Hi,</b><p>You have received '+val.amount+' MAD coins from '+val.addedBy+'.</p><p> <a href="'+siteUrl+'/#/register">signup</a>/<a href="'+siteUrl+'/#/login">signin</a>  MADD.</p><p>Thank you,</p><p>MADD Support</p>'
  };
  
  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });
}
else
{

}
});
exports.sendSuperUserInvitation = functions.database.ref('/unregisteredUser/superUsers/{pushId}').onWrite(event => {
  // Only edit data when it is first created.
      if (event.data.previous.exists()) {
        return;
      }
      // Exit when the data is deleted.
      if (!event.data.exists()) {
        return;
      }
  const snapshot = event.data;
  const val = snapshot.val();
  console.log(val);
  /*if (!snapshot.changed('subscribedToMailingList')) {
    return;
  }*/
if(val)
{

  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
  
  var data = {
    from: 'MADD <me@samples.mailgun.org>',
    //to: 'soyab.s@techmanha.com',
    to: val.email,
    subject: 'MADD Superuser Invitation.',
    html: '<b>Hi '+val.name+',</b><p>You have received invitation to become a MAD superuser from '+val.addedBy+'.</p><p> To respond this invitation please signup in <a href="'+siteUrl+'/#/register">MADD</a>.</p><p>Thank you,</p><p>MADD Support</p>'
  };
  
  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });
}
else
{

}
});
