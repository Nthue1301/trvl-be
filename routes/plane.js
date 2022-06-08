const { CreatePlane, DeletePlane, EditPlane, GetPlane } = require('../controller/plane');

module.exports = app => {
    var router = require('express').Router();

    router.post("/create_plane", CreatePlane);
    router.post("/delete_plane", DeletePlane);
    router.post("/edit_plane", EditPlane);
    router.post("/get_plane", GetPlane);  

    app.use("/plane", router);
}