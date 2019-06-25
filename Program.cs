using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ChatSystem_v3.Controllers;
using ChatSystem_v3.Models;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ChatSystem_v3
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseUrls("http://*:5000");
    }
}

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        private readonly MsgDbContext _context;

        public ChatHub(MsgDbContext context)
        {
            _context = context;
        }

        public async Task SendMessage(string message)
        {
            MsgDbClass NewMessage = new MsgDbClass();

            string username = Context.User.Identity.Name;
            await Clients.Others.SendAsync("ReceiveMessage", username, message, false);
            await Clients.Caller.SendAsync("ReceiveMessage", username, message, true);

            NewMessage.User = username;
            NewMessage.Message = message;
            NewMessage.Time = DateTime.Now.ToString();

            _context.Messages.Add(NewMessage);

            try
            {
                _context.SaveChanges();
            }
            catch (Exception)
            {
                Console.WriteLine("Something went wrong with saving a message!");
            }
        }

        //public async Task GetOldMessages()
        public async Task GetOldMessages()
        {
            //Console.WriteLine("Getting Old Message");
            string username = Context.User.Identity.Name;
            var msgList = (from msg in _context.Messages
                          orderby msg.Id descending
                          select msg).Take(20);
            var result = msgList.ToList();

            Console.WriteLine("***********************************");
            Console.WriteLine("Entering For Loop: "+ result.Count());
            //foreach (MsgDbClass msg in msgList)
            for (var i=result.Count()-1; i>0; i--)
            {
                Console.WriteLine("***********************************");
                Console.WriteLine("Found Message: " + result[i].Message);

            if (result[i].User == username)
                    await Clients.Caller.SendAsync("ReceiveMessage", username, result[i].Message, true);
                else await Clients.Caller.SendAsync("ReceiveMessage", result[i].User, result[i].Message, false);

            }
        }
    }
}