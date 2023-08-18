import React, { Fragment } from "react";
import { ReactDOM } from "react";

import classes from './Modal.module.css';

const Backdrop = props => {
    return(<div className={classes.backdrop} onclick={props.onClose}></div>);
};

const ModalOverlay = props => {
    return(
        <div className={classes.modal}>
            <div className={classes.content}>{props.children}</div>
        </div>
    );
};

const portalElemnt = document.getElementById('overlays');

const Modal = (props) => {
    return (
        <Fragment>
            {ReactDOM.createPortal(<Backdrop onClose={props.onClose}/>, portalElemnt)}
            {ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>, portalElemnt)}
        </Fragment>
    );
}

export default Modal;