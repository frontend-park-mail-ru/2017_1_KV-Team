/**
 * Created by andreivinogradov on 03.05.17.
 */

export default function (state, nickname, x, y) {
  const healthbarTexture = state.add.sprite(x, y, 'healthbar');

  healthbarTexture.width = 300;
  healthbarTexture.height = 40;

  const style = {
    font: '20px Fira Sans',
    fill: '#fff',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
  };

  const nick = state.add.text(x + 150, y - 25, nickname, Object.assign({}, style, {
    font: '24px Fira Sans',
  }));

  nick.anchor.x = 0.5;

  const healthScale = state.add.graphics();
  // healthScale.beginFill(0x0000FF);
  healthScale.lineStyle(2, 0x0000FF, 1);
  healthScale.drawRect(x, y, 300, 40);
  // healthScale.endFill();
  healthScale.boundsPadding = 0;

  const healthbar = state.add.group();
  healthbar.add(healthbarTexture);
  healthbar.add(healthScale);
  healthbar.add(nick);

  return healthbar;
}
