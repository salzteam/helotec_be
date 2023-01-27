module.exports = {
  body: (...allowedKeys) => {
    return (req, _, next) => {
      const { body } = req;
      const sanitizedKey = Object.keys(body).filter((key) =>
        allowedKeys.includes(key)
      );
      const newBody = {};
      for (let key of sanitizedKey) {
        Object.assign(newBody, { [key]: body[key] });
      }
      req.body = newBody;
      next();
    };
  },
  params: (...allowedKeys) => {
    return (req, _, next) => {
      const { params } = req;
      const sanitizedKey = Object.keys(params).filter((key) =>
        allowedKeys.includes(key)
      );
      const newParams = {};
      for (let key of sanitizedKey) {
        Object.assign(newParams, { [key]: params[key] });
      }
      req.params = newParams;
      next();
    };
  },
};
