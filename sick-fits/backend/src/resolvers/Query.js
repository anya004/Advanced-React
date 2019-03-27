const {forwardTo} = require('prisma-binding');

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
};

module.exports = Query;
