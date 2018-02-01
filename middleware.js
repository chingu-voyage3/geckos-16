module.exports = {

  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    else {
      //req.flash("error", "You must be signed in to do that!");
      res.redirect("/auth/login");
    }
  },

  notLoggedIn: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    else {
      res.redirect("/meetings");
    }
  }

}
