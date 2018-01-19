/// <reference path="../../index.d.ts"/>
import Router from "express-promise-router"
var router = Router();

router.get("test", function (req, res) {
    res.send("Test");
});

