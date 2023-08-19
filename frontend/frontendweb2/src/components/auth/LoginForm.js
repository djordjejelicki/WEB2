import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import AuthContext from "../../contexts/auth-context";
import classes from "./Form.module.css";
import axios from "axios";
import Modal from "../UI/Modal/Modal";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import {GoogleLogin} from "@react-oauth/google";
import User from "../../models/User";

const emailReducer = (state, action) => {

    if(action.type === 'USER_INPUT'){
        return { value: action.val, isValid: action.val.includes("@") };
    }
    
    if (action.type === "INPUT_BLUR"){
        return {value: state.value, isValid: state.value.includes("@") };
    }

    return {value: "", isValid: false}
};

const passwordReducer = (state, action) => {

    if(action.type === "USER_INPUT"){
        return {value: action.val, isValid: action.val.trim().lenght > 6};
    }

    if(action.type === "INPUT_BLUR"){
        return {value: state.value, isValid: state.value.trim().lenght > 6};
    }

    return {value: "", isValid: false};
};

const LoginForm = props => {

    const [formIsValid, setFormIsValid] = useState(false);

    const [emailState, distaptchEmail] = useReducer(emailReducer, {value: "", isValid: null});
    const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value: "", isValid: null});

    const authCtx = useContext(AuthContext);
    
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const {isValid: emailIsValid} = emailState;
    const {isValid:  passwordIsValid} = passwordState;

    useEffect(() => {

        const identifier = setTimeout(() => {setFormIsValid(emailIsValid && passwordIsValid)},500);

        return (() => {clearTimeout(identifier)});

    }, [emailIsValid, passwordIsValid]);

    useEffect(() => {

        const button = document.getElementById("Login");
        button.disabled = false;
        button.textContent = "Login";

    },[]);

    const emailChangeHandler = event => {
        distaptchEmail({type: "USER_INPUT", val: event.target.value});
    };

    const validateEmailHandler = () => {
        distaptchEmail({type: "INPUT_BLUR"});
    };

    const passwordChangeHandler = event => {
        dispatchPassword({type: "USER_INPUT", val: event.target.value});
    };

    const validatePasswordHandler = () => {
        dispatchPassword({type: "INPUT_BLUR"});
    };

    const submitHandler = async (event) => {

        event.preventDefault();
        const button = document.getElementById("login");
        button.textContent = "Logging in";
        button.disabled = true;
        if(formIsValid) {
            
            try{
                
                const response = await axios.post(process.env.REACT_APP_SERVER_URL + "users/login",{
                    Email: event.target.email.value,
                    Password: event.target.password.value
                });
                const user = new User(response.data);
                authCtx.onLogin(user);
                props.onClose();
            }
            catch (error) {
                
                alert(error.response.data.detail);
                button.textContent = "Login";
                button.disabled = false;
            }
        }
        else if(!emailIsValid){
            emailInputRef.current.focus();
        }
        else {
            passwordInputRef.current.focus();
        }

    };

    const responseMessage = async (response) => {

        const button = document.getElementById("login");
        button.textContent = "Logging in";
        button.disabled = true;

        await axios.post(
            process.env.REACT_APP_SERVER_URL + "users/googleLogin", JSON.stringify(response.credential),{
                headers: {"Content-Type": "application/json"}
            }
        ).then(function (apiResponse) {
            const user = new User(apiResponse.data);
            authCtx.onLogin(user);
            props.onClose();
        }).catch(function (error) {
            alert(error.response.data.detail);
            button.textContent = "Login";
            button.disabled = false;
        });
    };

    return (
        <Modal onClose={props.onClose} className={classes.login}>
            <form onSubmit={submitHandler}>
                <span>Login</span>
                <Input 
                    ref = {emailInputRef}
                    id = "email"
                    label = "Email"
                    type = "email"
                    isValid = {emailIsValid}
                    value = {emailState.value}
                    onChange = {emailChangeHandler}
                    onBlur = {validateEmailHandler}
                />
                 <Input 
                    ref = {passwordInputRef}
                    id = "password"
                    label = "Password"
                    type = "password"
                    isValid = {passwordIsValid}
                    value = {passwordState.value}
                    onChange = {passwordChangeHandler}
                    onBlur = {validatePasswordHandler}
                />
                <div className={classes.action}>
                    <Button type="submit" id="login">Login</Button>
                    <br/>
                    <center>
                        <GoogleLogin onSuccess={responseMessage}></GoogleLogin>
                    </center>
                </div> 
            </form>
        </Modal>
    );
};

export default LoginForm;