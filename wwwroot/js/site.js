// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(function () {
    var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build(); // This is to open the SignalR connection

    document.getElementById("sendButton").addEventListener("click", function (event) {
        SendMessage();
    });

    $('#messageInput').keydown(function (event) {
        var keypressed = event.keyCode || event.which;
        if (keypressed == 13) {
            SendMessage();
        }
    });

    function SendMessage() {
        var message = document.getElementById("messageInput").value;
        if (message.length == 0) return;
        //console.log("Sending: "+message);
        connection.invoke("SendMessage", message).catch(function (err) {
            return console.error(err.toString());
        });
        document.getElementById("messageInput").value = '';
    }

    connection.onclose(e => {
        console.log("Closed connection, trying to reconnect");
        setTimeout(function() {
            connection.start().then(function () {
                console.log("Reconnecting");
                doOnConnect();
            })
        }, 5000); // Restart connection after 5 seconds.
    });

    connection.start().then(function () {
        doOnConnect();
    }).catch(function (err) {
        return console.error(err.toString());
    });


    function doOnConnect() {
        connection.invoke("GetOldMessages");
    }

    //var chatHub = $.connection.chatHub;



    /*connection.on("OnReconnected", function () {
        console.log("Doing Reconnecting");
    });

    connection.on("OnDisconnected", function () {
        console.log("SignalR Disconnected");
    });
    
    connection.chatHub.reconnecting(function() {
        console.log("Doing Reconnecting");
    });

    connection.chatHub.reconnected(function() {
        console.log("All Reconnected");
    });
    
    connection.chatHub.disconnected(function() {
        console.log("On Disconnected");
    });*/

    connection.on("ReceiveMessage", function (user, message, timestamp, self) {
        var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        var ScrollBox = document.getElementById("messagesList");
        var newMessage = document.createElement('div');

        msg = "<h6 align='left'>" + msg + "</h>";
        //console.log(self);
        if (self == true) {
            newMessage.className = ('list-group-item ml-auto text-right list-group-item-secondary');
            newMessage.id = "selfMessage";
            newMessage.innerHTML = msg;
        } else {
            newMessage.className = ('list-group-item');
            newMessage.id = "message";
            //console.log(timestamp);
            newMessage.innerHTML = '<h6 class="text-success">'+user+'  <small>'+timestamp+'</small>'+'</h6>'+msg;
        }

        document.getElementById("messagesList").appendChild(newMessage);
        
        ScrollBox.scrollTop = ScrollBox.scrollHeight;
    });
}());