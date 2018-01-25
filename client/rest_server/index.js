const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dataHandler = require("./data");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('../dist'));

app.get('/',function(req,res){
    res.sendFile('index.html',{'root': '../dist'})
});

app.get('/login',function(req,res){
    res.sendFile('index.html',{'root': '../dist'})
});

app.get('/send-sms',function(req,res){
    res.sendFile('index.html',{'root': '../dist'})
});

app.get('/send-sms/:trip_id',function(req,res){
    res.sendFile('index.html',{'root': '../dist'})
});

const apiRoutes = express.Router();

apiRoutes.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","*");
    res.header("Access-Control-Allow-Methods","*");
    next();
});

apiRoutes.options(function(req,res){
    // res.status(200).send({status: 'ok'});
    res.send(200);
});

apiRoutes.post('/login',function(req,res){

    if(req.body.username == 'nutan' && req.body.password == 'password'){
        res.status(200).json({
            status: "success",
            msg: "ok",
            token: 'passwordXXXXX'
        });
    }
    else{
        res.status(401).json({
            status: "error",
            msg: "user doesn't exist"
        });
    }
    
});

apiRoutes.post('/validate-token',function(req,res){

    // if(req.body.token === 'passwordXXXXX'){
    //     res.status(200).json({
    //         status: "success",
    //         msg: "ok",
    //         token: 'passwordXXXXX'
    //     });
    // }
    // else{
    //     res.status(200).json({
    //         status: "error",
    //         msg: "user doesn't exist"
    //     });
    // }
    
    res.status(401).json({message: "Unauthenticated"});
});

apiRoutes.post('/trips',function(req,res){
    res.status(200).json(
        {
            status: "success",
            msg: "ok",
            data:  dataHandler('trips').trips
            }
            
    );
});

apiRoutes.post('/departures',function(req,res){
    var response =  {
            status: "success",
            msg: "ok",
            data: dataHandler('departures').departures
        };
    if(req.body.filters.trip_id == 1 || req.body.filters.trip_id == 2){
        response.status = "success";
        response.msg = 'ok';
        response.data = dataHandler('departures').departures;
    }
    else{
        response.status = "error";
        response.msg = 'Departures for trip dont exist!';
        response.data = [];
    }

    res.status(200).json(response);
});

apiRoutes.post('/trip-passengers',function(req,res){
    var data = [];

    if(req.body.departure_id == 1){
        data = dataHandler('participants').participants_1;
    }
    else if(req.body.departure_id == 2){
        data = dataHandler('participants').participants_2;
    }

   
        var response = {
            status: 'error',
            msg: '',
            data: data
        };

        if(data.length){
            response['msg'] = "ok";
        }
        else{
            response['msg'] = "No participants found for departure!";
        }


        res.status(200).json(response);
    
});

var count = 0;

apiRoutes.post('/send-sms',function(req,res){
    setTimeout(() => {
        count++

        if(count === 3){
            count = 0;
            res.status(200).json({
                status: "error",
                msg: 'failed to send sms'
            });
        }
        else{
            res.status(200).json({
                status: "success",
                msg: 'ok'
            });
        }

    },2000);
});

apiRoutes.post('/sms-notifications',function(req,res){
    var data = dataHandler('notifications');
   
    var response = {
        status: 'success',
        msg: 'ok',
        data: data
    };


    if(Math.round(Math.random()) > 0.5){
        response['status'] = 'error';
        response['msg'] = "Random entropy error";
        response['data'] = [];
        res.status(200).json(response);
    }
    else{
        res.status(200).json(response);
    }
    // if(data.length){
    //     response['msg'] = "ok";
    // }
    // else{
    //     response['msg'] = "No participants found for departure!";
    // }



    
});


app.use('/v1/api',apiRoutes);

app.set('port',PORT);

app.listen(app.get('port'));

console.log("server listening on port", PORT);
