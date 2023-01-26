const express = require("express");
const dataRouter = express.Router();
const validate = require("../middlewares/validate");
const { create, get, getDashboard } = require("../controllers/data");

dataRouter.post(
  "/addData",
  validate.body(
    "mother_name",
    "mother_age",
    "genderBaby_id",
    "baby_weight",
    "baby_long",
    "gestational_age",
    "date",
    "parturition_id",
    "condition_id"
  ),
  create
);

dataRouter.get(
  "/search",
  validate.params(
    "day",
    "month",
    "year",
    "condition_baby",
    "gender_baby",
    "age_mother",
    "parturition",
    "page",
    "limit"
  ),
  get
);
dataRouter.get("/dashboard", validate.params("year"), getDashboard);

module.exports = dataRouter;
