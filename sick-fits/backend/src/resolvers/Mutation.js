const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');
const { hasPermission } = require('../utils');

const Mutations = {
    async createItem(parent, args, ctx, info) {
        //check if user is logged in
        if (!ctx.request.userId) {
          throw new Error('You must be logged in to see this page.');
        }
        const item = await ctx.db.mutation.createItem({
            data: {
                user: {
                  connect: { //creating a relationship between item and user
                    id: ctx.request.userId,
                  },
                },
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
      async requestReset(parent, args, ctx, info) {
        //1. Check if real user
        const user = await ctx.db.query.user({ where: { email: args.email }});
        if(!user) {
          throw new Error(`No such user found for email ${args.email}`);
        }
        //2. Set a reset token and expiry
        randomBytesPromisified = promisify(randomBytes);
        const resetToken = (await randomBytesPromisified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1hour
        const res = await ctx.db.mutation.updateUser({
          where: {email: args.email},
          data: { resetToken, resetTokenExpiry}
        });
        //3. Email them the token 
        //could wrap in try/catch as extra catch
        const mailRes = await transport.sendMail( {
          from: 'anna@sickfits.com',
          to: user.email,
          subject: 'Password reset token for sickfits.com',
          html: makeANiceEmail(`Your password reset token is here!\n\n\
            <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here To Reset Your Password</a>`),
        });
        //4. return 
        return { message: 'Thanks!'};
      },
      async resetPassword(parent, args, ctx, info) {
        //1. check their passwords match
        if(args.password !== args.confirmPassword) {
          throw new Error('Your password don\'t match!');
        }
        //2. check if its the right reset password
        //3. check if its expired
        const [user] = await ctx.db.query.users({
          where: {
            resetToken: args.resetToken,
            resetTokenExpiry_gte: Date.now() - 3600000,
          },
        });
        if(!user) {
          throw new Error('This token is either invalid or expired');
        }
        //4. hash the new passowrd
        const password = await bcrypt.hash(args.password, 10);
        //5. save the new password
        const updatedUser = await ctx.db.mutation.updateUser({
          where: {email: user.email},
          data: {
            password,
            resetToken: null,
            resetTokenExpiry: null,
          },
        });
        //6. generate the JWT
        const token = jwt.sign({ userId: updatedUser.id}, process.env.APP_SECRET);
        //7. set the JWT cookie
        ctx.response.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000*60*60*24*365, // 1year cookie
        });
        //8. return the new user
        return updatedUser;
      },
      async updatePermissions(parent, args, ctx, info) {
        // check if logged in
        if(!ctx.request.userId) {
          throw new Error('Please login to update permissions.');
        }
        //query the current user
        const currentUser = await ctx.db.query.user(
          { 
            where: { 
              id: ctx.request.userId 
            },
          }, info
        );
        //check if they have the right permissions
        hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
        //upadte permissions
        return ctx.db.mutation.updateUser({
          data: {
            permissions: {
              set: args.permissions,
            }
          },
          where: {
            id: args.userId,
          },
        }, info);
      },
};

module.exports = Mutations;
