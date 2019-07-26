using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatSystem_v3.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SignalRChat.Hubs;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace ChatSystem_v3.Controllers
{
    public class UserItem
    {
        public string username { get; set; }
        public string password { get; set; }
    }

    public class Response
    {
        public bool LoginSuccess { get; set; }
    }

    [Route("api/[controller]")]
    [AllowAnonymous]
    [IgnoreAntiforgeryToken(Order = 1001)]
    public class MobileLogin : Controller
    {
        private readonly MsgDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public MobileLogin(UserManager<IdentityUser> userManager,
                           SignInManager<IdentityUser> signInManager,
                           MsgDbContext context)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _context = context;
        }

        public async Task<bool> OnPostAsync(UserItem NewUser)
        {
            var result = await _signInManager.PasswordSignInAsync(NewUser.username, NewUser.password, isPersistent: false, lockoutOnFailure: false);

            return result.Succeeded;
        }

        // GET: api/values
        [HttpGet]
        public List<MsgDbClass> Get()
        {
            var msgList = (from msg in _context.Messages
                           orderby msg.Id descending
                           select msg).Take(100);
            var result = msgList.ToList();

            result.Reverse();

            return result;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public async Task<string> PostAsync([FromBody] UserItem NewUser)
        {
            //return new string[] { userLogin.username, userLogin.password };
            //Console.WriteLine("***********************************");
            //Console.WriteLine("Found User: "+ NewUser.username);
            var result = new Response { LoginSuccess = false };

            if (await OnPostAsync(NewUser)){
                Console.WriteLine("***********************************");
                Console.WriteLine("Logged in: " + NewUser.username);
                result = new Response { LoginSuccess = true };
                //string output = JsonConvert.SerializeObject(result);
                return JsonConvert.SerializeObject(result);
            }
            return JsonConvert.SerializeObject(result);
            //return new string { "LoginSuccess", "false" };
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}