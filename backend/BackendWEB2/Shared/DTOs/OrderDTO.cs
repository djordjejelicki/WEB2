﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOs
{
    public class OrderDTO
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public List<OrderItemDTO> Items { get; set; }
    }
}
