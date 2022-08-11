import { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import swal from 'sweetalert';
import styles from '../../styles/Contacts.module.css';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { authDelete, authGet } from '../../helper';
import { PaginatedContacts } from '../../interfaces/contact.interface';

const Contacts = ({}) => {
    const router = useRouter();
    const auth = useSelector(({ auth }: RootState) => auth);

    const [shownId, setShownId] = useState<string[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [contactsLoading, setContactsLoading] = useState<boolean>(false);
    const [contacts, setContacts] = useState<PaginatedContacts | null>(null);

    const fetchContacts = async (pageNo: number) => {
        try {
            setContactsLoading(true);
            const res = await authGet(`/contacts?page=${pageNo}&per_page=10`);
            setContactsLoading(false);
            setContacts(res?.data?.contacts || null);
        } catch (err) {
            console.error('Contacts fetch error => ', err);
        }
    };

    useEffect(() => {
        setLoaded(true);
        fetchContacts(1);
    }, []);

    function toggleMessage(postId: string) {
        shownId.includes(postId) ? setShownId(shownId.filter((id) => id != postId)) : setShownId([...shownId, postId]);
    }

    async function handleContactDelete({ id, name }: { id: string; name: string }) {
        try {
            const willDelete = await swal({
                title: 'Delete Contact?',
                text: `Delete contact from "${name}" ?`,
                icon: 'warning',
                buttons: {
                    cancel: true,
                    confirm: {
                        text: 'Yes, Delete',
                        className: 'deleteConfirmBtn',
                    },
                },
            });
            if (willDelete) {
                try {
                    await authDelete(`/contact/${id}`);
                    await swal({
                        title: '',
                        text: `Post successfully deleted.`,
                        icon: 'success',
                        buttons: [false, false],
                    });
                    fetchContacts(1);
                } catch (err) {
                    console.error('Contact deletion error => ', err);
                }
            }
        } catch (err) {}
    }

    /*
	function to return dangerous markup
	*/
    const createMarkup = (markup: string) => {
        return { __html: markup };
    };

    return (
        <Fragment>
            <NextSeo title="Contacts - Gideon Idoko" noindex={true} nofollow={true} />
            {loaded && (
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
                                    <p>Below are all the contacts you&apos;ve recieved from the contact page.</p>

                                    <ul className={styles.contactList}>
                                        {contacts?.docs?.map((contact) => (
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
                                                            onClick={() => toggleMessage(contact._id)}
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
                                                            onClick={() =>
                                                                handleContactDelete({
                                                                    id: contact._id,
                                                                    name: contact.name,
                                                                })
                                                            }
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
                                    {contacts ? (
                                        <div className={styles.paginationWrapper}>
                                            <p className={styles.pageStats}>
                                                Page {contacts?.page} of {contacts?.totalPages}{' '}
                                                {contactsLoading && <>(Loading...)</>}
                                            </p>
                                            <div className={styles.pagination}>
                                                <span>
                                                    {contacts?.hasPrevPage && (
                                                        <button
                                                            onClick={() => fetchContacts(Number(contacts?.page) - 1)}
                                                        >
                                                            ← Previous Page
                                                        </button>
                                                    )}
                                                </span>
                                                <span>
                                                    {contacts?.hasNextPage && (
                                                        <button
                                                            onClick={() => fetchContacts(Number(contacts?.page) + 1)}
                                                        >
                                                            Next Page →
                                                        </button>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>Loading...</div>
                                    )}
                                    {contacts?.docs?.length === 0 && <div>No Contacts Found.</div>}
                                </div>
                            </Fragment>
                        )}
                    </div>
                </main>
            )}
        </Fragment>
    );
};

export default Contacts;
