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
    public class ItemService : IItemService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ItemService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public ResponsePackage<bool> AddItem(NewItemDTO itemDTO, string filePath)
        {
            Item item = _mapper.Map<Item>(itemDTO);
            item.PictureUrl = filePath;

            try
            {
                _unitOfWork.Item.Add(item);
                _unitOfWork.Save();
                return new ResponsePackage<bool>(true, ResponseStatus.OK, "Item added successfully");
            }
            catch (Exception ex)
            {
                return new ResponsePackage<bool>(false, ResponseStatus.InternalServerError, "There was an error while adding an item: " + ex.Message);
            }
        }

        public ResponsePackage<bool> DeleteItem(int id)
        {
           Item item = _unitOfWork.Item.GetFirstOrDefault(u => u.Id == id);
            _unitOfWork.Item.Delete(item);
            _unitOfWork.Save();
            return new ResponsePackage<bool>(true, ResponseStatus.OK, "Item deleted");
        }

        public ResponsePackage<IEnumerable<ItemDTO>> GetAll(string? includeProperties = null)
        {
            var list = _unitOfWork.Item.GetAll(includeProperties: includeProperties);
            var retList = new List<ItemDTO>();
            foreach(var item in list)
            {
                ItemDTO retItem = _mapper.Map<ItemDTO>(item);
                byte[] imageBytes = File.ReadAllBytes(item.PictureUrl);
                retItem.PictureUrl = Convert.ToBase64String(imageBytes);
                retList.Add(retItem);
            }

            return new ResponsePackage<IEnumerable<ItemDTO>>(retList, ResponseStatus.OK, "All items");
        }

        public ResponsePackage<IEnumerable<ItemDTO>> GetByUser(int UserId, string? includeProperties = null)
        {
            var list = _unitOfWork.Item.GetAll(u => u.UserId == UserId, includeProperties: includeProperties);
            var retList = new List<ItemDTO>();
            foreach(var item in list)
            {
                retList.Add(_mapper.Map<ItemDTO>(item));
            }

            return new ResponsePackage<IEnumerable<ItemDTO>>(retList, ResponseStatus.OK, "All items from user");
        }

        public ResponsePackage<ItemDTO> GetItem(int id, string? includeProperties = null)
        {
            Item item = _unitOfWork.Item.GetFirstOrDefault(x => x.Id == id, includeProperties: "Images,FollowedItems");

            if(item == null)
            {
                return new ResponsePackage<ItemDTO>(null, ResponseStatus.NotFound, "Item not found");
            }
            else
            {
                ItemDTO retItem = _mapper.Map<ItemDTO>(item);
                return new ResponsePackage<ItemDTO>(retItem, ResponseStatus.OK,"Item found");
            }
        }

        public ResponsePackage<bool> UpdateItem(ItemDTO itemDTO)
        {
            Item item = _unitOfWork.Item.GetFirstOrDefault(u => u.Id == itemDTO.Id);
            item = _mapper.Map<Item>(itemDTO);
            _unitOfWork.Item.Update(item);
            _unitOfWork.Save();
            return new ResponsePackage<bool>(true, ResponseStatus.OK, "Item updated");
        }
    }
}
