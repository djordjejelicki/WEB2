using BLL.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Common;
using Shared.Constants;
using Shared.DTOs;

namespace BackendWEB2.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : Controller
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("allOrders")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAll()
        {
            ResponsePackage<IEnumerable<OrderDTO>> response = _orderService.GetAll();
            if (response.Status == ResponseStatus.OK)
                return Ok(response.Data);
            else
                return Problem(response.Message);
        }

        [HttpGet("myOrders")]
        public IActionResult GetBuyers(long id)
        {
            ResponsePackage<IEnumerable<OrderDTO>> response = _orderService.GetByUser(id);
            if (response.Status == ResponseStatus.OK)
                return Ok(response.Data);
            else
                return Problem(response.Message);
        }

        [HttpGet("orderHistory")]
        public IActionResult GetSellersHistory(long id)
        {
            ResponsePackage<IEnumerable<OrderDTO>> response = _orderService.GetHistory(id);
            if (response.Status == ResponseStatus.OK)
                return Ok(response.Data);
            else
                return Problem(response.Message);
        }

        [HttpGet("newOrders")]
        public IActionResult GetSellersNew(long id)
        {
            ResponsePackage<IEnumerable<OrderDTO>> response = _orderService.GetNew(id);
            if (response.Status == ResponseStatus.OK)
                return Ok(response.Data);
            else
                return Problem(response.Message);
        }


        [HttpPost("newOrder")]
        [Authorize(Roles = "Buyer")]
        public IActionResult NewOrder([FromBody] NewOrderDTO orderDTO)
        {
            ResponsePackage<bool> response = _orderService.AddOrder(orderDTO);
            if (response.Status == ResponseStatus.OK)
                return Ok(response.Message);
            else
                return Problem(response.Message);
        }

        [HttpPost("sendItem")]
        public IActionResult SendItem(long id)
        {
            ResponsePackage<bool> response = _orderService.UpdateOrder(id);
            if (response.Status == ResponseStatus.OK)
                return Ok(response.Message);
            else
                return Problem(response.Message);
        }
    }
}
