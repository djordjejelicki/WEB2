using AutoMapper;
using BLL.Services.Interfaces;
using DAL.Model;
using DAL.Repository.IRepository;
using Shared.Common;
using Shared.Constants;
using Shared.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Implementations
{
    public class OrderService : IOrderService
    {
        public readonly IUnitOfWork _unitOfWork;
        public readonly IMapper _mapper;
        public OrderService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public ResponsePackage<bool> AddOrder(NewOrderDTO orderDTO)
        {
            Order order = new Order();
            order.UserId = orderDTO.UserId;
            order.OrderItems = new List<OrderItem>();
            foreach(NewOrderItemDTO oi in orderDTO.Items)
            {
                try
                {
                    Item i = _unitOfWork.Item.GetFirstOrDefault(i => i.Id == oi.Id);
                    if(i.Amount < oi.Amount)
                    {
                        throw new Exception("Not enough items");
                    }

                    order.OrderItems.Add(new OrderItem() { ItemId = i.Id, IsSent = false, SellerId = i.UserId, Amount = oi.Amount });
                    i.Amount -= oi.Amount;
                    if(i.Amount == 0)
                    {
                        _unitOfWork.Item.Delete(i);
                    }
                    else
                    {
                        _unitOfWork.Item.Update(i);
                    }
                }
                catch (Exception ex)
                {
                    return new ResponsePackage<bool>(false, ResponseStatus.InternalServerError, "There was an error while adding an order: " + ex.Message);
                }
            }

            try
            {
                _unitOfWork.Orders.Add(order);
                _unitOfWork.Save();
                return new ResponsePackage<bool>(true, ResponseStatus.OK, "Order successfully made");
            }
            catch(Exception ex)
            {
                return new ResponsePackage<bool>(false, ResponseStatus.InternalServerError, "There was an error while adding an order:" + ex.Message);
            }
        }

        public ResponsePackage<IEnumerable<OrderDTO>> GetAll()
        {
            var list = _unitOfWork.Orders.GetAll(includeProperties: "OrderItems");
            var retList = new List<OrderDTO>();
            foreach(var order in list)
            {
                OrderDTO retOrder = _mapper.Map<OrderDTO>(order);
                foreach(OrderItemDTO item in retOrder.OrderItems)
                {
                    Item i = _unitOfWork.Item.GetFirstOrDefault(i => i.Id == item.Id);
                    item.Item = _mapper.Map<ItemDTO>(i);
                    item.SellerId = i.UserId;
                }
                retOrder.Username = _unitOfWork.User.GetFirstOrDefault(u => u.Id == order.UserId).UserName;
                retList.Add(retOrder);
            }

            return new ResponsePackage<IEnumerable<OrderDTO>>(retList, ResponseStatus.OK, "All orders");
        }

        public ResponsePackage<IEnumerable<OrderDTO>> GetByUser(long UserId)
        {
            var list = _unitOfWork.Orders.GetAll(u => u.UserId == UserId, includeProperties: "OrderItems");
            var retList = new List<OrderDTO>();
            foreach (var order in list)
            {
                OrderDTO retOrder = _mapper.Map<OrderDTO>(order);
                foreach (OrderItemDTO item in retOrder.OrderItems)
                {
                    Item i = _unitOfWork.Item.GetFirstOrDefault(i => i.Id == item.Id);
                    item.Item = _mapper.Map<ItemDTO>(i);
                    item.SellerId = i.UserId;
                }
                retOrder.Username = _unitOfWork.User.GetFirstOrDefault(u => u.Id == order.UserId).UserName;
                retList.Add(retOrder);
            }

            return new ResponsePackage<IEnumerable<OrderDTO>>(retList, ResponseStatus.OK, "All orders for user" + UserId);
        }

        public ResponsePackage<IEnumerable<OrderDTO>> GetHistory(long UserId)
        {
            var list = _unitOfWork.Orders.GetHistory(UserId);
            var retList = new List<OrderDTO>();
            foreach (var order in list)
            {
                OrderDTO retOrder = _mapper.Map<OrderDTO>(order);
                foreach (OrderItemDTO item in retOrder.OrderItems)
                {
                    Item i = _unitOfWork.Item.GetFirstOrDefault(i => i.Id == item.Id);
                    item.Item = _mapper.Map<ItemDTO>(i);
                    item.SellerId = i.UserId;
                }
                retOrder.Username = _unitOfWork.User.GetFirstOrDefault(u => u.Id == order.UserId).UserName;
                retList.Add(retOrder);
            }

            return new ResponsePackage<IEnumerable<OrderDTO>>(retList, ResponseStatus.OK, "All previous orders for user" + UserId);
        }

        public ResponsePackage<IEnumerable<OrderDTO>> GetNew(long UserId)
        {
            var list = _unitOfWork.Orders.GetNew(UserId);
            var retList = new List<OrderDTO>();
            foreach (var order in list)
            {
                OrderDTO retOrder = _mapper.Map<OrderDTO>(order);
                foreach (OrderItemDTO item in retOrder.OrderItems)
                {
                    Item i = _unitOfWork.Item.GetFirstOrDefault(i => i.Id == item.Id);
                    item.Item = _mapper.Map<ItemDTO>(i);
                    item.SellerId = i.UserId;
                }
                retOrder.Username = _unitOfWork.User.GetFirstOrDefault(u => u.Id == order.UserId).UserName;
                retList.Add(retOrder);
            }

            return new ResponsePackage<IEnumerable<OrderDTO>>(retList, ResponseStatus.OK, "All new orders for user" + UserId);
        }

        public ResponsePackage<OrderDTO> GetOrder(long id)
        {
            throw new NotImplementedException();
        }

        public ResponsePackage<bool> UpdateOrder(long id)
        {
            List<Order> orders = _unitOfWork.Orders.GetAll(includeProperties: "OrderItems").ToList();
            foreach (Order order in orders)
            {
                foreach (OrderItem orderItem in order.OrderItems)
                {
                    if (orderItem.Id == id)
                    {
                        orderItem.IsSent = true;
                        _unitOfWork.Orders.Save();
                        return new ResponsePackage<bool>(true, ResponseStatus.OK, "Item sent");
                    }
                }
            }
            return new ResponsePackage<bool>(false, ResponseStatus.NotFound, "Item Not Found");
        }
    }
}
