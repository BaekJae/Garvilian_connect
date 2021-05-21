var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var openApiURL = "http://aiopen.etri.re.kr:8000/WiseNLU"; //문어 URL
var access_key = '';
var analysisCode = 'ner';
var text = '';
var app = express();
const oracledb = require('oracledb');
var request = require('request');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
oracledb.getConnection({
    user: 'system',
    password: '1234',
    host: 'localhost',
    database: 'xe'
}, function (err, conn){
    if(err){
        console.log('connection failed', err);
        return;
    }
    console.log('connection success');
    var code = 'A';
    conn.execute("select * from PRE",{}, {outFormat:oracledb.OBJECT}, function (err,result){
        if(err) throw err;
        console.log('query read success');
        dataStr = JSON.stringify(result);
        arrStr = JSON.stringify(result.rows);
        var arr = JSON.parse(arrStr);
        console.log(arr);
    });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.post('/emcInfoSend',function(req,res,next){
    console.log(req.body);
    var sen = req.body.Content;
    var position = req.body.Position;
    res.redirect('/');
    var openApiURL = "http://aiopen.etri.re.kr:8000/WiseNLU"; //문어 분석 URL'
    var access_key = '';
    var analysisCode = 'ner';
    var text = sen;
    var requestJson = {
        'access_key': access_key,
        'argument': {
            'text': text,
            'analysis_code': analysisCode
        }
    };
    var options = {
        url: openApiURL,
        body: JSON.stringify(requestJson),
        headers: {'Content-Type':'application/json; charset=UTF-8'}
    };
    request.post(options, function (error, response, body) {
        var decoded = JSON.parse(body);
        console.log('responseCode = ' + response.statusCode);
        console.log('responseBody = ' + body);
        console.log(Object.keys(decoded.return_object));
        console.log(decoded.return_object.sentence[0].morp[0].type);
    });
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.get('/',function(req,res) {
      res.render('index');
    }
);
app.listen(3000,function(){
  console.log('App listening on port 3000');
})

