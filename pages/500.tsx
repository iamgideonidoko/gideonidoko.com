import React, { Fragment } from 'react';
import { NextSeo } from 'next-seo';

const Custom500 = () => {
    return (
        <Fragment>
            <NextSeo title="Server error 😔" noindex={true} nofollow={true} />
            <main className={`padding-top-10rem`}>
                <div className="container-max-1248px">
                    <div>
                        <h1>500 - Server error 😔. Kindly Reload or check back soon.</h1>
                    </div>
                </div>
            </main>
        </Fragment>
    );
};

export default Custom500;
