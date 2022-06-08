const { CreateBrand, DeleteBrand, EditBrand, GetBrand } = require('../controller/brand');

module.exports = app => {
    var router = require('express').Router();

    router.post("/create_brand", CreateBrand);
    router.post("/delete_brand", DeleteBrand);
    router.post("/edit_brand", EditBrand);
    router.post("/get_brand", GetBrand);

    app.use("/brand", router);
}