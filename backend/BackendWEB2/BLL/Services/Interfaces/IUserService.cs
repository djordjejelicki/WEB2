using Shared.Common;
using Shared.DTOs;
using Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services.Interfaces
{
    public interface IUserService
    {
        ResponsePackage<bool> RegisterAdmin(UserDTO userDTO);
        Task<ResponsePackage<bool>> RegisterUser(UserDTO userDTO, SD.Roles Role, string file);
        Task<ResponsePackage<bool>> GoogleRegister(string accessToken, SD.Roles Role);
        ResponsePackage<ProfileDTO> LoginUser(LoginDTO loginDTO);
        Task<ResponsePackage<ProfileDTO>> GoogleLogin(string accessToken);
        Task<ResponsePackage<bool>> VerifyUser(VerificationDTO verificationDTO);
        Task<ResponsePackage<bool>> DenyUser(VerificationDTO verificationDTO);
        ResponsePackage<bool> ResetPassword(PasswordResetDTO passwordResetDTO);
        ResponsePackage<ProfileDTO> GetProfile(string email);
        ResponsePackage<ProfileDTO> UpdateProfile(UserDTO userDTO, string file);
        ResponsePackage<List<ProfileDTO>> GetVerified();
    }
}
