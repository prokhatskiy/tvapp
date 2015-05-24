var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var fs = require('fs');

var connection = mongoose.connect('mongodb://localhost:27017/tvapp');

var user = {
    name: 'admin',
    password: 'admin'
};

var DEFAULTS = {
    SERVICES: {
        ROOT: 'services',
        GET_SLIDE: 'slide',
        POST_SLIDE: 'slide',
        DELETE_SLIDE: 'slide',
        GET_TIMELINE: 'timeline',
        POST_TIMELINE: 'timeline',
        GET_SLIDES: 'slides',
        POST_SLIDES: 'slides',
        LOGIN: 'login',
        LOGOUT: 'logout',
        CHECK_ACCESS: 'access',
        IMAGE: 'image'
    }
};

var slideShema = new Schema({
    isActive: {type: Boolean, default: false},
    timelineOrder: {type: Number, default: 0},
    generalOrder: {type: Number, default: 0},
    title: String,
    description: String,
    slideType: String,
    name: String,
    position: String,
    department: String,
    startDate: Date,
    imageSrc: String,
    dateRangeStart: Date,
    dateRangeEnd: Date,
    videoURL: String,
    duration: {type: Number, default: 10},
    employees: [{
        name: String,
        date: Date
    }]
});

var tokenShema = new Schema({
    token: String
});

var Slide = mongoose.model('Slide', slideShema);
var Token = mongoose.model('Token', tokenShema);

router.use(function (req, res, next) {
    if (req.url.indexOf('/' + DEFAULTS.SERVICES.ROOT + '/') === -1) {
        next();

        return;
    }

    if (req.url.indexOf('/' + DEFAULTS.SERVICES.LOGIN) !== -1 || req.url.indexOf('/' + DEFAULTS.SERVICES.LOGOUT) !== -1) {
        next();

        return;
    }

    Token.find({}, function (err, docs) {
        if (err) return res.status(400).send(err);

        if (req.cookies.token && docs[0].token === req.cookies.token) {
            next();
        }
        else {
            res.status(401).send('Access denied');
        }
    });
});

router.get('/', function (req, res) {
    res.render('index', {
        title: 'EPAM TV',
        links: ['/css/styles.css',
            '/bower_components/jquery-ui/themes/cupertino/jquery-ui.min.css',
            '/bower_components/ng-sortable/dist/ng-sortable.css',
            '/bower_components/jquery-ui/themes/cupertino/theme.css']
    });
});

router.get('/slideshow', function (req, res) {
    res.render('slideshow', {
        title: 'EPAM TV',
        links: []
    });
});

router.get('/' + DEFAULTS.SERVICES.ROOT + '/' + DEFAULTS.SERVICES.GET_SLIDES, function (req, res) {
    Slide.find({}, function (err, docs) {
        if (err) return console.log(err);
        res.send(docs);
    });
});

router.post('/' + DEFAULTS.SERVICES.ROOT + '/' + DEFAULTS.SERVICES.POST_SLIDES, function (req, res) {
    var slides = req.body;

    slides.forEach(function(slide) {
        var slide = new Slide(slide);

        Slide.update({'_id': slide._id}, slide.toObject(), {upsert: true}, function (err, numberAffected, raw) {
            if (err) return console.log(err);
            console.log('The number of updated documents was %d', numberAffected);
            console.log('The raw response from Mongo was ', raw);
        });
    });

    res.status(202).send('Ok');
});

router.get('/' + DEFAULTS.SERVICES.ROOT + '/' + DEFAULTS.SERVICES.GET_SLIDE + '/:id', function (req, res) {
    Slide.findOne({'_id': req.params.id}, function (err, doc) {
        if (err) return console.log(err);
        res.send(doc);
    });
});

router.delete('/' + DEFAULTS.SERVICES.ROOT + '/' + DEFAULTS.SERVICES.DELETE_SLIDE + '/:id', function (req, res) {
    Slide.findOne({'_id': req.params.id}, function (err, doc) {
        if (err) return console.log(err);
        doc.remove();
        res.status(202).send('Ok');
    });
});

router.get('/' + DEFAULTS.SERVICES.ROOT + '/' + DEFAULTS.SERVICES.CHECK_ACCESS, function (req, res) {
    res.send('OK');
});

router.post('/' + DEFAULTS.SERVICES.ROOT + '/' + DEFAULTS.SERVICES.POST_SLIDE, function (req, res) {
    var slide = new Slide(req.body);

    if (req.body._id) {
        Slide.update({'_id': req.body._id}, slide.toObject(), {upsert: true}, function (err, numberAffected, raw) {
            if (err) return console.log(err);
            console.log('The number of updated documents was %d', numberAffected);
            console.log('The raw response from Mongo was ', raw);

            res.status(202).send(raw);
        });
    }
    else {
        slide.save(function (err) {
            if (err) return handleError(err);
            res.status(202).send(slide);
        });
    }
});

router.post('/' + DEFAULTS.SERVICES.ROOT + '/' + DEFAULTS.SERVICES.LOGIN, function (req, res) {
    if (req.body.username === user.name && req.body.password === user.password) {
        var now = new Date().getTime();
        var md5 = crypto.createHash('md5');
        var token = '';

        md5.update(req.body.username + now + req.body.password);
        token = md5.digest('hex');

        Token.update({}, {token: token}, {upsert: true}, function (err) {
            if (err) return res.status(400).send(err);

            res.status(202).send(token);
        });
    }
    else {
        res.status(401).send('Access denied');
    }
});

router.post('/' + DEFAULTS.SERVICES.ROOT + '/' + DEFAULTS.SERVICES.LOGOUT, function (req, res) {
    res.clearCookie('token');

    Token.update({}, {token: ''}, {upsert: true}, function (err, numberAffected, raw) {
        if (err) return res.status(400).send(err);

        res.status(202).send('OK');
    });
});

router.delete('/' + DEFAULTS.SERVICES.ROOT + '/' + DEFAULTS.SERVICES.IMAGE, function (req, res) {
    fs.unlink('./public/' +  req.query.src, function (err) {
        if (err) return res.status(400).send(err);

        res.status(202).send('ok');
    });

});

module.exports = router;