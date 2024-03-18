const middlewareController = {
  verifyTokenAdmin: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("You're not alloweb to delete other");
      }
    });
  },
};

export { middlewareController };
