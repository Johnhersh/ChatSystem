using System;
using Microsoft.EntityFrameworkCore;

namespace ChatSystem_v3.Models
{
    public class MessageSaver
    {
        private readonly DbContext _context;

        public MessageSaver(DbContext context)
        {
            _context = context;
        }
    }
}
