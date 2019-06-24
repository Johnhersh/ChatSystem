using System;
using Microsoft.EntityFrameworkCore;

namespace ChatSystem_v3.Models
{
    public class MsgDbContext : DbContext
    {
        public MsgDbContext(DbContextOptions<MsgDbContext> options) : base(options) { }
        public DbSet<MsgDbClass> Messages { get; set; }

    }
}