using System;
namespace ChatSystem_v3.Models
{
    public class MsgDbClass
    {
        public long Id { get; set; }
        public string User { get; set; }
        public string Message { get; set; }
        public string Time { get; set; }
    }
}
