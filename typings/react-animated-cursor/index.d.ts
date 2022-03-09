declare module 'react-animated-cursor' {
    export interface AnimatedCursorProps {
        color?: string;
        outerAlpha?: number;
        innerSize?: number;
        number?: number;
        innerScale?: number;
        outerScale?: number;
        trailingSpeed?: number;
        outerSize: number;
    }

    export default function AnimatedCursor(props: AnimatedCursorProps);
}
