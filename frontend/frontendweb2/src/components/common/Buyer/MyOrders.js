import React, { Fragment, useContext, useEffect } from "react";

import classes from './MyOrders.module.css';
import OrderContext from "../../../contexts/order-context";
import {v4 as uuidv4} from "uuid";
import Card from "../../UI/Card/Card";
import OrderCard from "../OrderCard";

const MyOrders = () => {
    const orderCtx = useContext(OrderContext);

    useEffect(() => {orderCtx.onFetchBuyers();},[]);

    return(
        <Fragment>
            <section className={classes.summary}>
                <h2>ORDERS</h2>
                <section className={classes.users}>
                    {orderCtx.buyersOrders.lenght > 0 ? (
                        <Card>
                            <ul>
                                {orderCtx.buyersOrders.map((order) => (<OrderCard key={uuidv4()} id={order.id} items={order.orderItems}/>))}
                            </ul>
                        </Card>
                    ):(<h2>You don't have any orders yet!</h2>)}
                </section>
            </section>
        </Fragment>
    );
};

export default MyOrders;