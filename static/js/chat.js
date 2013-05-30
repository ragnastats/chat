var socket = io.connect(window.location.host);

socket.on('connected', function(data)
{
    console.log('Awaiting input');
    var name = prompt('Welcome friend! What is your name?');

    // Usernames are optional, creeper
    if(name)
    {
        console.log('Awaiting response');
        socket.emit('name', {name: name});
    }
});

socket.on('error', function(data)
{
    alert('You done messed up: \n'+data.message)
});

socket.on('count', function(data)
{
    if(data.count == 1)
        $('h1').html(data.count+' user connected');
    else
        $('h1').html(data.count+' users connected');
});

socket.on('users', function(users)
{
    console.log('Connected');
    $('.users').html(users.list.join(' '));
});

socket.on('chat', function(chat)
{
    $('#ragnarok-chat-content .mCSB_container').append("<div class='"+chat.color+"'>"+chat.user+" : "+chat.message.fishformat()+"</div>");
    $('#ragnarok-chat-content').mCustomScrollbar("update"); //update scrollbar according to newly loaded content
    $('#ragnarok-chat-content').mCustomScrollbar("scrollTo",".mCSB_container div:last",{scrollInertia:100}); //scroll to appended content

   // setTimeout(function() { $('#ragnarok-chat-content').scrollTop($('#ragnarok-chat-content')[0].scrollHeight) }, 100);
});

$(document).ready(function()
{
    $('body').on('click', '#ragnarok-chat-content a', function()
    {
        $(this).attr('target', '_blank');
    });
                    
    $('#ragnarok-chat-text-input').keypress(function(event)
    {
        if(event.which == 13)
        {
            if($('#ragnarok-chat-text-input').val())
            {
                socket.emit('chat', {message: $('#ragnarok-chat-text-input').val()});
                $('#ragnarok-chat-text-input').val('');
            }
        }
    });    
});
