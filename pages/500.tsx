import React, { Fragment } from 'react';
import Head from 'next/head';
import { NextSeo } from 'next-seo';

const Custom500 = () => {
    return (
        <Fragment>
            <NextSeo noindex={true} nofollow={true} />
            <Head>
                <title>Server-side error occured : ( </title>
            </Head>
            <main className={`padding-top-10rem`}>
                <div className="container-max-1248px">
                    <div>
                        <h1>500 - Server-side error occured &nbsp;&nbsp;: (. Please Reload.</h1>
                    </div>
                </div>
            </main>
        </Fragment>
    );
};

export default Custom500;
