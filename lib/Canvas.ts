export default class Canvas {
    public canvas?: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D | null;
    public width: number = 0;
    public height: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setSize();
    }

    public setSize() {
        const canvas = this.canvas;

        if (canvas?.parentElement) {
            canvas.width = this.width = canvas.parentElement.clientWidth;
            canvas.height = this.height = canvas.parentElement.clientHeight;
        }
    }
}
