import * as THREE from 'three';
import GooeyImage from './GooeyImage';
import gooeyFragmentShader from '../glsl/gooey-fragment.glsl';

const perspective = 800;

export default class Canvas {
    private canvas: HTMLCanvasElement;
    private imageWrappers: NodeListOf<HTMLElement>;
    private W: number;
    private H: number;
    private scene?: THREE.Scene;
    private renderer?: THREE.WebGLRenderer;
    private gooeyImages?: GooeyImage[];
    private camera?: THREE.PerspectiveCamera;
    constructor(canvasElement: HTMLCanvasElement) {
        this.canvas = canvasElement;
        this.imageWrappers = document.querySelectorAll<HTMLElement>('.gooey__image');

        this.W = window.innerWidth;
        this.H = window.innerHeight;

        this.start();

        this.bindEvent();
    }

    private bindEvent() {
        window.addEventListener('resize', () => {
            this.onResize();
        });
    }

    start() {
        this.scene = new THREE.Scene();
        this.initCamera();
        this.initLights();

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
        });
        this.renderer.setSize(this.W, this.H);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.gooeyImages = Array.from(this.imageWrappers).map((item) => {
            const gooeyImage = new GooeyImage(item, 0.5, gooeyFragmentShader);
            if (this.scene && gooeyImage.mesh) this.scene.add(gooeyImage.mesh);
            return gooeyImage;
        });

        this.update();
    }

    initCamera() {
        const fov = (180 * (2 * Math.atan(this.H / 2 / perspective))) / Math.PI;

        this.camera = new THREE.PerspectiveCamera(fov, this.W / this.H, 1, 10000);
        this.camera.position.set(0, 0, perspective);
    }

    initLights() {
        const ambientlight = new THREE.AmbientLight(0xffffff, 2);
        if (this.scene) this.scene.add(ambientlight);
    }

    /* Handlers
    --------------------------------------------------------- */

    onResize() {
        this.W = window.innerWidth;
        this.H = window.innerHeight;
        if (this.camera) {
            this.camera.aspect = this.W / this.H;
            this.camera.updateProjectionMatrix();
        }
        if (this.renderer) this.renderer.setSize(this.W, this.H);
    }

    /* Actions
    --------------------------------------------------------- */

    update() {
        requestAnimationFrame(this.update.bind(this));
        if (this.gooeyImages)
            this.gooeyImages.forEach((gooeyImage) => {
                gooeyImage.update();
            });
        if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera);
    }
}
