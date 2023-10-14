import * as THREE from 'three';
import { gsap, Power2 } from 'gsap';
import vertexShader from '../glsl/vertex.glsl';
import gooeyFragmentShader from '../glsl/gooey-fragment.glsl';

import { getRatio } from '../helper';

type UniformType = 'f' | 'i' | 'v2' | 'v3' | 'v4' | 'm3' | 'm4' | 't' | 'sampler2D' | 'sampleCube';

type LenisScrollEvent = {
    animatedScroll: number;
    dimensions: Record<'height' | 'width' | 'scrollHeight' | 'scrollWidth', number>;
};

export default class GooeyImage {
    private elements: Record<'body' | 'el', HTMLElement>;
    private duration: number;
    private img: HTMLImageElement;
    private images: THREE.Texture[];
    private sizes: THREE.Vector2;
    private offset: THREE.Vector2;
    private vertexShader: string;
    private fragmentShader: string;
    private clock: THREE.Clock;
    private mouse: THREE.Vector2;
    private hasClicked: boolean;
    private loader: THREE.TextureLoader;
    private isMobile: boolean;
    private isHovering?: boolean;
    private uniforms?: {
        u_alpha: THREE.IUniform<number>;
        u_map: THREE.IUniform<THREE.Texture> & { type: UniformType };
        u_ratio: THREE.IUniform<THREE.Vector2>;
        u_hovermap: THREE.IUniform<THREE.Texture> & { type: UniformType };
        u_hoverratio: THREE.IUniform<THREE.Vector2>;
        u_shape: THREE.IUniform<THREE.Texture>;
        u_mouse: { value: THREE.Vector2 };
        u_progressHover: THREE.IUniform<number>;
        u_progressClick: THREE.IUniform<number>;
        u_time: THREE.IUniform<number>;
        u_res: THREE.IUniform<THREE.Vector2>;
    };
    public mesh?: THREE.Mesh;
    public geometry?: THREE.PlaneGeometry;
    public material?: THREE.ShaderMaterial;
    private onInitImageSuccess?: (mesh: THREE.Mesh) => void;
    private scroll: number;
    private prevScroll: number;
    private delta = 0;
    constructor(element: HTMLElement, duration: number, onInitImageSuccess: (mesh: THREE.Mesh) => void) {
        this.elements = {
            body: document.body,
            el: element,
        };

        this.duration = duration;
        const image = this.elements.el.querySelector('img');

        if (!image) throw new Error('No image element found');

        this.img = image;
        this.images = [];
        this.sizes = new THREE.Vector2(0, 0);
        this.offset = new THREE.Vector2(0, 0);

        this.vertexShader = vertexShader;
        this.fragmentShader = gooeyFragmentShader;

        this.clock = new THREE.Clock();

        this.mouse = new THREE.Vector2(0, 0);

        this.hasClicked = false;

        // this.isMobile = window.matchMedia('(max-width: 767px)').matches;
        this.isMobile = false;

        this.loader = new THREE.TextureLoader();
        if (this.img.src && this.img.dataset.hover) {
            this.preload([this.img.src, this.img.dataset.hover], () => {
                this.initImage();
            });
        }

        this.bindEvent();
        this.onInitImageSuccess = onInitImageSuccess;

        this.scroll = 0;
        this.prevScroll = 0;
    }

    private bindEvent() {
        window.addEventListener('resize', () => {
            this.onResize();
        });
        window.addEventListener('mousemove', (e) => {
            this.onMouseMove(e);
        });

        this.img.addEventListener('mouseenter', () => {
            this.onPointerEnter();
        });
        this.img.addEventListener('mouseleave', () => {
            this.onPointerLeave();
        });
        // this.elements.link.addEventListener('click', (e) => {
        //     this.onClick(e);
        // });

        if (window.lenis) {
            window.lenis.on('scroll', (e: LenisScrollEvent) => {
                this.onScroll({
                    offset: {
                        x: window.scrollX,
                        y: e.animatedScroll,
                    },
                    limit: {
                        x: e.dimensions.scrollWidth,
                        y: e.dimensions.scrollHeight,
                    },
                });
            });
        }
    }

    /* Handlers
    --------------------------------------------------------- */

    onClick(e: MouseEvent) {
        e.preventDefault();

        if (this.isMobile) return;

        if (!this.mesh) return;

        this.hasClicked = true;
    }

    onPointerEnter() {
        this.isHovering = true;

        if (this.hasClicked || this.isMobile) return;

        if (!this.mesh || !this.uniforms) return;

        gsap.to(this.uniforms.u_progressHover, {
            duration: this.duration,
            value: 0.7,
            ease: Power2.easeInOut,
        });
    }

    onPointerLeave() {
        if (!this.mesh || this.hasClicked || this.isMobile || !this.uniforms) return;

        gsap.to(this.uniforms.u_progressHover, {
            duration: this.duration,
            value: 0,
            ease: Power2.easeInOut,
            onComplete: () => {
                this.isHovering = false;
            },
        });
    }

    private onResize() {
        if (!this.mesh || !this.uniforms) return;
        this.getBounds();
        this.mesh.position.x = this.offset.x;
        this.mesh.position.y = this.offset.y;
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
        this.uniforms.u_res.value.set(window.innerWidth, window.innerHeight);
    }

    private onScroll({ offset, limit }: Record<'offset' | 'limit', Record<'x' | 'y', number>>) {
        // this.scroll = offset.x / limit.x;
        this.scroll = offset.y / limit.y;
    }

    private onMouseMove(event: MouseEvent) {
        if (this.hasClicked || this.isMobile) return;

        gsap.to(this.mouse, {
            duration: 0.5,
            x: event.clientX,
            y: event.clientY,
        });
    }

    /* Actions
    --------------------------------------------------------- */

    private initImage() {
        const texture = this.images[0];
        const hoverTexture = this.images[1];

        this.getBounds();

        this.uniforms = {
            u_alpha: { value: 1 },
            u_map: { type: 't', value: texture },
            u_ratio: { value: getRatio(this.sizes, texture.image) },
            u_hovermap: { type: 't', value: hoverTexture },
            u_hoverratio: { value: getRatio(this.sizes, hoverTexture.image) },
            u_shape: { value: this.images[2] },
            u_mouse: { value: this.mouse },
            u_progressHover: { value: 0 },
            u_progressClick: { value: 0 },
            u_time: { value: this.clock.getElapsedTime() },
            u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        };

        this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

        this.material = new THREE.ShaderMaterial({
            // wireframe: true,
            uniforms: this.uniforms,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            transparent: true,
            defines: {
                PI: Math.PI,
                PR: Math.min(window.devicePixelRatio, 1).toFixed(1),
            },
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.x = this.offset.x;
        this.mesh.position.y = this.offset.y;

        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

        this.img.classList.add('is-loaded');
        if (this.onInitImageSuccess) this.onInitImageSuccess(this.mesh);
    }

    private move() {
        if (!this.mesh || this.hasClicked) return;
        this.getBounds();

        gsap.set(this.mesh.position, {
            x: this.offset.x,
            y: this.offset.y,
        });

        gsap.to(this.mesh.scale, {
            duration: 0.3,
            // x: this.sizes.x - this.delta,
            // y: this.sizes.y - this.delta,
            x: this.sizes.x,
            y: this.sizes.y,
            z: 1,
        });
    }

    public update() {
        if (!this.mesh) return;

        this.delta = Math.abs((this.scroll - this.prevScroll) * 2000);

        this.move();

        this.prevScroll = this.scroll;

        if (!this.isHovering || !this.uniforms) return;
        this.uniforms.u_time.value += this.clock.getDelta();
    }

    /* Values
    --------------------------------------------------------- */

    private getBounds() {
        const { width, height, left, top } = this.img.getBoundingClientRect();
        if (!this.sizes.equals(new THREE.Vector2(width, height))) {
            this.sizes.set(width, height);
        }

        if (
            !this.offset.equals(
                new THREE.Vector2(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2),
            )
        ) {
            this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2);
        }
    }

    private preload(imageUrls: string[], allImagesLoadedCallback: () => void) {
        let loadedCounter = 0;
        const toBeLoadedNumber = imageUrls.length;
        const preloadImage = (url: string, anImageLoadedCallback: () => void) => {
            const image = this.loader.load(url, anImageLoadedCallback);
            image.center.set(0.5, 0.5);
            this.images.push(image);
        };

        imageUrls.forEach((url) => {
            preloadImage(url, () => {
                loadedCounter += 1;
                if (loadedCounter === toBeLoadedNumber) {
                    allImagesLoadedCallback();
                }
            });
        });
    }
}
