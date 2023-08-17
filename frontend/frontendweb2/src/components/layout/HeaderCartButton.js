import React, { useContext, useEffect, useState } from "react";
import CartContext from "../../contexts/cart-context";
import CartIcon from "../../components/cart/CartIcon";
import classes from './HeaderCartButton.module.css';


const HeaderCartButton = props => {
    const ctx = useContext(CartContext)
    const {items} = ctx;
    
    const numOfItems = items.reduce((currNumber,item)=>{
        return currNumber+item.amount;
    }, 0);

    const [btnIsHighlighted, setBtnIsHighlighted] = useState(false);

    const btnClasses = `${classes.button} ${btnIsHighlighted ? classes.bump : ''}`;

    useEffect(() => {
        
        if(items.length === 0){
            return;
        }

        setBtnIsHighlighted(true);

        const timer = setTimeout(() => {setBtnIsHighlighted(false)}, 300);

        return () => {clearTimeout(timer)};
    },[items]);

    return(
        <button className={btnClasses} onClick={props.onClick}>
            <span className={classes.icon}>
                <CartIcon/>
            </span>
            <span>Cart</span>
            <span className={classes.badge}>{numOfItems}</span>
        </button>
    );

}

export default HeaderCartButton;