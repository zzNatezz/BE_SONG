export const asyncCatch = (fnc) => async (req, res, next) => {
    try {
      await fnc(req, res, next);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  };