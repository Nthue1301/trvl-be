const { CreateFlight, DeleteFlight, EditFlight, GetFlight } = require('../controller/flight');

module.exports = app => {
    var router = require('express').Router();

    router.post("/create_flight", CreateFlight);
    router.post("/delete_flight", DeleteFlight);
    router.post("/edit_flight", EditFlight);
    router.post("/get_flight", GetFlight);
    
    app.use("/flight", router);
}