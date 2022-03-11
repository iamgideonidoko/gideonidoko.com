import Head from 'next/head';
import { Fragment, useState } from 'react';
import moment from 'moment';
import swal from 'sweetalert';
import styles from '../../styles/Contacts.module.css';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Contacts = (props) => {
    const router = useRouter();
    const auth = useSelector(({ auth }: RootState) => auth);

    const [shownId, setShownId] = useState([]);

    function toggleMessage() {
        shownId.includes(this) ? setShownId(shownId.filter((id) => id != this)) : setShownId([...shownId, this]);
    }

    function handleContactDelete() {
        swal({
            title: 'Delete Contact?',
            text: `Delete contact from "${this.name}" ?`,
            icon: 'warning',
            buttons: {
                cancel: 'No',
                confirm: {
                    text: 'Yes, Delete',
                    className: 'deleteConfirmBtn',
                },
            },
        }).then((willDelete) => {
            if (willDelete) {
                props.deleteContact(this.id);
            }
        });
    }

    /*
	function to return dangerous markup
	*/
    const createMarkup = (markup) => {
        return { __html: markup };
    };

    return (
        <Fragment>
            <NextSeo noindex={true} nofollow={true} />
            <Head>
                <title>Contacts - Gideon Idoko</title>
            </Head>
            <main className={`padding-top-10rem`}>
                <div className="container-max-1248px">
                    {!auth.isAuthenticated ? (
                        <div>
                            <div className="loginRedirectMsg">
                                <h1>You are not logged in.</h1>
                                <p>Redirecting to login page...</p>
                                {typeof window !== 'undefined' &&
                                    window.setTimeout(() => {
                                        router.push('/login');
                                    }, 3000)}
                            </div>
                        </div>
                    ) : (
                        <Fragment>
                            {/*CONTACTS PAGE*/}
                            <div className={styles.contactsWrap}>
                                <h1 className={styles.pageTitle}>Your Contacts</h1>
                                <p>Below are all the contacts you've recieved from the contact page.</p>

                                <ul className={styles.contactList}>
                                    {props.contacts.map((contact) => (
                                        <li key={contact._id}>
                                            <div className={styles.contactHead}>
                                                <span>
                                                    {contact.name} ({contact.email}) [
                                                    <small>
                                                        {moment(contact.created_at).format('D/M/YYYY, h:m a')}
                                                    </small>
                                                    ]
                                                </span>
                                                <span>
                                                    <button
                                                        className={styles.toggleMessageBtn}
                                                        onClick={toggleMessage.bind(contact._id)}
                                                    >
                                                        <i
                                                            className={
                                                                shownId.includes(contact._id)
                                                                    ? 'neu-minus-circle'
                                                                    : 'neu-add-circle'
                                                            }
                                                        ></i>
                                                    </button>
                                                    <button
                                                        onClick={handleContactDelete.bind({
                                                            id: contact._id,
                                                            name: contact.name,
                                                        })}
                                                        className={styles.contactDeleteBtn}
                                                    >
                                                        <i className="neu-trash"></i>
                                                    </button>
                                                </span>
                                            </div>
                                            {shownId.includes(contact._id) && (
                                                <div className={styles.contactBody}>
                                                    <div
                                                        style={{ display: 'inline-block' }}
                                                        dangerouslySetInnerHTML={createMarkup(contact.message)}
                                                    />
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                {props.contacts.length === 0 && <div>No Contacts Found.</div>}
                            </div>
                        </Fragment>
                    )}
                </div>
            </main>
        </Fragment>
    );
};

export default Contacts;
