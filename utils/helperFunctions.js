/**
 * Created by andreivinogradov on 15.02.17.
 */

// identity :: any -> any
const identity = any => any;

// readNotFound :: any -> Resolved Promise
const liftPromise = any => Promise.resolve(any);

module.exports = { identity, liftPromise };