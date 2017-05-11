/**
 * Created by andreivinogradov on 03.05.17.
 */

export default function (state) {
  const wall = state.add.sprite(state.width - 50, 70, 'wall');
  const castleTowerTop = state.add.sprite(state.width - 50, 75, 'castleTower');
  const castleTowerBot = state.add.sprite(state.width - 50, state.height - 205, 'castleTower');

  castleTowerBot.width = 50;
  castleTowerBot.height = 50;
  castleTowerTop.width = 50;
  castleTowerTop.height = 50;

  return {
    wall,
    castleTowerBot,
    castleTowerTop,
  };
}
