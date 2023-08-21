import React, { Fragment, useContext, useEffect, useState } from "react";
import {v4 as uuidv4} from 'uuid';
import classes from "./Verification.module.css";
import AuthContext from "../../../contexts/auth-context";
import axios from "axios";
import User from "../../../models/User";
import Card from "../../UI/Card/Card";
import UserCard from "./UserCard";

const Verification = () => {
    const authCtx = useContext(AuthContext);
    const [listOfUsers, setListOfUsers] = useState([]);

    useEffect(() => {fetchData()},[]);

    const fetchData = () => {
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/notVerified', {headers: {Authorization: `Bearer ${authCtx.user.Token}`}}).then(
               response => {
                    if(response.data != "All users are verified"){
                        setListOfUsers(response.data.map(element => new User(element)));
                    }
                    else {
                        setListOfUsers([]);
                    }
               }
        );
    };

    const ReloadHandler = () => {fetchData();};

    return(
        <Fragment>
            <section className={classes.summary}>
                <h2>NOT VERIFIED USERS</h2>
                <section className={classes.users}>
                    {listOfUsers.length > 0 ? (
                        <Card>
                            <ul>
                                {listOfUsers.map(user => 
                                <UserCard key={uuidv4()} id={user.UserName} 
                                                         FirstName={user.FirstName}
                                                         LastName={user.LastName}
                                                         Email={user.Email}
                                                         Address={user.Address}
                                                         BirthDate={user.BirthDate}
                                                         Avatar={user.Avatar}
                                                         onVerify={ReloadHandler}/>)
                                }
                            </ul>
                        </Card>
                    ):(<h2>ALL USERS ARE VERIFIED</h2>)}
                </section>
            </section>
        </Fragment>
    );
};

export default Verification;