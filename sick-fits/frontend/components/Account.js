import React from "react";
import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import AccountStyles from './styles/AccountStyles';
import Head from 'next/head';

const Account = (props) => (
    <Query query={CURRENT_USER_QUERY}>
        {({data, loading}) => {
            if (loading) return <p>Loading...</p>
            if (!data.me) {
                return (
                    <div>
                        <p>Please sign in before continuing</p>
                        <Signin />
                    </div>
                );
            }
            return (
                <AccountStyles>
                    <Head>
                        <title>Your Account</title>
                    </Head>
                    <p>
                        <span>Name</span>
                        <span>{data.me.name}</span>
                    </p>
                    <p>
                        <span>E-mail</span>
                        <span>{data.me.email}</span>
                    </p>
                </AccountStyles>
            );
        }}
    </Query>
);

export default Account;