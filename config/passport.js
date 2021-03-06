const LocalStrategy = require("passport-local").Strategy; //for simple username and password authentication.
const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username" }, //by default, passwardField is password
      (username, password, done) => {
        //match user
        User.findOne({ username: username })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                isSuccess: false,
                message: "Username does not exists",
              });
            }
            //match pass
            if (user.password === password) {
              return done(null, user);
            } else {
              return done(null, false, {
                isSuccess: false,
                message: "Password incorrect",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
