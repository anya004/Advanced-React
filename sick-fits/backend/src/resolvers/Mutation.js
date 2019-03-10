const Mutations = {
    async createItem(parent, args, ctx, info) {
        //TODO: check if user is logged in

        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);

        return item;
    },
    updateItem(parent, args,ctx,info) {
        //first take a copy of the updates 
        const updates = { ... args};
        // remove ID from the updates
        delete updates.id;
        //run the updat emethod
        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id,
            },
        }, info);
    },
    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id};
        // find the item
        const item = await  ctx.db.query.item({ where} , `{id, title}`);
        // check if they have the permissions
        //TODO
        // delete it
        return ctx.db.mutation.deleteItem({where}, info);
      },
};

module.exports = Mutations;
