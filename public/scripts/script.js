$(function() {
  var socket = io();
  var nick = prompt("Enter your nickname please");
  nick = nick ? nick : "A dushbag";
  socket.emit('login', {nickname : nick});
  $('#messages li').first().append(nick + '!');

  $('form').submit(function() {
    var msg = $('#m').val();
    socket.emit('chat message', msg);
    var nickHtml = $("<b>").text(nick + ": ").html();
    $('#messages').append($('<li>').html(nickHtml + msg));
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msgObj){
    var nickHtml = $("<b>").text(msgObj.userdata.nickname + ": ").html();
    $('#messages').append($('<li>').html(nickHtml + msgObj.msg));
  });
  socket.on('notification', function(msg){
    var notificationStyle = {
      color: "#49a8ff",
      background: "#DDD"
    };
    $('#messages').append($('<li>').html($('<b>').append(msg)).css(notificationStyle));
  });
  socket.on('server message', function(msg){
    var notificationStyle = {
      color: "blue",
      background: "#DDD"
    };
    $('#messages').append($('<li>').html($('<b>').append(msg)).css(notificationStyle));
  });

  var typingText = {};
  var timeoutWaitMS = 2000;
  var typingPush;

  socket.on('typing', function(nick) {
    var nickExists = $("#typing .nicks .nick[id='"+nick+"']").size() == 1;
    if (!nickExists) {
      $("#typing").removeClass("hide").find(".nicks")
        .append($("<span class='nick' id='"+nick+"'>").text(nick));
    } else {
      clearTimeout(typingText[nick]);
      typingText[nick] = undefined;
    }
    if (!typingText[nick]) {
      typingText[nick] = setTimeout(function(){
        $("#typing").addClass("hide").find(".nicks .nick[id='"+nick+"']").remove();
        typingText[nick] = undefined;
      }, timeoutWaitMS);
    }
  })
  $("#m").keydown(function(e) {
    var c = String.fromCharCode(e.which)
    if (/[a-zA-Z0-9.!@?#"$%&:';()*\+\/;\-=[\\\]\^_{|}<>` ]/.test(c)) {
      if (!typingPush) {
        socket.emit('typing', nick);
        typingPush = setTimeout(function(){ typingPush = undefined; }, timeoutWaitMS);
      }
    }
  }).focus();
});
