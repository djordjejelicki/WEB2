import React, { useContext } from "react";
import CartContext from "../../contexts/cart-context";
import AuthContext from "../../contexts/auth-context";
import CartItem from "./CartItem";
import Order from "../../models/Order";
import Modal from "../UI/Modal/Modal";

import classes from "./Cart.module.css";
import axios from "axios";

const Cart = props => {
    
    const cartCtx = useContext(CartContext);
    const authCtx = useContext(AuthContext);

    const totalAmount = `$${ctx.totalAmount.toFixed(2)}`;
    const hasItems = ctx.items.length > 0;

    const cartItemRemoveHandler = id => {
        cartCtx.removeItem(id);
    };

    const cartItemAddHandler = item => {
        cartCtx.addItem({...item,amount:1});
    };

    const cartItems = (
        <ul className={classes["cart-items"]}>
            {ctx.items.map((item) => (
                <CartItem key={item.id} name={item.name} amount={item.amount} price={item.price}
                onRemove={cartItemRemoveHandler.bind(null,item.id)}
                onAdd={cartItemAddHandler.bind(null,item)}
                />
            ))}
        </ul>
    );

    const OrderHandler = async () => {

        const order = new Order(authCtx.user.Id);
        cartCtx.items.forEach((item) => {order.addOrderItem(item.id, item.amount)});

        try{

            const response = await axios.post(process.env.REACT_APP_SERVER_URL+'orders/newOrder', order, {
                headers: {Authorization: `Bearer ${authCtx.user.Token}`}
            });

            if(response.data){
                console.log(response.data);
            }

            cartCtx.removeAllItems();
            props.onClose();

        }catch (error){

            console.error(error);

        }
        
    }

    return (
        <Modal onClose={props.onClose}>
            {cartItems}
            <div className={classes.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            <div className={classes.acitons}>
                <button className={classes["button--alt"]} onClick={props.onClose}>Close</button>
                {hasItems && <button onClick={OrderHandler} className={classes.button}>Order</button>}
            </div>
        </Modal>
    );
};

export default Cart;