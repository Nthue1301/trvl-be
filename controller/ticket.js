const { CreateTicketDAO, CancelTicketDAO, EditTicketDAO, GetTicketDAO, SearchTicketDAO, SearchTicketNewDAO } = require('../models/ticket');
const { GetNumber, GetString } = require('./../Utils/GetValue');
const moment = require("moment");
const { RespCustomCode, CatchErr } = require("./../Utils/UtilsFunction");
const e = require('express');

exports.CreateTicket = async function(req, resp) {
    let reqData = req.body;
    try {
        const ticket_id     = GetNumber(reqData, "ticket_id");
        const email         = GetString(reqData, "email");
        const customer_name = GetString(reqData, "customer_name");
        const result        = await CreateTicketDAO(ticket_id, email, customer_name);
        RespCustomCode(resp, result.code, result.msg);
    } catch (e) {
        CatchErr(resp, e, "CreateTicket - ticket.js");
    }
}

exports.CancelTicket = async function(req, resp) {
    let reqData = req.body;
    try {
        const ticket_id   = GetNumber(reqData, "ticket_id");
        const result      = await CancelTicketDAO(ticket_id);
        RespCustomCode(resp, result.code, result.msg);
    } catch (e) {
        CatchErr(resp, e, "CancelTicket - ticket.js");
    }
}

exports.EditTicket = async function(req, resp) {
    let reqData = req.body;
    try {
        const ticket_id     = GetNumber(reqData, "ticket_id");
        const email         = GetString(reqData, "email");
        const customer_name = GetString(reqData, "customer_name");
        const is_booked     = GetBoolean(reqData, "is_booked");
        const result        = await EditTicketDAO(ticket_id, email, customer_name, +is_booked);
        RespCustomCode(resp, result.code, result.msg);
    } catch (e) {
        CatchErr(resp, e, "EditTicket - ticket.js");
    }
}

exports.GetTicket = async function(req, resp) {
    let reqData = req.body;
    try {
        const result    = await GetTicketDAO();
        let respResult  = [];
        if (result.code === 200) {
            for (let i of result.msg) {
                respResult.push({
                    ticket_id           : i.TICKET_ID       === null ? -1 : i.TICKET_ID,
                    seat_number         : i.SEAT_NUMBER     === null ? "" : i.SEAT_NUMBER,
                    is_booked           : i.IS_BOOKED       === 1,
                    flight_id           : i.FLIGHT_ID       === null ? -1 : i.TICKET_ID,
                    email               : i.EMAIL           === null ? "" : i.TICKET_ID,
                    customer_name       : i.CUS_NAME        === null ? "" : i.TICKET_ID,
                    price_economy_class : i.PRICE_ECONOMY   === null ? 0 : i.TICKET_ID,
                    price_premium_class : i.PRICE_PREMIUM   === null ? 0 : i.TICKET_ID,
                    price_business_class: i.PRICE_BUSINESS  === null ? 0 : i.TICKET_ID,
                    price_first_class   : i.PRICE_FIRST     === null ? 0 : i.TICKET_ID,
                    start_time          : i.START_DATE      === null ? "" : moment(i.START_DATE, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss"),
                    to_time             : i.TO_DATE         === null ? "" : moment(i.TO_DATE, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss")
                });
            }
            SuccessResp(resp, respResult);
        } else {
            RespCustomCode(resp, result.code, result.msg);
        }
    } catch (e) {
        CatchErr(resp, e, "GetTicket - ticket.js");
    }
}

exports.SearchTicket = async function(req, resp) {
    let reqData = req.body;
    try {
        const plane_info    = GetString(reqData, "plane_info", false).toUpperCase();
        const price_from    = GetNumber(reqData, "price_from", false);
        const price_to      = GetNumber(reqData, "price_to", false);
        const date_time     = GetString(reqData, "date_time", false);
        // const to_date       = GetString(reqData, "to_date", false);
        const location_name = GetString(reqData, "location_name", false).toUpperCase();

        // if (!moment(start_date, "DD/MM/YYYY HH:mm:ss").isValid() || !moment(to_date, "DD/MM/YYYY HH:mm:ss").isValid()) {
        if (date_time !== '' && !moment(date_time, "DD/MM/YYYY HH:mm:ss").isValid()) {
            RespCustomCode(resp,900, "'date_time' phải là định dạng 'DD/MM/YYYY'");
            return;
        }

        const result        = await SearchTicketDAO(plane_info, price_from, price_to, date_time, location_name);
        let respResult      = []
        if (result.code === 200) {
            for (let i of result.msg) {
                respResult.push({
                    ticket_id           : i.TICKET_ID       === null ? -1 : i.TICKET_ID,
                    seat_number         : i.SEAT_NUMBER     === null ? "" : i.SEAT_NUMBER,
                    is_booked           : i.IS_BOOKED       === 1,
                    flight_id           : i.FLIGHT_ID       === null ? -1 : i.TICKET_ID,
                    email               : i.EMAIL           === null ? "" : i.TICKET_ID,
                    customer_name       : i.CUS_NAME        === null ? "" : i.TICKET_ID,
                    price_economy_class : i.PRICE_ECONOMY   === null ? 0 : i.TICKET_ID,
                    price_premium_class : i.PRICE_PREMIUM   === null ? 0 : i.TICKET_ID,
                    price_business_class: i.PRICE_BUSINESS  === null ? 0 : i.TICKET_ID,
                    price_first_class   : i.PRICE_FIRST     === null ? 0 : i.TICKET_ID,
                    start_time          : i.START_DATE      === null ? "" : moment(i.START_DATE, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss"),
                    to_time             : i.TO_DATE         === null ? "" : moment(i.TO_DATE, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss")
                });
            }
            SuccessResp(resp, respResult);
        } else {
            RespCustomCode(resp, result.code, result.msg);
        }
    } catch (e) {
        CatchErr(resp, e, "SearchTicket - ticket.js");
    }
}

exports.SearchTicketNew = (req, resp) => {
    const reqData = req.body;
    try {
        const from_id       = GetNumber(reqData, "from_id");
        const to_id         = GetNumber(reqData, "to_id");
        const start_date    = GetString(reqData, "start_date");
        const end_date      = GetString(reqData, "end_date", false);
        
        if (start_date !== '' && !moment(start_date, "DD/MM/YYYY").isValid()) {
            RespCustomCode(resp,900, "'start_date' phải là định dạng 'DD/MM/YYYY'");
            return;
        }

        if (end_date !== '' && !moment(end_date, "DD/MM/YYYY").isValid()) {
            RespCustomCode(resp,900, "'end_date' phải là định dạng 'DD/MM/YYYY'");
            return;
        }

        start_date  = moment(start_date, "DD/MM/YYYY").format("DD/MM/YYYY");
        end_date    = moment(end_date, "DD/MM/YYYY").format("DD/MM/YYYY");

        const result = await SearchTicketNewDAO(from_id, to_id, start_date, end_date);
        if (result.code === 200) {

        } else {

        }
    } catch(e) {
        CatchErr(resp, e, "SearchTicketNew - ticket.js");
    }
}