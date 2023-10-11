/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Engine, Composite, Runner, Body, Bodies, MouseConstraint, Mouse, Render, World } from 'matter-js';
import { vwToPx, clamp } from '../helper';

export default class PhysicsBox {
    private debugMode = false;
    private box: HTMLElement;
    private items: NodeListOf<HTMLElement>;
    private itemRadius: number;
    private boxRect: DOMRect;
    private itemBodies: Body[];
    private engine: Engine;
    private mouseConstraint?: MouseConstraint;
    private runner?: Runner;
    private mouse?: Mouse;
    private render?: Render;
    private walls: Body[];
    private dragBody?: Body;
    private itemOptions: Record<'minRadius' | 'radius' | 'maxRadius', { value: number; unit: 'px' | 'vw' }>;
    constructor(
        target: HTMLElement,
        itemOptions: Record<'minRadius' | 'radius' | 'maxRadius', { value: number; unit: 'px' | 'vw' }>,
    ) {
        this.box = target;
        this.items = this.box.querySelectorAll<HTMLElement>('.physics--box__item');
        this.itemOptions = itemOptions;

        this.itemRadius = clamp(
            this.itemOptions.radius.unit === 'px'
                ? this.itemOptions.radius.value
                : vwToPx(this.itemOptions.radius.value),
            this.itemOptions.minRadius.unit === 'px'
                ? this.itemOptions.minRadius.value
                : vwToPx(this.itemOptions.minRadius.value),
            this.itemOptions.maxRadius.unit === 'px'
                ? this.itemOptions.maxRadius.value
                : vwToPx(this.itemOptions.maxRadius.value),
        );

        this.boxRect = this.box.getBoundingClientRect();

        this.engine = Engine.create();

        this.itemBodies = [];

        this.itemBodies = [...this.items].map(() =>
            Bodies.circle(
                Math.random() * (this.boxRect.width * 0.8 - this.boxRect.width * 0.2) + this.boxRect.width * 0.2,
                // this.boxRect.width * 0.5,
                this.boxRect.height * 0.5,
                this.itemRadius,
            ),
        );

        console.log('itembodies: ', this.itemBodies);

        this.walls = [
            // TOP
            Bodies.rectangle(this.boxRect.width / 2, 0, this.boxRect.width, 50, { isStatic: true }),
            // DOWN
            Bodies.rectangle(this.boxRect.width / 2, this.boxRect.height, this.boxRect.width, 50, { isStatic: true }),
            // RIGHT
            Bodies.rectangle(this.boxRect.width, this.boxRect.height / 2, 50, this.boxRect.height, { isStatic: true }),
            // LEFT
            Bodies.rectangle(0, this.boxRect.height / 2, 50, this.boxRect.height, { isStatic: true }),
        ];

        Composite.add(this.engine.world, [
            // Walls
            ...this.walls,
            ...this.itemBodies,
        ]);

        // bind events
        this.bindEvent();

        this.debugMode ? this.initDebugOperation() : this.initOperation();
    }

    private bindEvent() {
        window.addEventListener('resize', () => {
            this.onResize();
        });

        // Events.on(this.engine, 'collisionStart', (event) => {
        //     const pairs = event.pairs;
        //     for (const pair of pairs) {
        //         // Check if bodyA is bodyA and bodyB is bodyB, or vice versa
        //         Body.setVelocity(pair.bodyA, { x: -pair.bodyA.velocity.x, y: pair.bodyA.velocity.y });
        //         Body.setVelocity(pair.bodyB, { x: -pair.bodyB.velocity.x, y: pair.bodyB.velocity.y });
        //     }
        // });
    }

    private onResize() {
        this.boxRect = this.box.getBoundingClientRect();
        this.itemRadius = clamp(
            this.itemOptions.radius.unit === 'px'
                ? this.itemOptions.radius.value
                : vwToPx(this.itemOptions.radius.value),
            this.itemOptions.minRadius.unit === 'px'
                ? this.itemOptions.minRadius.value
                : vwToPx(this.itemOptions.minRadius.value),
            this.itemOptions.maxRadius.unit === 'px'
                ? this.itemOptions.maxRadius.value
                : vwToPx(this.itemOptions.maxRadius.value),
        );

        // Update wall position
        this.walls.forEach((wall, idx) => {
            switch (idx) {
                case 0: // TOP
                    Body.setPosition(wall, { x: this.boxRect.width / 2, y: 0 });
                    this.resizeWall(wall, 0, this.boxRect.width, 50);
                    break;
                case 1: // DOWN
                    Body.setPosition(wall, { x: this.boxRect.width / 2, y: this.boxRect.height });
                    this.resizeWall(wall, 1, this.boxRect.width, 50);
                    break;
                case 2: // RIGHT
                    Body.setPosition(wall, { x: this.boxRect.width, y: this.boxRect.height / 2 });
                    break;
                case 3: // LEFT
                    Body.setPosition(wall, { x: 0, y: this.boxRect.height / 2 });
                    break;
                default:
            }
        });
        this.itemBodies.forEach((body, idx) => {
            Body.setPosition(body, { x: this.boxRect.width / 2, y: this.boxRect.height * 0.1 });
            this.resizeItemBody(body, idx);
        });
        // Do something upon resize
        if (this.render) {
            console.log('resizing...');
            this.render.bounds.max.x = this.boxRect.width;
            this.render.bounds.max.y = this.boxRect.height;
            this.render.options.width = this.boxRect.width;
            this.render.options.height = this.boxRect.height;
            this.render.canvas.width = this.boxRect.width;
            this.render.canvas.height = this.boxRect.height;
            Render.setPixelRatio(this.render, Math.min(window.devicePixelRatio, 2));
        }
    }

    /* Actions
    --------------------------------------------------------- */

    private initOperation() {
        this.mouse = Mouse.create(this.box);
        this.mouseConstraint = MouseConstraint.create(this.engine, {
            mouse: this.mouse,
            // constraint: {
            //     stiffness: 0.2,
            //     render: {
            //         visible: false,
            //     },
            // },
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
        // console.log('items: ', this);
        Engine.update(this.engine);
        window.requestAnimationFrame(this.initRenderer.bind(this));
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
        // Create runner;
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

        // Keep the mouse in sync with rendering
        this.render.mouse = this.mouse;
        // fit the render viewport to the scene
        Render.lookAt(this.render, {
            min: { x: 0, y: 0 },
            max: { x: this.boxRect.width, y: this.boxRect.height },
        });
    }

    public destroy() {
        if (this.render) {
            const canvas = document.createElement('canvas');
            this.render.canvas.remove();
            this.render.canvas = canvas;
            this.render.context = canvas.getContext('2d')!;
            this.render.textures = {};
        }
    }

    private resizeWall(wall: Body, wallIndex: number, newWidth: number, newHeight: number) {
        // Remove the old body from the world
        World.remove(this.engine.world, wall);

        // Create a new body with the desired dimensions
        this.walls[wallIndex] = Bodies.rectangle(wall.position.x, wall.position.y, newWidth, newHeight, {
            isStatic: true,
        });

        // Add the new body to the world
        World.add(this.engine.world, this.walls[wallIndex]);

        return this.walls[wallIndex];
    }

    private resizeItemBody(itemBody: Body, itemBodyIndex: number) {
        // Remove the old body from the world
        World.remove(this.engine.world, itemBody);

        // Create a new body with the desired dimensions
        // this.itemBodies[itemBodyIndex] = Bodies.circle(itemBody.position.x, itemBody.position.y, this.itemRadius);
        this.itemBodies[itemBodyIndex] = Bodies.circle(
            Math.random() * (this.boxRect.width * 0.8 - this.boxRect.width * 0.2) + this.boxRect.width * 0.2,
            this.boxRect.height * 0.5,
            this.itemRadius,
        );

        // Add the new body to the world
        World.add(this.engine.world, this.itemBodies[itemBodyIndex]);

        return this.itemBodies[itemBodyIndex];
    }
}
