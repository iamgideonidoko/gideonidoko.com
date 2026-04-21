import * as THREE from 'three';
import GooeyImage from './GooeyImage';

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
  private frameId = 0;
  private destroyed = false;
  private resizeHandler: () => void;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.imageWrappers = document.querySelectorAll<HTMLElement>('.gooey__image');
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.resizeHandler = () => {
      this.onResize();
    };

    this.start();
    this.bindEvent();
  }

  private bindEvent() {
    window.addEventListener('resize', this.resizeHandler);
  }

  private start() {
    this.scene = new THREE.Scene();
    this.initCamera();
    this.initLights();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
    });
    this.renderer.setSize(this.W, this.H);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.gooeyImages = Array.from(this.imageWrappers).map((item) => {
      return new GooeyImage(item, 0.5, (mesh) => {
        this.scene?.add(mesh);
      });
    });

    this.update();
  }

  private initCamera() {
    const fov = (180 * (2 * Math.atan(this.H / 2 / perspective))) / Math.PI;

    this.camera = new THREE.PerspectiveCamera(fov, this.W / this.H, 1, 10000);
    this.camera.position.set(0, 0, perspective);
    this.scene?.add(this.camera);
  }

  private initLights() {
    const ambientlight = new THREE.AmbientLight(0xffffff, 2);
    this.scene?.add(ambientlight);
  }

  private onResize() {
    this.W = window.innerWidth;
    this.H = window.innerHeight;

    if (this.camera) {
      this.scene?.remove(this.camera);
      this.initCamera();
    }

    if (this.renderer) {
      this.renderer.setSize(this.W, this.H);
    }
  }

  private update() {
    if (this.destroyed) {
      return;
    }

    this.frameId = requestAnimationFrame(() => this.update());

    this.gooeyImages?.forEach((gooeyImage) => {
      gooeyImage.update();
    });

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  public cleanUp() {
    this.destroyed = true;
    window.removeEventListener('resize', this.resizeHandler);
    cancelAnimationFrame(this.frameId);

    this.gooeyImages?.forEach((gooeyImage) => {
      gooeyImage.destroy();
      if (gooeyImage.mesh) {
        this.scene?.remove(gooeyImage.mesh);
      }
    });

    this.gooeyImages = [];
    this.renderer?.dispose();
    this.scene?.clear();
    this.camera = undefined;
    this.scene = undefined;
    this.renderer = undefined;
  }
}
