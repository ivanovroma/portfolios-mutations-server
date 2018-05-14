/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = function(cb) { 
  
  _.extend(sails.hooks.http.app.locals, sails.config.http.locals); 
   
  // add the lines from here 
  // bootstrapping all the cronjobs in the crontab folder 
  var schedule = require('node-schedule'); 
  sails.config.crontab.crons().forEach(function(item){ 
  schedule.scheduleJob(item.interval,sails.config.crontab[item.method]); 
  }); 
   
  // It's very important to trigger this callback method when you are finished 
  // with the bootstrap! (otherwise your server will never lift, since it's waiting on the bootstrap) 
  cb(); 

};


 // module.exports.bootstrap = async function(done) {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
//   return done();

// };
