declare module 'rodal' {
    export interface RodalProps {
        width?: number;
        height?: number;
        measure?: string;
        onClose?: () => void;
        onAnimationEnd?: () => void;
        visible?: boolean;
        showMask?: boolean;
        closeOnEsc?: boolean;
        closeMaskOnClick?: boolean;
        showCloseButton?: boolean;
        animation?: string;
        enterAnimation?: string;
        leaveAnimation?: string;
        duration?: number;
        className?: string;
        customStyles?: object;
        customMaskStyles?: object;
        id?: string;
        children: JSX.Element[] | JSX.Element;
    }

    export default function Rodal(props: RodalProps);
}
