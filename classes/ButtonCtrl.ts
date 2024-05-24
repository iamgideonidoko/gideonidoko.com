/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { gsap } from 'gsap';
import { EventEmitter } from 'events';

export default class ButtonCtrl extends EventEmitter {
  private DOM: {
    el: HTMLElement;
  } & Partial<Record<'text' | 'textinner' | 'decoTop' | 'decoBottom', HTMLElement>>;
  private strength: number;

  constructor(el: HTMLElement) {
    super();
    // DOM elements
    this.DOM = { el: el };
    this.DOM.text = this.DOM.el.querySelector<HTMLElement>('.button__text')!;
    this.DOM.textinner = this.DOM.el.querySelector<HTMLElement>('.button__text-inner')!;
    this.DOM.decoTop = this.DOM.el.querySelector<HTMLElement>('.button__deco--1')!;
    this.DOM.decoBottom = this.DOM.el.querySelector<HTMLElement>('.button__deco--2')!;
    // Magnetic strength
    this.strength = 18;
    // init events
    this.initEvents();
  }
  private initEvents() {
    this.DOM.el.addEventListener('mousemove', (e) => {
      const buttonBounds = this.DOM.el.getBoundingClientRect();
      const buttonCenterX = buttonBounds.left + buttonBounds.width / 2;
      const buttonCenterY = buttonBounds.top + buttonBounds.height / 2;

      const deltaX = buttonCenterX - e.clientX;
      const deltaY = buttonCenterY - e.clientY;

      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      const force = this.strength / distance;

      const translateX = deltaX * force;
      const translateY = deltaY * force;

      if (this.DOM.decoBottom) {
        gsap.to(this.DOM.decoBottom, {
          x: -translateX,
          y: -translateY,
          ease: 'power2.out', // Adjust the easing function
          duration: 0.3, // Adjust the duration
        });
      }

      if (this.DOM.decoTop) {
        gsap.to(this.DOM.decoTop, {
          x: -translateX * 0.7,
          y: -translateY * 0.6,
          ease: 'power2.out', // Adjust the easing function
          duration: 0.3, // Adjust the duration
        });
      }
    });

    this.DOM.el.addEventListener('mouseleave', () => {
      this.leave();
      if (this.DOM.decoBottom) {
        gsap.to(this.DOM.decoBottom, {
          x: 0,
          y: 0,
          ease: 'power2.out', // Adjust the easing function
          duration: 0.3, // Adjust the duration
        });
      }
      if (this.DOM.decoTop) {
        gsap.to(this.DOM.decoTop, {
          x: 0,
          y: 0,
          ease: 'power2.out', // Adjust the easing function
          duration: 0.3, // Adjust the duration
        });
      }
    });

    this.DOM.el.addEventListener('mouseenter', () => {
      this.enter();
    });
  }

  private enter() {
    this.emit('enter');

    this.DOM.el.classList.add('button--hover');
    gsap.killTweensOf(this.DOM.textinner!);

    gsap
      .timeline()
      // .to(document.body, 0.2, { backgroundColor: '#000' })
      .to(
        this.DOM.textinner!,
        {
          duration: 0.1,
          ease: 'Power3.easeOut',
          opacity: 0,
          y: '-10%',
        },
        0,
      )
      .to(this.DOM.textinner!, {
        duration: 0.2,
        ease: 'Expo.easeOut',
        opacity: 1,
        startAt: { y: '20%' },
        y: '0%',
      });
  }
  private leave() {
    this.emit('leave');

    this.DOM.el.classList.remove('button--hover');
    gsap.killTweensOf(this.DOM.textinner!);

    gsap
      .timeline()
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
