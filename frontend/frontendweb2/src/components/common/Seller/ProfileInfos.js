import React, { Fragment, useContext, useEffect, useRef, useState } from "react";

import classes from "./ProfileInfos.module.css";
import AuthContext from "../../../contexts/auth-context";
import { toBeRequired } from "@testing-library/jest-dom/matchers";
import axios from "axios";
import Button from "../../UI/Button/Button";
import { useNavigate } from "react-router-dom";

const getImageType = (image) => {
    if (image.startsWith("/9j/")) {
      return "image/jpeg";
    } else if (image.startsWith("iVBORw0KGgo")) {
      return "image/png";
    } else if (image.startsWith("PHN2Zy")) {
      return "image/svg+xml";
    } else if (image.startsWith("R0lGODlh")) {
      return "image/gif";
    } else {
      return "";
    }
};

const ProfileInfos = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    const [formValid, setFormValid] = useState(false);
    const [firstnameValid, setFirstnameValid] = useState(true);
    const [lastnameValid, setLastnameValid] = useState(true);
    const [addressValid, setAddressValid] = useState(true);
    const [dateValid, setDateValid] = useState(true);

    const firstnameInput = useRef();
    const lastnameInput = useRef();
    const addressInput = useRef();
    const dateInput = useRef();
    
    const date = new Date(authCtx.user.BirthDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2,"0");
    const formattedDate = `${year}-${month}-${day}`;

    let role = "";

    if(authCtx.user.Role === 1){
        role = "Buyer";
    }
    else if(authCtx.user.Role === 2){
        role = "Seller";
    }
    else {
        role = "Admin";
    }


    var imageUrl = "";

    if(authCtx.user.Avatar != null){
        imageUrl = `data:${getImageType(authCtx.user.Avatar)};base64,${authCtx.user.Avatar}`;
    }

    useEffect(() => {
        const button = document.getElementById('save');
        button.disabled = false;
        button.textContent = 'Save';
    },[]);

    const regex = /^(?=.*[a-zA-Z])[a-zA-Z\s]+$/;
    
    const firstNameHandler = event =>{
        setFirstnameValid(regex.test(event.target.value));
        setFormValid(dateValid && addressValid && firstnameValid && lastnameValid);
    };
    
    const lastNameHandler = event => {
        setLastnameValid(regex.test(event.target.value));
        setFormValid(dateValid && addressValid && firstnameValid && lastnameValid);
    };
    
    const regexAddress = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/;

    const addressHandler = event => {
        setAddressValid(regexAddress.test(event.target.value));
        setFormValid(dateValid && addressValid && firstnameValid && lastnameValid);
    };

    const dateHandler = event => {
        const dateInput = new Date(event.target.value);
        
        const currentDate = new Date();
        const minDate = new Date();
        minDate.setFullYear(currentDate.getFullYear() - 18);

        const validDate = dateInput <= minDate;
        setDateValid(validDate);
        setFormValid(dateValid && addressValid && firstnameValid && lastnameValid);
    
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        const form = new FormData;
        if(formValid){
            const button = document.getElementById("save");
            button.textContent = "Saving";
            button.disabled = true;
            form.append("UserName", authCtx.user.UserName);
            form.append("FirstName", event.target.firstaname.value);
            form.append("LastName", event.target.lastname.value);
            form.append("Email",authCtx.user.Email);
            form.append("BirthDate",event.target.birthdate.value);
            form.append("Address",event.target.address.value);
            if(event.target.avatar.files.length > 0){
                form.append("file",event.target.avatar.files[0]);
            }

            try{
                const response = await axios.post(process.env.REACT_APP_SERVER_URL + "users/updateUser",form,
                {headers:{"Content-Type": "multipart/form-data"}});

                if(response.status === 200){
                    authCtx.user.FirstName = response.data.firstName;
                    authCtx.user.LastName = response.data.lastName;
                    authCtx.user.Address = response.data.address;
                    authCtx.user.BirthDate = response.data.birthDate;
                    authCtx.user.Avatar = response.data.avatar;
                    authCtx.onLogin(authCtx.user);
                    button.textContent = "Save"
                    button.disabled = false;
                    navigate('/profile');
                }
            }
            catch(error){
                alert(error.response.data.detail);
                button.textContent = "Save";
                button.disabled = false;
            }
        }
        else if(!firstnameValid){
            firstnameInput.current.focus();
        }
        else if(!lastnameValid){
            lastnameInput.current.focus();
        }
        else if(!dateValid){
            dateInput.current.focus();
        }
        else if(!addressValid){
            addressInput.current.focus();
        }
    };

    return(
        <Fragment>
            <form className={classes.summary} onSubmit={submitHandler}>
                <h2>Profile infos</h2>
                <br/>
                <p>UserName: <b>{authCtx.user.UserName}</b></p>
                <br/>
                <p>Email: <b>{authCtx.user.Email}</b></p>
                <br/>
                <p>Role: {role}</p>
                <br/>
                {authCtx.user.IsVerified ? (<p>Status: <b>VERIFIED</b></p>):(<p>Status: <b>UNVERIFIED</b></p>)}
                <img className={classes.profilePic} src={imageUrl} alt="Profile picture"/>
                <br/>
                <input className={classes.input} id="avatar" type="file" />
                <br/>
                <p>First name: <input ref={firstnameInput} id="firstname" type="text" className={classes.input} defaultValue={authCtx.user.FirstName} onChange={firstNameHandler}/></p>
                <br/>
                <p>Last name: <input ref={lastnameInput} id="lastname" type="text" className={classes.input} defaultValue={authCtx.user.LastName} onChange={lastNameHandler}/></p>
                <br/>
                <p>Address: <input ref={addressInput} id="address" type="text" className={classes.input} defaultValue={authCtx.user.Address} onChange={addressHandler}/></p>
                <br/>
                <p>Birth date: <input ref={dateInput} id="birthdate" type="date" className={classes.input} defaultValue={formattedDate} onChange={dateHandler}/></p>
                <center><Button type="submit" id="save">Save</Button></center>              
            </form>
        </Fragment>
    );
};

export default ProfileInfos;