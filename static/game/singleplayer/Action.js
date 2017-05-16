/**
 * Created by maxim on 14.05.17.
 */

import Unit from './Unit.js';

export default class Action {
  constructor(actor, type, actionParams = {}, beginOffset = undefined, endOffset = undefined) {
    this.actor = actor;
    this.actorSnapshot = new Unit().copy(actor);
    this.type = type;
    this.actionParams = actionParams;
    this.beginOffset = beginOffset;
    this.endOffset = endOffset;
  }
  addActionParam(key, value) {
    this.actionParams[key] = value;
  }
}
