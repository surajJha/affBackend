/**
 * Created by surajkumar on 14/03/17.
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

if (process.env.NODE_ENV == "production") {
  //  require('newrelic');
}

process.env.PORT = process.env.PORT || 80;
process.env.VERSION = require('./package.json').version || 'undefined';

if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "testing") {
    process.env.DEBUG = process.env.DEBUG || 'app,express:router,express:application,info,affbackend:*';
}
var debug = require('debug')('app');
var info = require('debug')('app');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var config = require("./config/" + process.env.NODE_ENV + ".json");
debug('environment: ' + process.env.NODE_ENV);
debug('version: ' + process.env.VERSION);

if (cluster.isMaster) {

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
        info("Cluster forked " + i);
    }

    cluster.on('exit', function(worker, code, signal) {
        info('worker ' + worker.process.pid + ' died with code: ' + code + " signal: " + signal);
        if (code !== 0) {
            cluster.fork();
            info('New process folked');
        }
    });

    cluster.on('online', function(worker) {
        info('A worker with #' + worker.id + " has started");
    });

    cluster.on('listening', function(worker, address) {
        info('A worker is now connected to ' + address.address + ':' + address.port);
    });
}

if (cluster.isWorker) {

    var app = require("express")();

    app.set('env', process.env.NODE_ENV);
    app.set('port', process.env.PORT);
    app.set('debug', process.env.DEBUG);
    app.set('version', process.env.VERSION);

    var bodyParser = require('body-parser');

    app.disable('x-powered-by');
    app.disable('etag');
    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({
        extended: false
    }));

    app.use(function(req, res, next) {
        var error = new Error('Are you lost?');
        error.status = 404;
        next(error);
    });

    if (app.get('env') == "development") {
        app.use(function(error, req, res, next) {
            debug("http_status: %d, %s", error.status || 500, error.message);
            next(error);
        });
    }

    app.use(function(error, req, res, next) {
        res.status(error.status || 500).send({
            title: 'error',
            error: error,
            message: error.message,
            trace: error.stack
        });
    });

    var server = app.listen(app.get('port'), function() {
        debug('Express server listening on port ' + server.address().port);
    });

    process.on('exit', function(code) {
        debug('Cleaning up ...');
        require('./cleanup')(app);
        debug('Exiting !!!');
    });

    process.on('uncaughtException', function(error) {
        debug('error(unhandled): ' + error);
        console.log({
            title: 'error',
            error: error,
            message: error.message,
            trace: error.stack
        });
        process.exit(1);
    });

    process.on('SIGINT', function() {
        debug('gotta exit - SIGINT');
        process.exit(0);
    });
}