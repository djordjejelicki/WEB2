import React, { useState } from "react";
import axios from "axios";

import Item from '../models/Item';

const ItemContext = React.createContext({
    onFetch: ()=>{},
});

export const ItemContextProvider = props => {
    const [items,setItems] = useState([]);

    const FetchHandler = items => {
        axios.get(process.env.REACT_APP_SERVER_URL+'items/allItems').then(response => {
            console.log("nesto");
            if(response.data != null){
                setItems(response.data.map(element => new Item(element)));
            }
            else {
                setItems([]);
            }
        });
    }

    return(
        <ItemContext.Provider value={{items:items, onFetch: FetchHandler}}>
            {props.children}
        </ItemContext.Provider>
    );
}

export default ItemContext;