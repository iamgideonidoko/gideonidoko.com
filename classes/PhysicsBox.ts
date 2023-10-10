// import { Engine, Composite, Runner } from 'matter-js';

export default class PhysicsBox {
    private box: HTMLDivElement;
    private boxItems: NodeListOf<HTMLDivElement>;
    private itemWidth: number;
    private itemHeight: number;
    private itemType: 'circle' | 'square';
    private boxRect: DOMRect;
    constructor(
        target: HTMLDivElement,
        itemOptions: Record<'width' | 'height', number> & { type: 'circle' | 'square' },
    ) {
        this.box = target;
        this.boxItems = this.box.querySelectorAll<HTMLDivElement>('div.physics--box__item');
        if (itemOptions.type !== 'square') throw new Error('Only square type implementation is available right now');

        this.itemWidth = itemOptions.width;
        this.itemHeight = itemOptions.height;
        this.itemType = itemOptions.type;

        this.boxRect = this.box.getBoundingClientRect();

        // bind events
        this.bindEvent();
    }

    private bindEvent() {
        window.addEventListener('resize', () => {
            this.onResize();
        });
    }

    private onResize() {
        // Do something upon resize
    }

    /* Actions
    --------------------------------------------------------- */

    private initOperation() {
        //
    }

    public update() {
        // Update physics world
    }
}
