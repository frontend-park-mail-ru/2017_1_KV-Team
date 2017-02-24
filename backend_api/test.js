/**
 * Created by maxim on 23.02.17.
 */
"use strict";

const backend = require('./backendAPI');

// backend.register('some_nickname5', '33', '3');
// backend.login('some_nickname5', '1234');
backend.isLoggedIn('some_nickname5', '5205aaa2-d909-4ce6-809c-4d64bfe4abe5');

//backend.editAccount('some_nickname5', 'b3df6b99-01fb-448f-b8b0-56b146e568ce', 'n mail', '1234');
//backend.logout('some_nickname5', 'b3df6b99-01fb-448f-b8b0-56b146e568ce');