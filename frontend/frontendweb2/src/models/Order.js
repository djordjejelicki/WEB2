import React from "react";
import OrderItem from "./OrderItem";

class Order {
    constructor(id){
        this.UserId=id;
        this.Items = [];
    }

    addOrderItem(id, amount){
        this.Items=[...this.Items, new OrderItem(id,amount)];
    }
}

export default Order;