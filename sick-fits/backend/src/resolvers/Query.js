const {forwardTo} = require('prisma-binding');

const Query = {
    items: forwardTo('db'),
    // async items(parent, arg, ctx, info) {
    //     console.log("GETTING ITEMS");
    //     const items = await ctx.db.query.items();
    //     return items;
    // }
};

module.exports = Query;
