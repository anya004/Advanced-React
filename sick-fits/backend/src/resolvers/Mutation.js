const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
      async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        //hash their Password
        const password = await bcrypt.hash(args.password, 10);
        // create the user in the db
        const user = await ctx.db.mutation.createUser(
          {
            data: {
              ...args,
              password,
              permissions: { set: ['USER'] },
            },
          },
          info
        );
        //create the JWT token for them
        const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET);
        // we set the jwt as a cookie on the response
        ctx.response.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000*60*60*24*365, // 1year cookie
        });
        //return to the browser
        return user;
      },
      async signin(parent, { email, password }, ctx, info) {
        //1. check if there is a user with that email
        const user = await ctx.db.query.user({ where: { email } });
        if (!user) {
          throw new Error(`No such user found for email ${email}`);
        }
        //2. check if password matches
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error ("Incorrect password");
        }
        //3. generate a JWT token
        const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET);
        //4. set the cookie with the token
        ctx.response.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000*60*60*24*365, // 1year cookie
        });
        //5. return the user
        return user;
      },
      signout(parent, args, ctx, info) {
        //1. Check if there is a user with that email
        ctx.response.clearCookie('token');
        return { message: 'Goodbye!' };
      },
};

module.exports = Mutations;
