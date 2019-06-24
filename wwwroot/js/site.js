// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
(function () {
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
        console.log("Sending: "+message);
        connection.invoke("SendMessage", message).catch(function (err) {
            return console.error(err.toString());
        });
        document.getElementById("messageInput").value = '';

        //event.preventDefault();
    }

    connection.start().then(function(){
    }).catch(function (err) {
        return console.error(err.toString());
    });

    connection.on("ReceiveMessage", function (user, message, self) {
        var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        var ScrollBox = document.getElementById("messagesList");
        var newMessage = document.createElement('div');

        msg = "<h6 align='left'>" + msg + "</h>";
        console.log(self);
        if (self) {
            newMessage.className = ('list-group-item ml-auto text-right list-group-item-secondary');
            newMessage.style = ('display: inline-block; max-width: 60%; right:20px; border-radius: 25px;');
            newMessage.innerHTML = msg;
        } else {
            newMessage.className = ('list-group-item rounded-pill');
            newMessage.style = ('display: inline-block; max-width: 60%');
            newMessage.innerHTML = user+': '+msg;
        }

        document.getElementById("messagesList").appendChild(newMessage);
        
        ScrollBox.scrollTop = ScrollBox.scrollHeight;
    });
}());