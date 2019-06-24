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

    function pad(n) {
       return n<10 ? '0'+n : n;
    }

    connection.on("ReceiveMessage", function (user, message, self) {
        var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        var ScrollBox = document.getElementById("messagesList");
        var newMessage = document.createElement('div');

        var currentDate = new Date();
        var date = currentDate.getDate();
        var month = currentDate.getMonth(); 
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var time = currentDate.getHours() + ":" + currentDate.getMinutes();

        var FullDate = monthNames[month] + " " + pad(date) + " " + time;


        msg = "<h6 align='left'>" + msg + "</h>";
        console.log(self);
        if (self) {
            newMessage.className = ('list-group-item ml-auto text-right list-group-item-secondary');
            newMessage.style = ('display: inline-block; max-width: 60%; right:20px; border-radius: 25px; margin-top:2px; margin-bottom:2px;');
            newMessage.innerHTML = msg;
        } else {
            newMessage.className = ('list-group-item');
            newMessage.style = ('display: inline-block; max-width: 60%; border-radius: 25px; margin-top:2px; margin-bottom:2px;');
            newMessage.innerHTML = '<h6 class="text-success">'+user+'  <small>'+FullDate+'</small>'+'</h6>'+msg;
        }

        document.getElementById("messagesList").appendChild(newMessage);
        
        ScrollBox.scrollTop = ScrollBox.scrollHeight;
    });
}());