const { Application, Assets, Sprite, SCALE_MODES } = PIXI;

(async () => {
    const app = new Application();
    await app.init({ antialias: true, background: '#000000', resizeTo: window }); 
    document.body.appendChild(app.canvas);

    const stageHeight = app.screen.height;
    const stageWidth = app.screen.width;

    let creeper = null;
    let audio = new Audio('./audio/minecraft.mp3');
    audio.load();

    let exploding = false;
    let firstClick = true;

    async function setup() {
        if (creeper) {
            app.stage.removeChild(creeper);
            creeper.destroy();
        }
        const texture = await Assets.load('./img/creeper.png');
        creeper = Sprite.from(texture);
        creeper.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        creeper.anchor.set(0.5);
        creeper.x = stageWidth / 2;
        creeper.y = stageHeight / 2;
        creeper.scale.set(1);
        creeper.visible = false;
        app.stage.addChild(creeper);
    }

    async function explotarCreeper() {
        if (exploding) return;
        exploding = true;

        creeper.visible = true;

        // Parar audio si está sonando y reiniciar
        audio.pause();
        audio.currentTime = 0;
        audio.play();

        let scale = 1;
        const explosion = setInterval(() => {
            scale += 0.3;
            creeper.scale.set(scale);
            if (scale >= 3.5) {
                clearInterval(explosion);
                exploding = false;
                creeper.visible = false;
                creeper.scale.set(1);
            }
        }, 50);
    }

    document.body.addEventListener('click', async () => {
        if (firstClick) {
            firstClick = false;
            await setup();
        }
        explotarCreeper();
    });

    await setup();
})();



