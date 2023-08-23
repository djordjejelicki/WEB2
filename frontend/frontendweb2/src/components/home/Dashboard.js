import React, { Fragment, useContext, useEffect } from "react";
import Card from '../UI/Card/Card';
import classes from './Dashboard.module.css';
import ItemContext from "../../contexts/item-context";
import DashBoardItem from "./DashBoardItem";

const Dashboard = () => {
    const itemCtx = useContext(ItemContext);

    useEffect(() => {itemCtx.onFetch()},[]);

    return(
        <Fragment>
            <section className={classes.summary}>
                <h2>All items</h2>
                {itemCtx.items.length > 0 ? (
                    <Card>
                        <section className={classes.items}>
                            <ul>
                                {itemCtx.items.map((item) => <DashBoardItem key={item.Id} id={item.Id} name={item.Name}
                                description = {item.description} price={item.Price} amount={item.Amount} picture={item.PictureUrl}/>)}
                            </ul>
                        </section>
                    </Card>
                ) : (<h2>There are currently no products on the market, try again later.</h2>)}
            </section>
        </Fragment>
    );
};

export default Dashboard;