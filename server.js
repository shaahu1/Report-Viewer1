const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
var cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
var fs = require('fs');
const e = require('express');
const { setTimeout } = require('timers');
const { Console } = require('console');

const {
   Request
} = require('tedious');

var Connection = require('tedious').Connection;


const portlist = ['http://localhos:3000', 'http://localhos:5000', 'https://reportviewer2.herokuapp.com']
const corsOptions = {
    origin: function(origin, callback) 
    {
        console.log('** Origin of request'+ origin)
        if (portlist.indexOf(origin) !== -1 || !origin)
        {
            console.log('origin acceptable')
            callback(null, true)
        } 
        else
        {
            console.log('origin rejected')
            callback(new Error ('Not allowed by CORS'))
        }
    }
}


var config = {
   server: '3.95.132.37', //update me
   authentication: {
      type: 'default',
      options: {
         userName: 'reportUser', //update me
         password: 'Heshan@123', //update me
      }
   },
   options: {
      encrypt: false,
      enableArithAbort: true,
      integratedSecurity: true,
      trustServerCertificate: true,
      rowCollectionOnDone: true,
      database: 'Inventory' //update me
   }
};

const conn = {
    user: 'reportUser',
    password: 'Heshan@123',
    //user: 'website',
    //password: '12345',
    server: '', 
    database: 'Inventory' ,
    options: {
        enableArithAbort: true,
        encrypt: false,
        rowCollectionOnRequestCompletion: true,
      },
      parseJSON: true
    
};

/*var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        if(!err)
            console.log("Connected");
        else
            console.log("Not Connected", err.message);  

    }); */




app.post("/serverName", (req, res) => {
    console.log ( "setCon")
    conn.server = req.body.server;
    //conn.server = '124.6.253.50';
    console.log ( "server name",conn)
}) 





app.get("/companyDetails", (req, res) => {

    console.log(conn.server)

    setTimeout( function() {

        if (conn.server != '')
        {
            sql.connect(conn, function (err) { 
                if (err) {
                    console.log(err + " com details")
                }
                else
                {
                    var request = new sql.Request();

                    request.query(
                                `exec spGetCompanyDetails`, (err, data) =>{

                    res.send(data);
                    console.log('shopDetails',data);
                })
                }
                
            })
        } 
        else
        {
            console.log('Server name is not found', conn.server)
        }
        
    })

    
})

 

app.post('/salesSummery', (req, res) => {
    
         sql.connect(conn, function (err) {
            if (err) {
                
                    console.log(err.message + " sales summery")
            }
            else
            {
                var request = new sql.Request();
                const location =  req.body.location;
                const cashier = req.body.cashier;
                const unit = req.body.unit;
                const fromDate = req.body.fDate;
                const toDate = req.body.tDate;

                //console.log("fd"+fromDate)


                request.query(
                    
                    `exec spGetSalesSummaryReport ${location}, '${fromDate}', '${toDate}', ${unit}, '${cashier}'; select * from SalesSummary;`, (err, data) =>{
                    //`exec spGetSalesSummaryReport '${fromDate}', '${toDate}', 1, 1, 1;`, (err, data) =>{
                    if (!err)
                    { 
                        res.send(data.recordset[0]); 
                        state = false;
                        console.log(data.recordset[0])
                    }else
                    {
                        console.log('nottt', err)
                    }
                    
                })
            }
            
            
            
        })

    
})


app.post('/purchesReport', (req, res) => 
{
    sql.connect(conn, function (err) {
        if (err) {console.log(err)}

        var request = new sql.Request();
        const reportType = req.body.reportType;
        const location = req.body.location;
        const fDate = req.body.fDate ;
        const tDate = req.body.tDate;
        const supplier = req.body.supplier;

        request.query(`exec spGetPurchasingReport 1, 1, '0${location}', '${supplier}', '${fDate}', '${tDate}', ${reportType}`, (err, data)=>
        {
            if (err)
            {
                console.log(err)
            }
            res.send(data.recordsets[0]); 
            console.log('puechaceReport', data)
        })

    })
})

app.post('/stockBalance', (req, res) => 
{
    sql.connect(conn, function (err) {
        if (err) {console.log(err)}

        var request = new sql.Request();
        const location = req.body.location;
        const reportType = req.body.reportType;
        const isWithImg = req.body.isWithImg;
        const isWithZeeros = req.body.isWithZeeros;
        const date = req.body.date || '';
        const supplier = req.body.supplier || '';
        const datagridView = 1;
        
        console.log(date, location, reportType, isWithImg, isWithZeeros, supplier)

        request.query( `execute [spGetStockBalanceReport] ${datagridView}, ${reportType}, '${date}', '${supplier}', ${location}, ${isWithImg}, ${isWithZeeros}`, (err, data) => 
        {
            if (err)
            {
                console.log(err)
            }
            res.send(data.recordsets[0]); 
            console.log('stockBalance', data)
        } )

    })
})


app.post('/lastWeekDetails', (req, res) => {
    
    if (conn.server != '')
    {

        sql.connect(conn, function (err){
            if (err) {
                    console.log(err.message + "last week")
            }
    
            var request = new sql.Request();
            const date1 = req.body.date1;
            const date2 = req.body.date2;
            const date3 = req.body.date3;
            const date4 = req.body.date4;
            const date5 = req.body.date5;
            const date6 = req.body.date6;
            const date7 = req.body.date7;
            const date8 = req.body.date8;
            console.log(date1, date2)
    
            request.query( `exec spLastWeek '${date1}', '${date2}', '${date3}', '${date4}', '${date5}', '${date6}', '${date7}', '${date8}';`
                , (err, data) =>{
                if (!err)
                { 
                    res.send(data); 
                    state = false;
                    console.log('weekData', data)
                }
                else
                {
                    console.log('nottt', err)
                }
                
            })
        })
    }
})

app.post("/productInfo", (req, res) => 
{
    sql.connect(conn, function(err)
    {
        if (err) {console.log(err)}

        var request = new sql.Request();
        const code = req.body.code;

        request.query(`execute spGetProductInfo '${code}'`, (err, data) =>
        {
            if (err) {console.log(err)}

            res.send(data.recordsets[0]); 
            console.log(data);
        })

    })
})


app.post("/updateProductDetails", (req, res) =>
{
    sql.connect(conn, function (err) 
    {
        if (err) {console.log(err + " product update error")}

        var request = new sql.Request();
        const salling = req.body.salling;
        const cost = req.body.cost;
        const code = req.body.code;

        request.query(`
                        UPDATE ProductDetail 
                        SET CostPrice = '${cost}', AvgCost = '${cost}', SellingPrice = '${salling}' 
                        FROM ProductDetail PD
                        INNER JOIN Product P ON PD.ProductID = P.ProductID
                        WHERE P.ProductCode = ${code}`, (err,data) =>
        {
            if (err) {console.log(err)}

            res.send(data.recordsets[0]); 
            console.log(data);
        })

    })
})


if (process.env.NODE_ENV === 'production')
{
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', function(req, res)
    {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}



const port = 5000;

app.listen(process.env.PORT || port, () => console.log(`server started on port ${process.env.PORT || port}`))