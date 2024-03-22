import jwt from "jsonwebtoken";

const midleware = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const assessToken = token.split(" ")[1];
      jwt.verify(assessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json("Token hết hạn");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("Chưa xác thực người dùng!");
    }
  },
  verifyTokenAdmin: (req, res, next) => {
    midleware.verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("Bạn không được phép sửa/xóa!");
      }
    });
  },
};

export { midleware };
