import { Fragment } from 'react';
// import { config } from '../config/keys';
// import SimpleReactValidator from 'simple-react-validator';
import styles from '../styles/Contact.module.css';
import { NextSeo } from 'next-seo';
// import { encode } from 'html-entities';
// import swal from 'sweetalert';
// import { noAuthPost } from '../helper';

const Contact = ({}) => {
  // // internal state
  // const [name, setName] = useState<string>('');
  // const [email, setEmail] = useState<string>('');
  // const [message, setMessage] = useState<string>('');
  // const [, forceUpdate] = useState<number>();
  // const [isSending, setIsSending] = useState<boolean>(false);

  // //instantiate the validator as a singleton
  // const simpleValidator = useRef(
  //     new SimpleReactValidator({
  //         element: (message: string) => <div className={'formErrorMsg'}>{message}</div>,
  //     }),
  // );

  // const handleContactFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();

  //     if (simpleValidator.current.allValid()) {
  //         //all input is valid

  //         try {
  //             const willSend = await swal({
  //                 title: 'Send message?',
  //                 text: `${name}, do you really want to send this message?`,
  //                 icon: 'warning',
  //                 buttons: {
  //                     cancel: true,
  //                     confirm: {
  //                         text: 'Yes, Send',
  //                         className: 'uploadConfirmBtn',
  //                     },
  //                 },
  //             });
  //             if (willSend) {
  //                 try {
  //                     const newContact = {
  //                         name,
  //                         email,
  //                         message: encode(message),
  //                         contactPostAccessKey: config.contactPostAccessKey,
  //                     };
  //                     setIsSending(true);
  //                     await noAuthPost(`/contact`, newContact);
  //                     setIsSending(false);
  //                     swal({
  //                         title: '',
  //                         text: `Your message has been successfully sent.`,
  //                         icon: 'success',
  //                         buttons: [false, false],
  //                     });
  //                     try {
  //                         const mail = {
  //                             subject: `A message was sent via your contact form.`,
  //                             text: `${name} (${email}) sent you a message via your contact form. The message: ${message}. Log in here to check it out: ${
  //                                 typeof window !== 'undefined' && `${window.location.host}/login`
  //                             }`,
  //                             html: `<p><b>${name} (${email})</b> sent you a message via your contact form.</p> <br /> <p>The message: ${message}</p> <br /> <p>Log in here to check it out: ${
  //                                 typeof window !== 'undefined' &&
  //                                 `http${window.location.host === 'localhost' ? '' : 's'}://${
  //                                     window.location.host
  //                                 }/login`
  //                             }</p>`,
  //                         };
  //                         await noAuthPost(`/mail`, mail);
  //                     } catch (err) {}
  //                     setName('');
  //                     setEmail('');
  //                     setMessage('');
  //                 } catch (err) {
  //                     console.error('Contact send error => ', err);
  //                 }
  //             }
  //         } catch (err) {}
  //     } else {
  //         //input not valid, so show error
  //         simpleValidator.current.showMessages(); //show all errors if exist
  //         forceUpdate(1); //force update component to display error
  //     }
  // };

  // const handleInputChange: React.ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     switch (e.target.name) {
  //         case 'name':
  //             setName(e.target.value);
  //             break;
  //         case 'email':
  //             setEmail(e.target.value);
  //             break;
  //         case 'message':
  //             setMessage(e.target.value);
  //             break;
  //     }
  // };

  return (
    <Fragment>
      <NextSeo
        title="Contact me - Gideon Idoko"
        description="Have you got a question, proposal or project in mind? Does your project need a fix? Do you want to collaborate with me on something? Feel free to reach out."
        canonical="https://gideonidoko.com/contact"
        openGraph={{
          url: 'https://gideonidoko.com/contact',
          title: 'Contact me - Gideon Idoko',
          description:
            'Have you got a question, proposal or project in mind? Does your project need a fix? Do you want to collaborate with me on something? Feel free to reach out.',
          images: [
            {
              url: 'https://gideonidoko.com/assets/img/GideonIdokoCardImage.png',
              width: 1500,
              height: 500,
              alt: "Gideon Idoko's card image",
            },
          ],
          site_name: 'Gideon Idoko',
        }}
        twitter={{
          handle: '@IamGideonIdoko',
          site: '@IamGideonIdoko',
          cardType: 'summary_large_image',
        }}
      />
      <main className={`padding-top-10rem ${styles.contactMain}`}>
        <div className="container-full">
          <h1>Contact me</h1>
          <div className={`${styles.scrollText}`}>
            SCROLL <i className="neu-down-lg"></i> DOWN
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default Contact;
