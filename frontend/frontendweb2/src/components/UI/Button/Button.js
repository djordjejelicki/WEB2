import React from "react";

import classes from './Button.module.css';

const Button = props => {
    return(
        <button 
            id = {props.id || 'button'} 
            type={props.type || 'button'} 
            className={`${classes.button} ${props.className}`} 
            onClick={props.onClick} 
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );
};

export default Button;