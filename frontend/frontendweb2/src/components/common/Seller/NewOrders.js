import React, { Fragment, useContext, useEffect } from "react";
import {v4 as uuidv4} from 'uuid';

import classes from './NewOrders.module.css';
import AuthContext from "../../../contexts/auth-context";
import OrderContext from "../../../contexts/order-context";
import { useNavigate } from "react-router-dom";
import Card from "../../UI/Card/Card";
import OrderCard from "../OrderCard";

const NewOrders = () => {
    const authCtx = useContext(AuthContext);
    const orderCtx = useContext(OrderContext);
    const navigate = useNavigate();

    useEffect(() => {orderCtx.onFetchNew();},[]);

    const postHandler = event => {
        try{
            const response = axios.post(process.env.REACT_APP_SERVER_URL + 'orders/sendItem?id='+event.target.id,
            {headers: {Authorization: `Bearer ${authCtx.user.Token}`}});

            if(response.data){
                navigate('/');
            }
        }
        catch(error){
            alert(error);
        }
    };

    return (
        <Fragment>
            <section className={classes.summary}>
                <h2>NEW ORDERS FROM CUSTOMERS</h2>
                <section className={classes.users}>
                    {orderCtx.newOrders.length > 0 ? (
                        <Card>
                            <ul>
                                {orderCtx.newOrders.map((order) => (
                                <>
                                    <OrderCard key={uuidv4()} id={order.id} Items={order.orderItems}/>
                                    <button id={order.id} onClick={postHandler}>Send</button>    
                                </>
                                ))}
                            </ul>
                        </Card>
                    ) : (<h2>You don't have new orders, try later</h2>)}
                </section>
            </section>
        </Fragment>
    );

};

export default NewOrders; 