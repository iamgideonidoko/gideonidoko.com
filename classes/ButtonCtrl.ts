/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { gsap } from 'gsap';
import { EventEmitter } from 'events';
import { lerp, getMousePos, distance } from '../helper';

// body color
// const bodyColor = getComputedStyle(document.body).getPropertyValue('--color-bg');

// Track the mouse position
let mousepos = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (ev) => (mousepos = getMousePos(ev)));
}

export default class ButtonCtrl extends EventEmitter {
    private renderedStyles: Record<'tx' | 'ty' | 'tx2' | 'ty2', Record<'previous' | 'current' | 'amt', number>>;
    private state: {
        hover: boolean;
    };
    private DOM: {
        el: HTMLElement;
    } & Partial<Record<'text' | 'textinner' | 'decoTop' | 'decoBottom', HTMLElement>>;
    private rect?: DOMRect;
    private distanceToTrigger?: number;
    private onResize?: () => void;
    constructor(el: HTMLElement) {
        super();
        // DOM elements
        // el: main button
        // text: inner text element
        this.DOM = { el: el };
        this.DOM.text = this.DOM.el.querySelector<HTMLElement>('.button__text')!;
        this.DOM.textinner = this.DOM.el.querySelector<HTMLElement>('.button__text-inner')!;
        this.DOM.decoTop = this.DOM.el.querySelector<HTMLElement>('.button__deco--1')!;
        this.DOM.decoBottom = this.DOM.el.querySelector<HTMLElement>('.button__deco--2')!;
        // amounts the button will translate/scale
        this.renderedStyles = {
            tx: { previous: 0, current: 0, amt: 0.1 },
            ty: { previous: 0, current: 0, amt: 0.1 },
            tx2: { previous: 0, current: 0, amt: 0.05 },
            ty2: { previous: 0, current: 0, amt: 0.05 },
        };

        // button state (hover)
        this.state = {
            hover: false,
        };
        // calculate size/position
        this.calculateSizePosition();
        // init events
        this.initEvents();
        // loop fn
        requestAnimationFrame(() => this.render());
    }
    private calculateSizePosition() {
        // size/position
        this.rect = this.DOM.el.getBoundingClientRect();
        // the movement will take place when the distance from the mouse to the center of the button is lower than this value
        this.distanceToTrigger = this.rect.width * 1.5;
    }
    private initEvents() {
        this.onResize = () => this.calculateSizePosition();
        window.addEventListener('resize', this.onResize);
    }
    private render() {
        // calculate the distance from the mouse to the center of the button
        const distanceMouseButton = distance(
            mousepos.x + window.scrollX,
            mousepos.y + window.scrollY,
            this.rect!.left + this.rect!.width / 2,
            this.rect!.top + this.rect!.height / 2,
        );
        // new values for the translations and scale
        let x = 0;
        let y = 0;

        if (distanceMouseButton < this.distanceToTrigger!) {
            if (!this.state.hover) {
                this.enter();
            }
            x = (mousepos.x + window.scrollX - (this.rect!.left + this.rect!.width / 2)) * 0.3;
            y = (mousepos.y + window.scrollY - (this.rect!.top + this.rect!.height / 2)) * 0.3;
        } else if (this.state.hover) {
            this.leave();
        }

        this.renderedStyles['tx'].current = this.renderedStyles['tx2'].current = x;
        this.renderedStyles['ty'].current = this.renderedStyles['ty2'].current = y;

        for (const key in this.renderedStyles) {
            const newKey = key as keyof typeof this.renderedStyles;
            this.renderedStyles[newKey].previous = lerp(
                this.renderedStyles[newKey].previous,
                this.renderedStyles[newKey].current,
                this.renderedStyles[newKey].amt,
            );
        }

        this.DOM.decoTop!.style.transform = `translate3d(${this.renderedStyles['tx'].previous}px, ${this.renderedStyles['ty'].previous}px, 0)`;
        this.DOM.decoBottom!.style.transform = `translate3d(${this.renderedStyles['tx2'].previous}px, ${this.renderedStyles['ty2'].previous}px, 0)`;
        this.DOM.text!.style.transform = `translate3d(${this.renderedStyles['tx'].previous * 0.5}px, ${
            this.renderedStyles['ty'].previous * 0.5
        }px, 0)`;

        requestAnimationFrame(() => this.render());
    }
    private enter() {
        this.emit('enter');
        this.state.hover = true;

        this.DOM.el.classList.add('button--hover');
        gsap.killTweensOf(this.DOM.textinner!);

        gsap.timeline()
            // .to(document.body, 0.2, { backgroundColor: '#000' })
            .to(
                this.DOM.textinner!,
                0.1,
                {
                    ease: 'Power3.easeOut',
                    opacity: 0,
                    y: '-10%',
                },
                0,
            )
            .to(this.DOM.textinner!, 0.2, {
                ease: 'Expo.easeOut',
                opacity: 1,
                startAt: { y: '20%' },
                y: '0%',
            });
    }
    private leave() {
        this.emit('leave');
        this.state.hover = false;

        this.DOM.el.classList.remove('button--hover');
        gsap.killTweensOf(this.DOM.textinner!);

        gsap.timeline()
            // .to(document.body, { duration: 0.2, backgroundColor: bodyColor })
            .to(
                this.DOM.textinner!,
                {
                    duration: 0.1,
                    ease: 'Power3.easeOut',
                    opacity: 0,
                    y: '10%',
                },
                0,
            )
            .to(this.DOM.textinner!, {
                duration: 0.2,
                ease: 'Expo.easeOut',
                opacity: 1,
                startAt: { y: '-20%' },
                y: '0%',
            });
    }
}
