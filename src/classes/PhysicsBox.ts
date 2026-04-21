import { Body, Bodies, Composite, Engine, Mouse, MouseConstraint, Render, Runner, World } from 'matter-js';
import { clamp, vwToPx } from '../helper';

export default class PhysicsBox {
  private debugMode = false;
  private box: HTMLElement;
  private items: NodeListOf<HTMLElement>;
  private itemRadius: number;
  private boxRect: DOMRect;
  private defaultBoxRect: DOMRect;
  private itemBodies: Body[];
  private engine: Engine;
  private mouseConstraint?: MouseConstraint;
  private runner?: Runner;
  private mouse?: Mouse;
  private render?: Render;
  private walls: Body[];
  private dragBody?: Body;
  private itemOptions: Record<'minRadius' | 'radius' | 'maxRadius', { value: number; unit: 'px' | 'vw' }>;
  private resizeHandler: () => void;
  private renderFrameId = 0;
  private itemPointerHandlers = new Map<HTMLElement, Record<'mousedown' | 'mouseup', () => void>>();

  constructor(
    target: HTMLElement,
    itemOptions: Record<'minRadius' | 'radius' | 'maxRadius', { value: number; unit: 'px' | 'vw' }>,
  ) {
    this.box = target;
    this.items = this.box.querySelectorAll<HTMLElement>('.physics--box__item');
    this.itemOptions = itemOptions;

    this.itemRadius = clamp(
      this.itemOptions.radius.unit === 'px' ? this.itemOptions.radius.value : vwToPx(this.itemOptions.radius.value),
      this.itemOptions.minRadius.unit === 'px'
        ? this.itemOptions.minRadius.value
        : vwToPx(this.itemOptions.minRadius.value),
      this.itemOptions.maxRadius.unit === 'px'
        ? this.itemOptions.maxRadius.value
        : vwToPx(this.itemOptions.maxRadius.value),
    );

    this.defaultBoxRect = this.box.getBoundingClientRect();
    this.calculateBoxHeight();
    this.boxRect = this.box.getBoundingClientRect();
    this.engine = Engine.create();
    this.resizeHandler = () => {
      this.onResize();
    };

    this.itemBodies = [...this.items].map((item) => {
      item.style.visibility = 'visible';

      const handleMouseDown = () => {
        item.style.cursor = 'grabbing';
      };
      const handleMouseUp = () => {
        item.style.cursor = 'grab';
      };

      item.addEventListener('mousedown', handleMouseDown);
      item.addEventListener('mouseup', handleMouseUp);
      this.itemPointerHandlers.set(item, {
        mousedown: handleMouseDown,
        mouseup: handleMouseUp,
      });

      return Bodies.circle(
        Math.random() * (this.boxRect.width * 0.8 - this.boxRect.width * 0.2) + this.boxRect.width * 0.2,
        this.boxRect.height * 0.5,
        this.itemRadius,
      );
    });

    this.walls = [
      Bodies.rectangle(this.boxRect.width / 2, 0, this.boxRect.width, 50, { isStatic: true }),
      Bodies.rectangle(this.boxRect.width / 2, this.boxRect.height, this.boxRect.width, 50, { isStatic: true }),
      Bodies.rectangle(this.boxRect.width, this.boxRect.height / 2, 50, this.boxRect.height, { isStatic: true }),
      Bodies.rectangle(0, this.boxRect.height / 2, 50, this.boxRect.height, { isStatic: true }),
    ];

    Composite.add(this.engine.world, [...this.walls, ...this.itemBodies]);
    this.bindEvent();

    if (this.debugMode) {
      this.initDebugOperation();
    } else {
      this.initOperation();
    }
  }

  private calculateBoxHeight() {
    return;
    const heightOffset = this.itemRadius * 2;
    const itemRows = Math.floor(this.defaultBoxRect.width / (this.itemRadius * 2));
    const itemColumns = Math.ceil(this.items.length / itemRows);
    const newBoxHeight = itemColumns * (this.itemRadius * 2) + heightOffset;
    this.box.style.height = `clamp(${newBoxHeight}px, 50vw, 100rem);`;
  }

  private bindEvent() {
    window.addEventListener('resize', this.resizeHandler);
  }

  private onResize() {
    this.calculateBoxHeight();
    this.boxRect = this.box.getBoundingClientRect();
    this.itemRadius = clamp(
      this.itemOptions.radius.unit === 'px' ? this.itemOptions.radius.value : vwToPx(this.itemOptions.radius.value),
      this.itemOptions.minRadius.unit === 'px'
        ? this.itemOptions.minRadius.value
        : vwToPx(this.itemOptions.minRadius.value),
      this.itemOptions.maxRadius.unit === 'px'
        ? this.itemOptions.maxRadius.value
        : vwToPx(this.itemOptions.maxRadius.value),
    );

    this.walls.forEach((wall, idx) => {
      switch (idx) {
        case 0:
          Body.setPosition(wall, { x: this.boxRect.width / 2, y: 0 });
          this.resizeWall(wall, 0, this.boxRect.width, 50);
          break;
        case 1:
          Body.setPosition(wall, { x: this.boxRect.width / 2, y: this.boxRect.height });
          this.resizeWall(wall, 1, this.boxRect.width, 50);
          break;
        case 2:
          Body.setPosition(wall, { x: this.boxRect.width, y: this.boxRect.height / 2 });
          break;
        case 3:
          Body.setPosition(wall, { x: 0, y: this.boxRect.height / 2 });
          break;
        default:
      }
    });

    this.itemBodies.forEach((body, idx) => {
      Body.setPosition(body, { x: this.boxRect.width / 2, y: this.boxRect.height * 0.1 });
      this.resizeItemBody(body, idx);
    });

    if (this.render) {
      this.render.bounds.max.x = this.boxRect.width;
      this.render.bounds.max.y = this.boxRect.height;
      this.render.options.width = this.boxRect.width;
      this.render.options.height = this.boxRect.height;
      this.render.canvas.width = this.boxRect.width;
      this.render.canvas.height = this.boxRect.height;
      Render.setPixelRatio(this.render, Math.min(window.devicePixelRatio, 2));
    }
  }

  private initOperation() {
    this.mouse = Mouse.create(this.box);
    this.mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: this.mouse,
    });
    Composite.add(this.engine.world, this.mouseConstraint);
    this.initRenderer();
  }

  private initRenderer() {
    this.items.forEach((item, idx) => {
      const body = this.itemBodies[idx];
      if (body) {
        item.style.position = 'absolute';
        item.style.top = `${body.position.y - item.getBoundingClientRect().width * 0.5}px`;
        item.style.left = `${body.position.x - item.getBoundingClientRect().width * 0.5}px`;
      }
    });

    Engine.update(this.engine);
    this.renderFrameId = window.requestAnimationFrame(() => this.initRenderer());
  }

  private initDebugOperation() {
    this.items.forEach((item) => {
      item.style.display = 'none';
    });

    this.render = Render.create({
      element: this.box,
      engine: this.engine,
      options: {
        width: this.boxRect.width,
        height: this.boxRect.height,
        showAngleIndicator: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
      },
    });

    Render.run(this.render);
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
    this.mouse = Mouse.create(this.render.canvas);
    this.mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: this.mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(this.engine.world, this.mouseConstraint);
    this.render.mouse = this.mouse;

    Render.lookAt(this.render, {
      min: { x: 0, y: 0 },
      max: { x: this.boxRect.width, y: this.boxRect.height },
    });
  }

  public destroy() {
    cancelAnimationFrame(this.renderFrameId);
    window.removeEventListener('resize', this.resizeHandler);

    this.itemPointerHandlers.forEach((handlers, item) => {
      item.removeEventListener('mousedown', handlers.mousedown);
      item.removeEventListener('mouseup', handlers.mouseup);
    });
    this.itemPointerHandlers.clear();

    if (this.mouseConstraint) {
      World.remove(this.engine.world, this.mouseConstraint);
    }

    if (this.runner) {
      Runner.stop(this.runner);
    }

    if (this.render) {
      Render.stop(this.render);
      const canvas = document.createElement('canvas');
      this.render.canvas.remove();
      this.render.canvas = canvas;
      this.render.context = canvas.getContext('2d')!;
      this.render.textures = {};
    }

    World.clear(this.engine.world, false);
    Engine.clear(this.engine);
  }

  private resizeWall(wall: Body, wallIndex: number, newWidth: number, newHeight: number) {
    World.remove(this.engine.world, wall);

    this.walls[wallIndex] = Bodies.rectangle(wall.position.x, wall.position.y, newWidth, newHeight, {
      isStatic: true,
    });

    World.add(this.engine.world, this.walls[wallIndex]);

    return this.walls[wallIndex];
  }

  private resizeItemBody(itemBody: Body, itemBodyIndex: number) {
    World.remove(this.engine.world, itemBody);

    this.itemBodies[itemBodyIndex] = Bodies.circle(
      Math.random() * (this.boxRect.width * 0.8 - this.boxRect.width * 0.2) + this.boxRect.width * 0.2,
      this.boxRect.height * 0.5,
      this.itemRadius,
    );

    World.add(this.engine.world, this.itemBodies[itemBodyIndex]);

    return this.itemBodies[itemBodyIndex];
  }
}
