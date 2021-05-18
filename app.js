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
var request = require('request')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.post('/emcInfoSend',function(req,res,next){
    console.log(req.body);
    var sen = req.body.Info;
    var position = req.body.Position;
    res.end("success");
    var openApiURL = "http://aiopen.etri.re.kr:8000/WiseNLU"; //문어 분석 URL'
    var access_key = '3e184c53-50c5-484c-894d-59ed5b09f164';
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
        console.log('responseCode = ' + response.statusCode);
        console.log('responseBody = ' + body);
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

