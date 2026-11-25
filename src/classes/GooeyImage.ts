import * as THREE from 'three';
import { gsap, Power2 } from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import vertexShader from '../glsl/vertex.glsl';
import gooeyFragmentShader from '../glsl/gooey-fragment.glsl';
import { getRatio } from '../helper';
import { pointer } from '../pointer';

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
  private textureDimensions?: { width: number; height: number };
  private offset: THREE.Vector2;
  private vertexShader: string;
  private fragmentShader: string;
  private timer: THREE.Timer;
  private mouse: THREE.Vector2;
  private hasPointerPosition = false;
  private hasClicked: boolean;
  private loader: THREE.TextureLoader;
  private isMobile: boolean;
  private isHovering?: boolean;
  private pointerInside = false;
  private uniforms?: {
    u_alpha: THREE.IUniform<number>;
    u_grayscaleHover: THREE.IUniform<number>;
    u_map: THREE.IUniform<THREE.Texture> & { type: UniformType };
    u_ratio: THREE.IUniform<THREE.Vector2>;
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
  private resizeHandler: () => void;
  private mouseMoveHandler: (event: MouseEvent) => void;
  private pointerEnterHandler: (event: MouseEvent) => void;
  private pointerLeaveHandler: () => void;
  private scrollHandler?: (event: LenisScrollEvent) => void;
  private destroyed = false;

  constructor(element: HTMLElement, duration: number, onInitImageSuccess: (mesh: THREE.Mesh) => void) {
    this.elements = {
      body: document.body,
      el: element,
    };

    this.duration = duration;
    const image = this.elements.el.querySelector('img');

    if (!image) {
      throw new Error('No image element found');
    }

    this.img = image;
    this.images = [];
    this.sizes = new THREE.Vector2(0, 0);
    this.offset = new THREE.Vector2(0, 0);
    this.vertexShader = vertexShader;
    this.fragmentShader = gooeyFragmentShader;
    this.timer = new THREE.Timer();
    this.timer.connect(document);
    this.mouse = new THREE.Vector2(0, 0);
    this.hasClicked = false;
    this.isMobile = false;
    this.loader = new THREE.TextureLoader();
    this.onInitImageSuccess = onInitImageSuccess;
    this.scroll = 0;
    this.prevScroll = 0;
    this.resizeHandler = () => {
      this.onResize();
    };
    this.mouseMoveHandler = (event) => {
      this.onMouseMove(event);
    };
    this.pointerEnterHandler = (event: MouseEvent) => {
      this.onMouseMove(event);
      this.onPointerEnter();
    };
    this.pointerLeaveHandler = () => {
      this.onPointerLeave();
    };

    if (this.img.src) {
      this.preload([this.img.src], () => {
        this.initImage();
      });
    }

    this.bindEvent();
  }

  private bindEvent() {
    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('mousemove', this.mouseMoveHandler);
    this.img.addEventListener('mouseenter', this.pointerEnterHandler);
    this.img.addEventListener('mouseleave', this.pointerLeaveHandler);

    if (window.appLenis) {
      this.scrollHandler = (event: LenisScrollEvent) => {
        this.onScroll({
          offset: {
            x: window.scrollX,
            y: ScrollTrigger.isTouch ? window.scrollY : event.animatedScroll,
          },
          limit: {
            x: ScrollTrigger.isTouch ? window.document.documentElement.scrollWidth : event.dimensions.scrollWidth,
            y: ScrollTrigger.isTouch ? window.document.documentElement.scrollHeight : event.dimensions.scrollHeight,
          },
        });
      };

      window.appLenis.on('scroll', this.scrollHandler);
    }
  }

  onClick(event: MouseEvent) {
    event.preventDefault();

    if (this.isMobile || !this.mesh) {
      return;
    }

    this.hasClicked = true;
  }

  private onPointerEnter() {
    this.pointerInside = true;
    this.isHovering = true;

    if (this.hasClicked || this.isMobile || !this.mesh || !this.uniforms) {
      return;
    }

    if (!this.hasPointerPosition) {
      const { left, top, width, height } = this.img.getBoundingClientRect();
      this.mouse.set(left + width / 2, top + height / 2);
    }

    gsap.to(this.uniforms.u_progressHover, {
      overwrite: true,
      duration: this.duration,
      value: 0.7,
      ease: Power2.easeInOut,
    });
  }

  private onPointerLeave() {
    this.pointerInside = false;
    if (!this.mesh || this.hasClicked || this.isMobile || !this.uniforms) {
      this.isHovering = false;
      return;
    }

    gsap.to(this.uniforms.u_progressHover, {
      overwrite: true,
      duration: this.duration,
      value: 0,
      ease: Power2.easeInOut,
      onComplete: () => {
        this.isHovering = false;
      },
    });
  }

  private onResize() {
    if (!this.mesh || !this.uniforms) {
      return;
    }

    this.getBounds();
    this.mesh.position.x = this.offset.x;
    this.mesh.position.y = this.offset.y;
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
    this.uniforms.u_res.value.set(window.innerWidth, window.innerHeight);
  }

  private onScroll({ offset, limit }: Record<'offset' | 'limit', Record<'x' | 'y', number>>) {
    this.scroll = limit.y === 0 ? 0 : offset.y / limit.y;
  }

  private onMouseMove(event: MouseEvent) {
    if (this.hasClicked || this.isMobile) {
      return;
    }

    if (!this.hasPointerPosition || !this.mesh) {
      this.mouse.set(event.clientX, event.clientY);
      this.hasPointerPosition = true;
      return;
    }

    gsap.to(this.mouse, {
      duration: 0.5,
      x: event.clientX,
      y: event.clientY,
    });
  }

  private initImage() {
    if (this.destroyed) {
      return;
    }

    const texture = this.images[0];
    const textureImage = texture.image;

    if (
      !textureImage ||
      typeof textureImage !== 'object' ||
      !('width' in textureImage) ||
      !('height' in textureImage)
    ) {
      return;
    }

    const textureDimensions = {
      width: Number(textureImage.width),
      height: Number(textureImage.height),
    };
    this.textureDimensions = textureDimensions;

    this.getBounds();

    this.uniforms = {
      u_alpha: { value: 1 },
      u_grayscaleHover: { value: this.img.dataset.grayscaleHover === 'true' ? 1 : 0 },
      u_map: { type: 't', value: texture },
      u_ratio: { value: getRatio(this.sizes, textureDimensions) },
      u_mouse: { value: this.mouse },
      u_progressHover: { value: 0 },
      u_progressClick: { value: 0 },
      u_time: { value: 0 },
      u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    };

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      transparent: true,
      defines: {
        PI: Math.PI,
        PR: Math.min(window.devicePixelRatio, 2).toFixed(1),
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.x = this.offset.x;
    this.mesh.position.y = this.offset.y;
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

    this.img.classList.add('is-loaded');
    this.onInitImageSuccess?.(this.mesh);

    if (this.isPointerOverImage()) {
      this.onPointerEnter();
    } else {
      this.pointerInside = false;
      this.isHovering = false;
    }
  }

  private move() {
    if (!this.mesh || this.hasClicked) {
      return;
    }

    this.getBounds();

    gsap.set(this.mesh.position, {
      x: this.offset.x,
      y: this.offset.y,
    });

    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
  }

  private isPointerOverImage() {
    if (!pointer.known) {
      return this.img.matches(':hover');
    }

    if (!this.hasPointerPosition) {
      this.mouse.set(pointer.x, pointer.y);
      this.hasPointerPosition = true;
    }

    const target = document.elementFromPoint(pointer.x, pointer.y);
    return target === this.img;
  }

  public update() {
    this.timer.update();

    if (!this.mesh) {
      return;
    }

    this.delta = Math.abs((this.scroll - this.prevScroll) * 2000);
    this.move();
    this.prevScroll = this.scroll;

    const hovered = this.isPointerOverImage();
    if (hovered !== this.pointerInside) {
      if (hovered) {
        this.onPointerEnter();
      } else {
        this.onPointerLeave();
      }
    }

    if (!this.isHovering || !this.uniforms) {
      return;
    }

    this.uniforms.u_time.value += this.timer.getDelta();
  }

  private getBounds() {
    const { width, height, left, top } = this.img.getBoundingClientRect();

    if (!this.sizes.equals(new THREE.Vector2(width, height))) {
      this.sizes.set(width, height);
      if (this.uniforms && this.textureDimensions && width > 0 && height > 0) {
        this.uniforms.u_ratio.value.copy(getRatio(this.sizes, this.textureDimensions));
      }
    }

    const nextOffset = new THREE.Vector2(
      left - window.innerWidth / 2 + width / 2,
      -top + window.innerHeight / 2 - height / 2,
    );
    if (!this.offset.equals(nextOffset)) {
      this.offset.copy(nextOffset);
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
        if (this.destroyed) {
          return;
        }

        loadedCounter += 1;
        if (loadedCounter === toBeLoadedNumber) {
          allImagesLoadedCallback();
        }
      });
    });
  }

  public destroy() {
    this.destroyed = true;
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('mousemove', this.mouseMoveHandler);
    this.img.removeEventListener('mouseenter', this.pointerEnterHandler);
    this.img.removeEventListener('mouseleave', this.pointerLeaveHandler);

    if (this.scrollHandler && window.appLenis) {
      window.appLenis.off('scroll', this.scrollHandler);
    }

    gsap.killTweensOf(this.mouse);
    if (this.uniforms) {
      gsap.killTweensOf(this.uniforms.u_progressHover);
    }

    this.images.forEach((image) => image.dispose());
    this.material?.dispose();
    this.geometry?.dispose();
    this.timer.dispose();
  }
}
