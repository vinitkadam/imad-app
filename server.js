var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');



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
var pool = new Pool(config);

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: {maxAge: 1000*60*60*24*30 }
}));



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/test-db', function(req,res){
    //make a select request
    //return a response
    pool.query('Select * from test',function(err,result){
        if(err)
            res.status(500).send(err.toString());
        else{
            res.send(JSON.stringify(result.rows));
        }
    });
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
                <link href="/ui/style.css" rel="stylesheet" />
            </head>
            
            <body>
                <div class="container">
                    <div>
                    	<a href="/">home</a>
                    </div>
                    <hr>
                    <h3></h3>
                    <div>
                    	${date.toDateString()}
                    </div>
                    <div>
                    	${content}
                    </div>
                </div>
            </body>
            </html>
    `;
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

app.get('/articles/:articleName', function(req,res){
    
    pool.query("SELECT * FROM article WHERE title = $1",[req.params.articleName],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length===0)
            {
                res.status(404).send('article not found');
            }else{
                 res.send(template(result.rows[0]));
            }
        }
    });
});

function hash(input,salt){
    
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkf2","10000",salt,hashed.toString('hex')].join('$');
    
}

app.get('/hash/:input',function(req,res){
    var salt = crypto.randomBytes(128).toString('hex');
    var hashedString = hash(req.params.input,salt);
    res.send(hashedString);
});

app.post('/createuser',function(req,res){
    
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var hashedpass = hash(password,salt);
    pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,hashedpass],function(err,result){
        if(err) 
            res.status(500).send(err.toString());
        else{
            res.send("user created successfully");
        }
    });
});

app.post('/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * FROM "user" WHERE username=$1',[username],function(err,result){
        if(err)
            res.status(500).send(err.toString());
        else{
            if(result.rows.length===0){
                res.status(403).send('username/password incorrect');
            } else{
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedpass = hash(password,salt);
                if(hashedpass === dbString){
                    
                    //set the session
                    req.session.auth = {userId: result.rows[0].id};
                    //internally what happens?
                    //sets a cookie with a session id
                    //internally, on the server side, it maps the session id to an object
                    //object contains {auth:{userId }}
                    //saved after response is sent
                    
                    
                    
                    res.send("user logged in successfully");
                } else {
                    res.status(403).send('username/password incorrect');
                }
            }
            
            
        }
    });
});


//check login
app.get('/check-login',function(req,res){
    if(req.session && req.session.auth && req.session.auth.userId){
        res.send('You are logged in');
    } else {
        res.send('You are not logged in');
    }
});

app.get('/logout', function(req,res){
    delete req.session.auth;
    res.send("logged out");
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