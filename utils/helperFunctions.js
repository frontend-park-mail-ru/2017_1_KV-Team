/**
 * Created by andreivinogradov on 15.02.17.
 */
const Maybe = require('data.maybe');

// safeProp :: String -> Object -> Maybe Nothing Any
const safeProp = prop => obj => Maybe.fromNullable(obj[prop]);

// identity :: any -> any
const identity = any => any;

module.exports = { safeProp, identity };