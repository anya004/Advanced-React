const {forwardTo} = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, ctx, info) {
        //check if there is a current user
        if(!ctx.request.userId) {
            return null; //important to return null
        }
        return ctx.db.query.user({ //returning a promise directly
            where: {id: ctx.request.userId },
        }, info);
    },
    async users(parent, args, ctx, info) {
        //1. check if they are logged in
        if(!ctx.request.userId) {
            throw new Error('You must be logged in');
        }
        //2. check that the user has permission to query all the users
        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
        //3. then query the users
        return ctx.db.query.users({}, info);
    },
};

module.exports = Query;
