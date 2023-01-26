const dataRepo = require("../repo/data");

const create = async (req, res) => {
  const result = await dataRepo.create(req.body);
  res.status(result.statusCode).send(result);
};

const get = async (req, res) => {
  const result = await dataRepo.get(req.query);
  res.status(result.statusCode).send(result);
};
const getDashboard = async (req, res) => {
  const result = await dataRepo.getDashboard(req.query);
  res.status(result.statusCode).send(result);
};

const dataControllers = {
  create,
  get,
  getDashboard,
};

module.exports = dataControllers;
