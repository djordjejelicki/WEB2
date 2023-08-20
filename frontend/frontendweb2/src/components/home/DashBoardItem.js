import React, { useContext } from "react";

import classes from "./DashBoardItem.module.css";
import AuthContext from "../../contexts/auth-context";
import CartContext from "../../contexts/cart-context";
import AddItemForm from "../common/Buyer/AddItemForm";

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

const DashBoardItem = props => {
    const authCtx = useContext(AuthContext);
    const cartCtx = useContext(CartContext);

    const addToCartHandler = amount => {
      cartCtx.addItem({id: props.id, name: props.name, amount: amount, price: props.price});  
    };

    var imgUrl = '';
    if(props.picture != null){
        imgUrl = `data:${getImageType(props.picture)};base64,${props.picture}`;
    }

    return(
        <li className={classes.item}>
            <div>
                <h3>{props.name}</h3>
                <img className={classes.picture} src={imgUrl} alt="Item"/>
                <div className={classes.description}>{props.description}</div>
                <div className={classes.price}>{props.price}$</div>
            </div>
            <div>
                {authCtx.user.Role === 1 && (<AddItemForm onAddToCart={addToCartHandler}>Add to Cart</AddItemForm>)}
                <div className={classes.amount}>
                    {props.amount > 0 ? (<>Available: {props.amount}</>) : (<b>Not Available</b>)}
                </div>
            </div>
        </li>
    );
};

export default DashBoardItem;