var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var projectRouter = require('./routes/project');
var weekRouter = require('./routes/week_report')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
        secret:'dog',
        resave:true,
        saveUninitialized:false,
        cookie : {
            maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
        }
    }));
app.use(express.static(path.join(__dirname, 'public')));

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Credentials: true");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


//拦截器
/*app.use(function (req, res, next) {
    var url = req.originalUrl;
    console.log(req.session);
    if (url != "/user/login" && !req.session.userObj&&url != "/user/register") {
        res.json({
            code:8
        });
    }else {
        next();
    }
});*/

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/week',weekRouter)
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
