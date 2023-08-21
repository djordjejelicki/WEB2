import React, { Fragment, useContext, useEffect } from "react";

import classes from './AllOrders.module.css';
import OrderContext from "../../../contexts/order-context";
import Card from "../../UI/Card/Card";
import OrderCard from "../OrderCard";
import {v4 as uuidv4} from "uuid";

const AllOrders = () => {
    const orderCtx = useContext(OrderContext);

    useEffect(() => {orderCtx.onFetchAll();}, []);

    return(
        <Fragment>
            <section className={classes.users}>
                {orderCtx.allOrders.length > 0 ? (
                    <Card>
                        <ul>
                            {orderCtx.allOrders.map(order => 
                                <OrderCard  key={uuidv4()}
                                            id={order.id}
                                            buyer={order.username}
                                            items={order.orderItems}/>)
                            }
                        </ul>
                    </Card>
                ) : (<h2>There are no orders yet!</h2>)}
            </section>
        </Fragment>
    );
};

export default AllOrders;