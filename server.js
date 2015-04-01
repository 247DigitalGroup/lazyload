var cluster = require('cluster')
  , app = require('./app');

if (cluster.isMaster) {
  var numCPUs = require('os').cpus().length;
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  Object.keys(cluster.workers).forEach(function(id) {
    console.log('Creating process with pid = ' + cluster.workers[id].process.pid);
  });
} else {
  app.listen(app.get('port'), function(){
    console.log(("Express server listening on port " + app.get('port')))
  });
}
