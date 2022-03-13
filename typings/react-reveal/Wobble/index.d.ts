declare module 'react-reveal/Wobble' {
    export interface Wobble {
        duration?: number;
        delay?: number;
        left?: boolean;
        right?: boolean;
        top?: boolean;
        bottom?: boolean;
        count?: number;
        forever?: boolean;
        mirror?: boolean;
        distance?: string;
        spy?: boolean;
        when?: boolean;
        in?: boolean;
        appear?: boolean;
        enter?: boolean;
        exit?: boolean;
        timeout?: number;
        mountOnEnter?: boolean;
        unmountOnExit?: boolean;
        force?: boolean;
        refProp?: string;
        innerRef?: () => void;
        cascade?: boolean;
        collapse?: boolean;
        fraction?: number;
        ssrReveal?: boolean;
        wait?: number;
        count?: number;
        onReveal?: () => void;
        children: JSX.Element[] | JSX.Element;
    }
    export default function Wobble(props: Wobble);
}
