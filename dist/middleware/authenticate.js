"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var authenticate = function authenticate(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "No Authorization header present."
      });
    }
    var token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: "Bearer token is not present in Authorization header."
      });
    }
    var decodedToken = _jsonwebtoken["default"].verify(token, 'your-secret-key');
    console.log(decodedToken);
    req.userData = {
      userId: decodedToken.id
    };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed!",
      error: error.message
    });
  }
};
var _default = authenticate;
exports["default"] = _default;