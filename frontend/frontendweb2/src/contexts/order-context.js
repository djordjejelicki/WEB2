import React, { useContext, useState } from "react";
import axios from 'axios';
import AuthContext from "./auth-context";

const OrderContext = React.createContext({
    onFetchAll: () => {},
    onFetchNew: () => {},
    onFetchHistory: () => {},
    onFetchBuyers: () => {},
});

export const OrderContextProvider = props => {
    const [allOrders, setAllOrders] = useState([]);
    const [buyersOrders, setBuyersOrders] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
    const [newOrders, setNewOrders] = useState([]);
    const ctx = useContext(AuthContext);

    const fetchAllHandler = () => {
        axios.get(process.env.REACT_APP_SERVER_URL+'orders/allOrders',{
            headers: {Authorization: `Bearer ${ctx.user.Token}`}
        }).then(response => {
            if(response.data != null){
                setAllOrders(response.data);
            }
            else{
                setAllOrders([]);
            }
        });
    }

    const fetchNewHandler = () => {
        axios.get(process.env.REACT_APP_SERVER_URL+'orders/newOrders?id=' + ctx.user.Id, {
            headers: {Authorization: `Bearer ${ctx.user.Token}`}
        }).then(response => {
            if(response.data != null){
                setNewOrders(response.data);
            }
            else{
                setNewOrders([]);
            }
        });
    }

    const fetchHistoryHandler = () => {
        axios.get(process.env.REACT_APP_SERVER_URL+'orders/newHistory?id=' + ctx.user.Id, {
            headers: {Authorization: `Bearer ${ctx.user.Token}`}
        }).then(response => {
            if(response.data != null){
                setOrderHistory(response.data);
            }
            else{
                setOrderHistory([]);
            }
        });
    }

    const fetchBuyersHandler = () => {
        axios.get(process.env.REACT_APP_SERVER_URL+'orders/myOrders?id=' + ctx.user.Id, {
            headers: {Authorization: `Bearer ${ctx.user.Token}`}
        }).then(response => {
            if(response.data != null){
                setBuyersOrders(response.data);
            }
            else{
                setBuyersOrders([]);
            }
        });
    }

    return (
        <OrderContext.Provider
            value={{allOrders: allOrders,
                    buyersOrders: buyersOrders,
                    orderHistory: orderHistory,
                    newOrders: newOrders,
                    onFetchAll: fetchAllHandler,
                    onFetchNew: fetchNewHandler,
                    onFetchHistory: fetchHistoryHandler,
                    onFetchBuyers: fetchBuyersHandler}}
        >
            {props.children}
        </OrderContext.Provider>
    );
}

export default OrderContext;