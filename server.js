/**
 * Created by andreivinogradov on 15.02.17.
 */

const express = require('express');
const path = require('path');

const port = 3000;
const app = express();

const staticPath = path.join(__dirname, 'static');

app.use(express.static(staticPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(staticPath, 'index.html'));
});

app.listen(port);


// {
//   "status":
//   "attack_win", "gameID"
// :
//   "844bdf4f-c860-421a-b9ba-1094c52eb270", "currentMove"
// :
//   1, "castleHP"
// :
//   1, "myUnits"
// :
//   [{
//     "unitID": "5ffc0e48-2c86-4ccf-8d6f-d73ad938f35b",
//     "assotiatedCardAlias": "c",
//     "maxHP": 1,
//     "currentHP": 1,
//     "startPoint": {"x": 1, "y": 2}
//   }], "enemyUnits"
// :
//   [{
//     "unitID": "81b3af5c-67e7-4b59-87ee-aee4da468033",
//     "assotiatedCardAlias": "b",
//     "maxHP": 4,
//     "currentHP": 4,
//     "startPoint": {"x": 0, "y": 2}
//   }], "actions"
// :
//   [{
//     "unitID": "81b3af5c-67e7-4b59-87ee-aee4da468033",
//     "actiontType": "move",
//     "actionParameters": {"distance": 0.7000000000000003},
//     "timeOffsetBegin": 0,
//     "timeOffsetEnd": 3500
//   }, {
//     "unitID": "5ffc0e48-2c86-4ccf-8d6f-d73ad938f35b",
//     "actiontType": "attack",
//     "actionParameters": {"victim": "81b3af5c-67e7-4b59-87ee-aee4da468033"},
//     "timeOffsetBegin": 3000,
//     "timeOffsetEnd": 3300
//   }, {
//     "unitID": "81b3af5c-67e7-4b59-87ee-aee4da468033",
//     "actiontType": "getdamage",
//     "actionParameters": {"damage": 1},
//     "timeOffsetBegin": 3000,
//     "timeOffsetEnd": 3000
//   }, {
//     "unitID": "5ffc0e48-2c86-4ccf-8d6f-d73ad938f35b",
//     "actiontType": "attack",
//     "actionParameters": {"victim": "81b3af5c-67e7-4b59-87ee-aee4da468033"},
//     "timeOffsetBegin": 3400,
//     "timeOffsetEnd": 3500
//   }, {
//     "unitID": "81b3af5c-67e7-4b59-87ee-aee4da468033",
//     "actiontType": "getdamage",
//     "actionParameters": {"damage": 1},
//     "timeOffsetBegin": 3400,
//     "timeOffsetEnd": 3400
//   }, {
//     "unitID": "81b3af5c-67e7-4b59-87ee-aee4da468033",
//     "actiontType": "attack",
//     "actionParameters": {"victim": "5ffc0e48-2c86-4ccf-8d6f-d73ad938f35b"},
//     "timeOffsetBegin": 3500,
//     "timeOffsetEnd": 3800
//   }, {
//     "unitID": "5ffc0e48-2c86-4ccf-8d6f-d73ad938f35b",
//     "actiontType": "getdamage",
//     "actionParameters": {"damage": 1},
//     "timeOffsetBegin": 3500,
//     "timeOffsetEnd": 3500
//   }, {
//     "unitID": "5ffc0e48-2c86-4ccf-8d6f-d73ad938f35b",
//     "actiontType": "die",
//     "actionParameters": {},
//     "timeOffsetBegin": 3500,
//     "timeOffsetEnd": 3500
//   }, {
//     "unitID": "81b3af5c-67e7-4b59-87ee-aee4da468033",
//     "actiontType": "move",
//     "actionParameters": {"distance": 0.9000000000000005},
//     "timeOffsetBegin": 3900,
//     "timeOffsetEnd": 4900
//   }, {
//     "unitID": "22222222-2222-2222-2222-222222222222",
//     "actiontType": "castleattack",
//     "actionParameters": {"victim": "81b3af5c-67e7-4b59-87ee-aee4da468033", "tower": "bottom"},
//     "timeOffsetBegin": 4900,
//     "timeOffsetEnd": 5400
//   }, {
//     "unitID": "81b3af5c-67e7-4b59-87ee-aee4da468033",
//     "actiontType": "getdamage",
//     "actionParameters": {"damage": 1},
//     "timeOffsetBegin": 4900,
//     "timeOffsetEnd": 4900
//   }, {
//     "unitID": "81b3af5c-67e7-4b59-87ee-aee4da468033",
//     "actiontType": "attack",
//     "actionParameters": {},
//     "timeOffsetBegin": 4900,
//     "timeOffsetEnd": 5200
//   }]
// }