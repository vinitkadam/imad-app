var express = require('express');
var morgan = require('morgan');
var path = require('path');

var Pool = require('pg').Pool; //include Pool to run queries

//create a config file
var config = {
    user: 'vinitkadam1997',
    database: 'vinitkadam1997',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

//create a pool
var pool = Pool(config);

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

var articles = {
    'article-one': {
        title: 'Article One | Vinit Kadam',
        heading: 'Article One',
        date:'Aug 11, 2017',
        content: `
            <p>
        		This is the content for my new article.This is the content for my new article.This is the content for my new article.This is the content for my new article.
        	</p>
        	<p>
        		This is the content for my new article.This is the content for my new article.This is the content for my new article.This is the content for my new article.
        	</p>
        	<p>
        		This is the content for my new article.This is the content for my new article.This is the content for my new article.This is the content for my new article.
        	</p>
        `
    },
    'article-two':{
        title: 'Article Two | Vinit Kadam',
        heading: 'Article Two',
        date:'Aug 11, 2017',
        content: `
            <p>
        		This is the content for my new article.This is the content for my new article.This is the content for my new article.This is the content for my new article.
        	</p>

        `
    },
    'article-three':{
        title: 'Article Three | Vinit Kadam',
        heading: 'Article Three',
        date:'Aug 11, 2017',
        content: `
            <p>
        		This is the content for my new article.This is the content for my new article.This is the content for my new article.This is the content for my new article.
        	</p>
        	<p>
        		This is the content for my new article.This is the content for my new article.This is the content for my new article.This is the content for my new article.
        	</p>

        `
    }
};

function template(data){
    
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    
    var htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
            	<title>${title}</title>
            	<meta name="viewport" content="width=device-width, initial-scale=1">
                <link href="ui/style.css" rel="stylesheet" />
            </head>
            
            <body>
                <div class="container">
                    <div>
                    	<a href="/">home</a>
                    </div>
                    <hr>
                    <h3></h3>
                    <div>
                    	${date}
                    </div>
                    <div>
                    	${content}
                    </div>
                </div>
            </body>
            </html>
    `
    return htmlTemplate;
}
var counter = 0;
app.get('/counter', function(req,res) {
    counter = counter + 1;
    res.send(counter.toString());
});

names=[];
app.get('/submit-name',function(req,res){
    //get the name from request
    var name = req.query.name;
    
    names.push(name);
    res.send(JSON.stringify(names));
});

app.get('/:articleName', function(req,res){
    var articleName = req.params.articleName;
    res.send(template(articles[articleName]));
});

app.get('/test-db', function(req,res){
    //make a select request
    //return a response
    pool.query('Select * from test',function(err,result){
        if(err)
            res.status(500).send(err.toString());
        else{
            res.send(JSON.stringify(result));
        }
    });
});
app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
