const { CreateTicket, CancelTicket, EditTicket, GetTicket, SearchTicket, SearchTicketNew } = require('../controller/ticket');

module.exports = app => {
    var router = require('express').Router();

    router.post("/booking_ticket", CreateTicket);
    router.post("/cancel_ticket", CancelTicket);
    router.post("/edit_ticket", EditTicket);
    router.post("/get_ticket", GetTicket);
    router.post("/search", SearchTicketNew);
    
    app.use("/ticket", router);
}