import React, { useRef, useState } from "react";
import InputItem from "../../UI/Input/InputItem";

import classes from "./AddItemForm.module.css";

const AddItemForm = props => {
    const amountInput = useRef();
    const [amountValid, setAmountValid] = useState(true);

    const submitHandler = event => {
        event.preventDefault();

        const enteredAmount = amountInput.current.value;
        const enteredAmountNumber = +enteredAmount;

        if(enteredAmount.trim().lenght === 0 || enteredAmountNumber < 1 || enteredAmountNumber > 5){
            setAmountValid(false);
            return;
        }
        props.onAddToCart(enteredAmountNumber);
    };

    return(
        <form className={classes.form} onSubmit={submitHandler}>
            <InputItem ref={amountInput} label="Amount" input={{id: "amount_" + props.id, type: "number", min: "1", max: "5", step: "1",
            defaultValue: "1"}}/>
            <button>+ Add</button>
            {!amountValid && <p>You must enter amount between 1 and 5!</p>}
        </form>
    );
};

export default AddItemForm;