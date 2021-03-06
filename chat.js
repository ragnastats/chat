var express     = require('express')
  , app         = require('express')()
  , server      = require('http').createServer(app)
  , io          = require('socket.io').listen(server)
  , check       = require('validator').check
  , sanitize    = require('validator').sanitize
  , count       = 0
  , users       = [];

function getDate()
{
    var date = new Date()
    
    var   day   = date.getDate()
        , month = date.getMonth() + 1
        , year  = date.getFullYear()
        , hour  = date.getHours()
        , min   = date.getMinutes()
        , sec   = date.getSeconds();

    return day+'-'+month+'-'+year+' '+hour+':'+min+':'+sec;
}

function isset(variable)
{
    if(typeof variable != "undefined")
        return true;
    else
        return false;
}

server.listen(1028);

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res)
{
  res.sendfile(__dirname + '/index-beta.html');
});

io.set('log level', 1); // reduce logging
io.sockets.on('connection', function(socket)
{
    var user = {};
    
    console.log(getDate() + ' User connected');

    var address = socket.handshake.address;
    console.log("New connection - " + address.address + ":" + address.port);

    socket.emit('connected');
    
    count++;
    io.sockets.emit('count', {count: count});

    socket.on('name', function(data)
    {
        var success = true;
        
        try
        {
            check(data.name).len(1, 16).isAlphanumeric();
        }
        catch(e)
        {
            success = false;
            socket.emit('error', {message: 'Your name must be alphanumeric and no longer than 16 characters!'});
            socket.emit('connected');
        }

        try
        {
            check(data.name).notIn(users);
        }
        catch(e)
        {
            success = false;
            socket.emit('error', {message: 'Sorry, that name is already in use.'});
            socket.emit('connected');
        }
        
        if(success)
        {
            user.name = data.name;
            users.push(data.name);
            
            io.sockets.emit('users', {list: users});
            console.log("New user name - " + user.name + " - " + address.address + ":" + address.port);
        }
    });
    
    socket.on('chat', function(chat)
    {
        // Can't chat if you don't have a name!
        if(isset(chat.message) && chat.message
            && isset(user.name) && user.name)
        {
            var message = sanitize(chat.message).entityEncode();

            if(message == '/n' || message == '/names')
            {
                socket.emit('chat', {color: 'pink', user: count + ' users connected', message: users.join(', ')});
            }
            else
            {
                socket.emit('chat', {color: 'lime', user: user.name, message: message});
                socket.broadcast.emit('chat', {color: 'white', user: user.name, message: message});
                console.log(user.name + " : " + message);
            }
        }
    });

    socket.on('disconnect', function()
    {
        console.log(getDate() + ' User disconnected');
        console.log("Connection closed - " + address.address + ":" + address.port);

        count--;
        
        // Remove user name from user list if they gave us one
        if(isset(user.name))
        {
            var index = users.indexOf(user.name);
            
            if(index != -1)
                users.splice(index, 1);
        }
        
        io.sockets.emit('count', {count: count});
        io.sockets.emit('users', {list: users});
    });
});
