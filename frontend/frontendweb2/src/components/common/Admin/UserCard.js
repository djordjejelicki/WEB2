import React, { useContext } from "react";
import classes from './UserCard.module.css';
import AuthContext from "../../../contexts/auth-context";
import axios from "axios";

const getImageType = (image) => {
    if (image.startsWith('/9j/')) {
      return 'image/jpeg';
    } else if (image.startsWith('iVBORw0KGgo')) {
      return 'image/png';
    } else if (image.startsWith('PHN2Zy')) {
      return 'image/svg+xml';
    } else if (image.startsWith('R0lGODlh')) {
      return 'image/gif';
    } else {
      return '';
    }
};

const UserCard = props => {
    const authCtx = useContext(AuthContext);

    const date = new Date(props.BirthDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formatdate = `${day}/${month}/${year}`;

    const VerificationHandler = async (username) => {
        try{
            const respone = await axios.post(process.env.REACT_APP_SERVER_URL + 'users/verify',{UserName:username, isAccepted:true, Reason:""},
            {headers: {Authorization: `Bearer ${authCtx.user.Token}`}});

            if(respone.data){
                props.onVerify();
            }
        }
        catch(error){
            console.error(error);
        }
    };

    const DenyedHandler = async (username) => {};

    console.log(props);
    var imageUrl = '';

    if(props.Avatar != null){
        imageUrl = `data:${getImageType(props.Avatar)};base64,${props.Avatar}`;
    }

    return(
        <li className={classes.user}>
            <div>
                <h3>Username: {props.id}</h3>
                <div className={classes.description}>
                    Profile picture: <br/>
                    {props.Avatar && <img className={classes.profilePic} src={imageUrl} alt="Profile picture"/>}
                    First Name: {props.FirstName}<br/>
                    Last Name: {props.LastName}<br/>
                    Email: {props.Email}<br/>
                    Address: {props.Address}<br/>
                    Birth Date: {formatdate}<br/>
                </div>
            </div>
            <div className={classes.actions}>
                <button onClick={() => VerificationHandler(props.id)}>Verification</button>
                <button onClick={() => DenyedHandler(props.id)}>Denyed</button>
            </div>
        </li>
    );
};

export default UserCard;
