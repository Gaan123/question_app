var express = require('express');
var questions = require('../src/question.mongo');
var topics = require('../src/topics.mongo');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/search', function (req, res, next) {
    const q = req.query.q
    console.log(q)
    topics.find({$or: [{topic: q}, {parent: new RegExp(`,${q},`)}]})
        .select({"topic": 1, "_id": 0})
        .then(data => {
            const tps = data.map(topic => topic.topic);
            questions.find({"annotations": {$in: tps}})
                .select({'question': 1, '_id': 0})
                .then(data => {
                    if (!data) {
                        return res.status(404).send({error: "No Profile Found"});
                    } else {
                        res.send(data.map(q => q.question));
                    }
                }).catch(err => {
                console.log(err, 'ad');
            })
        }).catch(e => console.error(e))


    // res.end();
});
module.exports = router;
