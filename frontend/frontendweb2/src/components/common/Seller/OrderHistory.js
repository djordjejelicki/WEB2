import React, { Fragment, useContext, useEffect } from "react";
import {v4 as uuidv4} from 'uuid';

import classes from "./OrderHistory.module.css";
import OrderContext from "../../../contexts/order-context";
import OrderCard from "../OrderCard";
import Card from "../../UI/Card/Card";

const OrderHistory = () => {
    const orderCtx = useContext(OrderContext);

    useEffect(() => {orderCtx.onFetchHistory();});

    return(
        <Fragment>
            <section className={classes.summary}>
                <h2>Orders from customers</h2>
                <section className={classes.users}>
                    {orderCtx.orderHistory.length > 0 ? (
                        <Card>
                            <ul>
                                {orderCtx.orderHistory.map((order) => (<OrderCard key={uuidv4()} id={order.id} items={order.orderItems}/>))}
                            </ul>
                        </Card>
                    ) : (<h2>you don't have a single order from a customer yet!</h2>)}
                </section>
            </section>
        </Fragment>
    );
};

export default OrderHistory;