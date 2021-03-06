var express = require("express");
var router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const Stock = require("../models/stock.js");

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log(" Username: " + username + " Password:" + password);
  if (!username || !password) {
    res.status(406).json({
      isSuccess: false,
      message: "Please fill out both username and password",
    });
  } else {
    //validation passed
    User.findOne({ username: username }).exec((err, user) => {
      if (user) {
        res
          .status(406)
          .json({ isSuccess: false, message: "Username already exists" });
      } else {
        const newUser = new User({
          username: username,
          password: password,
        });
        newUser.save();
        res.json({ isSuccess: true, message: "New user added" });
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (!user) {
      return res.status(401).json(info);
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(401).json({ isSuccess: false, message: err });
      }
      res.json({ isSuccess: true, message: "Logged in" });
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.json({ isSuccess: true, message: "Logged out" });
});

router.put("/addbalance", (req, res) => {
  if (req.isAuthenticated()) {
    const { amount } = req.body;
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) < 0) {
      res.status(422).json({ isSuccess: false, message: "Invalid amount" });
    } else {
      User.findOne({ username: req.user.username }).exec((err, user) => {
        if (err)
          return res.status(500).json({ isSuccess: false, message: err });
        let newBalance = user.balance + parseFloat(amount);
        user.balance = newBalance;
        user.save();
        res.json({
          isSuccess: true,
          message: "Balance Added. New balance: " + newBalance,
        });
      });
    }
  } else {
    res.status(401).json({ isSuccess: false, message: "Please login first" });
  }
});

router.put("/buy", (req, res) => {
  if (req.isAuthenticated()) {
    const { stockname, amount } = req.body;
    if (
      !stockname ||
      !amount ||
      isNaN(parseFloat(amount)) ||
      parseFloat(amount) < 0
    ) {
      res.status(422).json({ isSuccess: false, message: "Invalid input" });
    } else {
      Stock.findOne({ stockname: stockname }).exec((err, stock) => {
        if (err)
          return res.status(500).json({ isSuccess: false, message: err });
        if (!stock) {
          return res.status(422).json({
            isSuccess: false,
            message: "The stock is not available to trade.",
          });
        }
        User.findOne({ username: req.user.username }).exec((err, user) => {
          if (user.balance < parseFloat(amount) * stock.price) {
            return res.status(422).json({
              isSuccess: false,
              message: "No enough balance to trade",
            });
          }
          user.balance = user.balance - parseFloat(amount) * stock.price;
          let curAmount = user.portfolio.get(stockname);
          if (curAmount) {
            let newAmount = curAmount + parseFloat(amount);
            user.portfolio.set(stockname, newAmount);
          } else {
            user.portfolio.set(stockname, parseFloat(amount));
          }
          user.save();
          res.json({
            isSuccess: true,
            message: `Bought ${amount} share(s) of ${stockname}.`,
          });
        });
      });
    }
  } else {
    res.status(401).json({ isSuccess: false, message: "Please login first" });
  }
});

router.put("/sell", (req, res) => {
  if (req.isAuthenticated()) {
    const { stockname, amount } = req.body;
    if (
      !stockname ||
      !amount ||
      isNaN(parseFloat(amount)) ||
      parseFloat(amount) < 0
    ) {
      res.status(422).json({ isSuccess: false, message: "Invalid input" });
    } else {
      Stock.findOne({ stockname: stockname }).exec((err, stock) => {
        if (err)
          return res.status(500).json({ isSuccess: false, message: err });
        if (!stock) {
          return res.status(422).json({
            isSuccess: false,
            message: "The stock is not available to trade.",
          });
        }
        User.findOne({ username: req.user.username }).exec((err, user) => {
          let curAmount = user.portfolio.get(stockname);
          if (!curAmount || curAmount - parseFloat(amount) < 0) {
            return res.status(422).json({
              isSuccess: false,
              message: "The shares you pocess is less than the amount",
            });
          }

          user.balance = user.balance + parseFloat(amount) * stock.price;
          let newAmount = curAmount - parseFloat(amount);
          if (newAmount === 0) {
            user.portfolio.set(stockname, undefined); //Is this the best way to delete from map?
          } else {
            user.portfolio.set(stockname, newAmount);
          }
          user.save();
          res.json({
            isSuccess: true,
            message: `Sold ${amount} share(s) of ${stockname}.`, // Note this syntactic sugar
          });
        });
      });
    }
  } else {
    res.status(401).json({ isSuccess: false, message: "Please login first" });
  }
});

router.post("/query", (req, res) => {
  if (req.isAuthenticated()) {
    const { stockname } = req.body;
    if (!stockname) {
      res.status(422).json({ isSuccess: false, message: "Invalid input" });
    } else {
      Stock.findOne({ stockname: stockname }).exec((err, stock) => {
        if (err)
          return res.status(500).json({ isSuccess: false, message: err });
        if (!stock) {
          return res.status(422).json({
            isSuccess: false,
            message: "The stock is not available.",
          });
        }
        res.json({
          isSuccess: true,
          message: { stockname: stock.stockname, price: stock.price },
        });
      });
    }
  } else {
    res.status(401).json({ isSuccess: false, message: "Please login first" });
  }
});

router.get("/portfolio", (req, res) => {
  if (req.isAuthenticated()) {
    let retMsg = { balance: req.user.balance, portfolio: req.user.portfolio };
    res.json({ isSuccess: true, message: retMsg });
  } else {
    res.status(401).json({ isSuccess: false, message: "Please login first" });
  }
});

module.exports = router;
