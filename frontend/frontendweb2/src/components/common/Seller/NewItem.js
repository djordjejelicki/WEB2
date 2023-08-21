import React, { Fragment, useContext } from "react";

import classes from "./NewItem.module.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../contexts/auth-context";
import axios from "axios";
import Button from "../../UI/Button/Button";

const NewItem = () => {
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    
    const submitHandler = async(event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('Name', event.target.name.value);
        formData.append('Price', event.target.price.value);
        formData.append('Amount', event.target.amount.value);
        formData.append('Description', event.target.description.value);
        formData.append('UserId', authCtx.user.Id);
        if(event.target.picture.files.length > 0){
            formData.append('file', event.target.picture.files[0]);
        }

        try{
            const response = await axios.post(process.env.REACT_APP_SERVER_URL + 'items/addNew', formData,
            {headers:{'Content-Type': 'multipart/form-data', Authorization: `Bearer ${authCtx.user.Token}`}});
            alert(response.data);
            navigate('/');
        }
        catch(error){
            console.error(error);
        }

    };

    return(
        <Fragment>
            <section className={classes.newItem}>
                <h2>FORM FOR ADDING NEW ITEM</h2>
                <form onSubmit={submitHandler}>
                    <div className={classes.control}>
                        <label>Name: </label>
                        <input type="text" name="name"/>
                    </div>
                    <div className={classes.control}>
                        <label>Price: </label>
                        <input type="number" step="0.01" name="price"/>
                    </div>
                    <div className={classes.control}>
                        <label>Available amount: </label>
                        <input type="number" step="1" name="amount"/>
                    </div>
                    <div className={classes.control}>
                        <label>Item Description: </label>
                        <input type="text" name="description"/>
                    </div>
                    <div className={classes.control}>
                        <label>Upload picture: </label>
                        <input type="file" name="picture"/>
                    </div>
                    <div className={classes.control}>
                        <Button type="submit">Add</Button>
                    </div>
                </form>
            </section>
        </Fragment>
    );
};

export default NewItem;
