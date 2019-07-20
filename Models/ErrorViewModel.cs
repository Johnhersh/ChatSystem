using System;
using Microsoft.AspNetCore.Mvc;

namespace ChatSystem_v3.Models
{
    [IgnoreAntiforgeryToken(Order = 1001)]

    public class ErrorViewModel
    {
        public string RequestId { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
    }
}