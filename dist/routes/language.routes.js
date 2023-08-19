"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _language = require("../controllers/language.controllers");
var _authenticate = _interopRequireDefault(require("../middleware/authenticate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = (0, _express.Router)();
router.get("/", _language.methods.getUsers);
router.get("/:id", _language.methods.getUser);
router.post("/", _language.methods.addUsers);
router.put("/:id", _language.methods.updateUser);
router["delete"]("/:id", _language.methods.deleteUser);
router.post("/login", _language.methods.loginUser);
router.post("/messages", _language.methods.sendMessage);
router.get("/messages/between/:user1Id/:user2Id", _language.methods.getMessagesBetweenUsers); // Esto es para obtener mensajes entre dos usuarios

// Añadir ruta para obtener el perfil del usuario autenticado
router.get("/profile/:id", _authenticate["default"], _language.methods.getProfile);
var _default = router;
exports["default"] = _default;