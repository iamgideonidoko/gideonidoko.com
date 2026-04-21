import { gsap } from 'gsap';
import { EventEmitter } from 'events';

export default class ButtonCtrl extends EventEmitter {
  private DOM: {
    el: HTMLElement;
  } & Partial<Record<'text' | 'textinner' | 'decoTop' | 'decoBottom', HTMLElement>>;
  private strength: number;
  private handleMouseMove: (event: MouseEvent) => void;
  private handleMouseLeave: () => void;
  private handleMouseEnter: () => void;

  constructor(el: HTMLElement) {
    super();

    this.DOM = { el };
    this.DOM.text = this.DOM.el.querySelector<HTMLElement>('.button__text')!;
    this.DOM.textinner = this.DOM.el.querySelector<HTMLElement>('.button__text-inner')!;
    this.DOM.decoTop = this.DOM.el.querySelector<HTMLElement>('.button__deco--1')!;
    this.DOM.decoBottom = this.DOM.el.querySelector<HTMLElement>('.button__deco--2')!;
    this.strength = 18;

    this.handleMouseMove = (event) => {
      const buttonBounds = this.DOM.el.getBoundingClientRect();
      const buttonCenterX = buttonBounds.left + buttonBounds.width / 2;
      const buttonCenterY = buttonBounds.top + buttonBounds.height / 2;

      const deltaX = buttonCenterX - event.clientX;
      const deltaY = buttonCenterY - event.clientY;
      const distance = Math.max(Math.sqrt(deltaX ** 2 + deltaY ** 2), 1);
      const force = this.strength / distance;

      const translateX = deltaX * force;
      const translateY = deltaY * force;

      if (this.DOM.decoBottom) {
        gsap.to(this.DOM.decoBottom, {
          x: -translateX,
          y: -translateY,
          ease: 'power2.out',
          duration: 0.3,
        });
      }

      if (this.DOM.decoTop) {
        gsap.to(this.DOM.decoTop, {
          x: -translateX * 0.7,
          y: -translateY * 0.6,
          ease: 'power2.out',
          duration: 0.3,
        });
      }
    };

    this.handleMouseLeave = () => {
      this.leave();

      if (this.DOM.decoBottom) {
        gsap.to(this.DOM.decoBottom, {
          x: 0,
          y: 0,
          ease: 'power2.out',
          duration: 0.3,
        });
      }

      if (this.DOM.decoTop) {
        gsap.to(this.DOM.decoTop, {
          x: 0,
          y: 0,
          ease: 'power2.out',
          duration: 0.3,
        });
      }
    };

    this.handleMouseEnter = () => {
      this.enter();
    };

    this.initEvents();
  }

  private initEvents() {
    this.DOM.el.addEventListener('mousemove', this.handleMouseMove);
    this.DOM.el.addEventListener('mouseleave', this.handleMouseLeave);
    this.DOM.el.addEventListener('mouseenter', this.handleMouseEnter);
  }

  private enter() {
    this.emit('enter');

    this.DOM.el.classList.add('scroll-button--hover');
    gsap.killTweensOf(this.DOM.textinner!);

    gsap
      .timeline()
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

    this.DOM.el.classList.remove('scroll-button--hover');
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

  public destroy() {
    this.DOM.el.removeEventListener('mousemove', this.handleMouseMove);
    this.DOM.el.removeEventListener('mouseleave', this.handleMouseLeave);
    this.DOM.el.removeEventListener('mouseenter', this.handleMouseEnter);
    this.removeAllListeners();
  }
}
