import Unit from './Unit.js';
import Action from './Action.js';

const DOUBLE_COMPARE_PRECISION = 0.000001;
const TIME_LIMIT = 60000;
const TIME_DELTA = 100;
const LINE_COUNT = 4;

const TOP_TOWER = new Unit().initFictive('11111111-1111-1111-1111-111111111111', 'fictive top castle tower');
const BOTTOM_TOWER = new Unit().initFictive('22222222-2222-2222-2222-222222222222', 'fictive bottom castle tower');

const isMoveContinuous = context => context.move.currentCastleHP !== 0
                                  && context.attackUnits.length !== 0
                                  && context.time < TIME_LIMIT;

const doubleGreaterOrEqual = (d1, d2) => d1 > d2 || Math.abs(d1 - d2) < DOUBLE_COMPARE_PRECISION;

const moveDistance = (unit, time) => (unit.velocity * time) / 1000;

const startPointXToOffset = (tower) => {
  const x = tower.startPoint.x;
  if(x === 2){
    // 18/20
    return 0.9;
  } else if(x === 1) {
    // 16/20
    return 0.8;
  } else {
    // некорректные данные
    return 1;
  }
};

const getNearestTower = (context, line) => {
  const towersOnLine = context.defenceUnits.filter(tower => tower.startPoint.y === line);
  towersOnLine.sort((t1, t2) => t1.startPoint.x - t2.startPoint.x);
  return towersOnLine.length !== 0 ? towersOnLine[0] : undefined;
};

const getNearestUnit = (context, line) => {
  const unitsOnLine = context.attackUnits.filter(unit => unit.startPoint.y === line);
  unitsOnLine.sort((t1, t2) => t2.startPoint.x - t1.startPoint.x);
  return unitsOnLine.length !== 0 ? unitsOnLine[0] : undefined;
};

const obstacleInFront = (unit, context) => {
  const nearestTower = getNearestTower(context, unit.startPoint.y);
  return (nearestTower ? startPointXToOffset(nearestTower) : 1) - unit.positionOffset;
};

// Корректно как для ~0, так и для отрицательных
const restAgainstObstacleByDistance = (distance) => distance < DOUBLE_COMPARE_PRECISION;

const restAgainstObstacle = (unit, context) => restAgainstObstacleByDistance(obstacleInFront(unit, context));

const castleTowerAttackUnit = (context, towerPosition, unit) => {
  unit.decrementHP(context.castleAttack);
  const action = new Action(towerPosition === 'top' ? TOP_TOWER: BOTTOM_TOWER, 'castleattack');
  action.addActionParam('tower', towerPosition);
  action.addActionParam('victim', unit.unitID);
  action.beginOffset = context.time;
  action.endOffset = context.time + context.castleTimeAttack;
  if(towerPosition === 'top') {
    context.topTowerAction = action;
  } else {
    context.bottomTowerAction = action;
  }
  context.move.addAction(action);
  const getDamageAction = new Action(unit, 'getdamage');
  getDamageAction.addActionParam('damage', context.castleAttack);
  getDamageAction.beginOffset = context.time;
  getDamageAction.endOffset = context.time;
  context.move.addAction(getDamageAction);
};


const chooseCastleTowerAndAttackUnit = (context, unit) => {
  if (context.topTowerAction === undefined && (unit.startPoint.y === 0 || unit.startPoint.y === 1)) {
    castleTowerAttackUnit(context, 'top', unit);
  } else if (context.bottomTowerAction === undefined && (unit.startPoint.y === 2 || unit.startPoint.y === 3)) {
    castleTowerAttackUnit(context, 'bottom', unit);
  }
};

const removeOldActiveActions = (context) => {
  for (const entry in context.activeActions.entries) {
    const unit = entry[0];
    const action = entry[1];
    if (action.endOffset < context.time || unit.currentHP <= 0) {
      context.activeActions[unit] = undefined;
    }
  }
  if (context.topTowerAction !== undefined && context.topTowerAction.endOffset < context.time) {
    context.topTowerAction = undefined;
  }
  if (context.bottomTowerAction !== undefined && context.bottomTowerAction.endOffset < context.time) {
    context.bottomTowerAction = undefined;
  }
};

const castleAttack = (context) => {
  // Выбираются все юниты в расстоянии атак башен
  // Определяется какая башня может по ним попасть(верхняя или нижняя)
  // Если эта башня в текущий момент не занята, то юнит атакуется
  context.attackUnits
    .filter(unit => doubleGreaterOrEqual(context.castleRange, 1 - unit.positionOffset))
    .forEach(unit => chooseCastleTowerAndAttackUnit(context, unit));
};

const unitAttackTower = (context, unit, tower) => {
  const attack = new Action(unit, 'attack');
  attack.beginOffset = context.time;
  attack.endOffset = context.time + unit.timeAttack;
  attack.addActionParam('victim', tower.unitID);
  context.activeActions[unit] = attack;
  context.move.addAction(attack);
  tower.decrementHP(unit.attack);
  const getDamageAction = new Action(tower, 'getdamage');
  getDamageAction.addActionParam('damage', unit.attack);
  getDamageAction.beginOffset = context.time;
  getDamageAction.endOffset = context.time;
  context.move.addAction(getDamageAction);
};

const unitAttackCastle = (context, unit) => {
  const attack = new Action(unit, 'attack');
  attack.beginOffset = context.time;
  attack.endOffset = context.time + unit.timeAttack;
  context.activeActions[unit] = attack;
  context.move.addAction(attack);
  context.move.decrementCastleHP(unit.attack);
};

const unitsAttack = (context) => {
  // В активных действиях юнит может или идти или атаковать
  // Если юнит дошел до того, что может атаковать, ему следует переключиться
  // с ходьбы на атаку
  context.attackUnits.forEach((unit) => {
    const nearestTower = getNearestTower(context, unit.startPoint.y);
    const currentAction = context.activeActions[unit];
    const attackTower = nearestTower !== undefined
      && doubleGreaterOrEqual(unit.positionOffset + unit.range, startPointXToOffset(nearestTower))
      && (currentAction !== undefined || currentAction.type === 'move');
    const attackCastle = nearestTower === undefined
      && unit.positionOffset + unit.range >= 1
      && (currentAction === undefined || currentAction.type === 'move');
    if (attackTower) {
      unitAttackTower(context, unit, nearestTower);
    } else if (attackCastle) {
      unitAttackCastle(context, unit);
    }
  });
};

const towerAttackUnit = (context, tower, unit) => {
  unit.decrementHP(tower.attack);
  const attack = new Action(tower, 'attack');
  attack.addActionParam('victim', unit.unitID);
  attack.beginOffset = context.time;
  attack.endOffset = context.time + tower.timeAttack();
  context.activeActions[tower] = attack;
  context.move.addAction(attack);
  const getDamageAction = new Action(unit, 'getdamage');
  getDamageAction.addActionParam('damage', tower.attack);
  getDamageAction.beginOffset = context.time;
  getDamageAction.endOffset = context.time;
  context.move.addAction(getDamageAction);
};

const towerAttack = (context) => {
  // Выбираем башни с переднего плана
  // Выбираем ближайшего юнита, которого может атаковать башня
  // Если звезды сходятся, то добавляем экншены
  for (let line = 0; line < LINE_COUNT; line += 1) {
    const nearestTower = getNearestTower(context, line);
    const nearestUnit = getNearestUnit(context, line);
    const needToAttack = nearestTower !== undefined
      && nearestUnit !== undefined
      && context.activeActions[nearestTower] === undefined
      && doubleGreaterOrEqual(
               nearestUnit.positionOffset, startPointXToOffset(nearestTower) - nearestTower.range);
    if (needToAttack) {
      towerAttackUnit(context, nearestTower, nearestUnit);
    }
  }
};

const dieIfNeeded = (context, unit) => {
  if (unit.currentHP <= 0) {
    const action = context.activeActions[unit];
    if (action !== undefined) {
      action.endOffset = context.time;
    }
    context.activeActions[unit] = undefined;
    context.move.addAction(new Action(unit, 'die', {}, context.time, context.time));
  }
};

const unitsDie = (context) => {
  context.defenceUnits.forEach(u => dieIfNeeded(context, u));
  context.defenceUnits = context.defenceUnits.filter(tower => tower.currentHP > 0);
  context.attackUnits.forEach(u => dieIfNeeded(context, u));
  context.attackUnits = context.attackUnits.filter(unit => unit.currentHP > 0);
  context.move.aliveUnits = context.move.aliveUnits.filter(unit => unit.currentHP > 0);
};

const addMoveAction = (context, unit) => {
  const action = new Action(unit, 'move');
  action.beginOffset = context.time;
  action.endOffset = context.time + TIME_DELTA;
  context.activeActions[unit] = action;
  context.move.addAction(action);
};

const moveEachUnit = (context, unit) => {
  const distanceToObstacle = obstacleInFront(unit, context);
  const distancePerTick = moveDistance(unit, TIME_DELTA);
  if (!restAgainstObstacleByDistance(distanceToObstacle)) {
    const distance = Math.min(distancePerTick, distanceToObstacle);
    unit.incrementOffset(distance);
    context.activeActions[unit].endOffset = context.time + ((distance / distancePerTick) * TIME_DELTA);
    context.activeActions[unit].addActionParam('pos', distance);
  }
};

const moveUnits = (context) => {
  // Если юнит ничем не занят и не уперся в башню или в замок,
  // то в активные действия ему прибавляем ходьбу
  context.attackUnits
    .filter(p => context.activeActions[p] === undefined && !restAgainstObstacle(p, context))
    .forEach(unit => addMoveAction(context, unit));
  // Двигаем юнитов, у которых в активных действиях ходьба
  context.attackUnits
    .filter(p => context.activeActions[p] !== undefined
                  && context.activeActions[p].type === 'move')
    .forEach(unit => moveEachUnit(context, unit));
};


const processMove = (settings, chosenAttackCards, chosenDefenceCards, move) => {
  const allChosenCards = Array.from(chosenDefenceCards);
  allChosenCards.push(...chosenAttackCards);
  allChosenCards.forEach((card) => {
    const pos = card.pos;
    if (pos !== undefined
            && 0 <= pos.x && pos.x < 3
            && 0 <= pos.y && pos.y < 4) {
      move.addUnit(new Unit().initNew(card, pos));
    }
  });
  const context = {};
  context.move = move;
  context.activeActions = {};
  context.topTowerAction = undefined;
  context.bottomTowerAction = undefined;
  context.castleRange = settings.maxCastleRange;
  context.castleAttack = settings.castleAttack;
  context.castleTimeAttack = settings.castleTimeAttack;
  context.attackUnits = move.aliveUnits.filter(u => u.side === 'ATTACKER');
  context.defenceUnits = move.aliveUnits.filter(u => u.side === 'DEFENDER');
  context.time = 0;
  while (isMoveContinuous(context)) {
    removeOldActiveActions(context);
    castleAttack(context);
    towerAttack(context);
    unitsAttack(context);
    unitsDie(context);
    moveUnits(context);
    context.time += TIME_DELTA;
  }
};

export default processMove;
