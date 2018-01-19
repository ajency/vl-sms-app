const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dataHandler = require("./data");

const app = express();

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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
    res.status(200).json({
        status: "success",
        msg: "ok",
        data: dataHandler('departures').departures
        }
        );
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
            response['msg'] = "Data doesn't exist";
        }


        res.status(200).json(response);
    
});


app.use('/v1/api',apiRoutes);


app.set('port', process.env.port || 3000);

app.listen(app.get('port'));