/**
 * Created by andreivinogradov on 03.05.17.
 */

class TopBar {
  constructor(state) {
    this.currentRound = 0;
    const topbar = state.add.sprite(0, 0, 'bottombar');
    topbar.width = state.width;
    topbar.height = 70;

    const style = {
      font: '20px Fira Sans',
      fill: '#fff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
    };

    this.roundCount = state.add.text(state.width / 2, 20, this.currentRound, Object.assign({}, style, {
      font: '30px Fira Sans',
    }));
  }

  updateCounter() {
    this.currentRound += 1;
    this.roundCount.setText(this.currentRound);
  }
}

export default TopBar;
