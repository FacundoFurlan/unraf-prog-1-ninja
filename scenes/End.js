// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class End extends Phaser.Scene {
    constructor() {
      // key of the scene
      // the key will be used to start the scene by other scenes
      super("end");
    }
  
    init(data) {
      // this is called before the scene is created
      // init variables
      // take data passed from other scenes
      // data object param {}

      this.outcome = data.outcome;
      this.points = data.points;
    }
  
    preload() {
      // load assets
    }
  
    create() {
        // 1) Fondo negro
        this.cameras.main.setBackgroundColor("#000000");

        // 2) Determinar texto de victoria/derrota
        const msg = this.outcome === 1 ? "¡Ganaste!" : "Perdiste";

        // 3) Estilo de texto común
        const style = {
        fontSize: "48px",
        fill: "#ffffff",
        align: "center"
        };

        // 4) Mostrar mensaje centrado en pantalla
        const { width, height } = this.scale;
        this.add
        .text(width / 2, height / 2 - 50, msg, style)
        .setOrigin(0.5);

        // 5) Mostrar puntos debajo
        this.add
        .text(width / 2, height / 2 + 50, `Puntos: ${this.points}`, style)
        .setOrigin(0.5);
        }
    
        update() {

    }
}
  