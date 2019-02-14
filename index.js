var bodyParser = require('body-parser')
var EventEmitter = require('events').EventEmitter; 
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var event = new EventEmitter()

server.listen(5000, function(){
    console.log('Server is running...')
})

//**************************************** Configuration for body-pareser */
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//*********************************************************************** */

//Pre-define the data
var data = [{
    "foyerLight":false,
    "roomLight":false,
    "scurityMode":false
}]

//Receive data from UI agent
app.post('/uitocloud', jsonParser, function (req, res) {
    // console.log('cloudServer 收到一个post，数据是:' + JSON.stringify(req.body))
    data[1] = req.body
    event.emit('data_updated')
    res.send('cloud收到你post的数据了')

});

//Test address
app.get('/', function(req, res){
    console.log(req.url + '通过/链接了cloud')
    res.send('cloud收到了你的get请求, data数据是:' + JSON.stringify(data[1]))
})

//Alternative way to get data
app.get('/data', function(req, res){

    res.send(data[1])
})

//WebSocket Server Side
io.on('connection', function (socket) {
    console.log('One client connected')

    socket.emit('connect', null)

    event.on('data_updated', function() { 
        socket.emit('news', data[1])
    })

})