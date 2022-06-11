const { CreateTicketDAO, CancelTicketDAO, EditTicketDAO, GetTicketDAO, SearchTicketDAO, SearchTicketNewDAO, BookTicketDAO } = require('../models/ticket');
const { GetNumber, GetString, GetJSONArray } = require('./../Utils/GetValue');
const moment = require("moment");
const { RespCustomCode, CatchErr, SuccessResp, DB_RESP } = require("./../Utils/UtilsFunction");

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

exports.SearchTicketNew = async(req, resp) => {
    const reqData = req.body;
    try {
        const from_id       = GetNumber(reqData, "from_id");
        const to_id         = GetNumber(reqData, "to_id");
        let start_date    = GetString(reqData, "start_date");
        let end_date      = GetString(reqData, "end_date", false);
        
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
        let oneWayFlight = [], returnFLight = [];

        if (result.code === 200) {
            for (let i of result.msg.oneWayFlight) {
                oneWayFlight.push({
                    flight_id: i.FLIGHT_ID,
                    geo_id_from: i.GEO_ID_FROM,
                    geo_id_to: i.GEO_ID_TO,
                    adult_price: i.ADULT_PRICE,
                    child_price: i.CHILD_PRICE,
                    baby_price: i.BABY_PRICE,
                    plane_id: i.PLANE_ID,
                    start_date: moment(i.START_DATE).format("DD/MM/YYYY"),
                    to_date: moment(i.TO_DATE).format("DD/MM/YYYY HH:mm:ss"),
                    brand_id: i.BRAND_ID,
                    brand_logo: i.BRAND_LOGO,
                    brand_name: i.BRAND_NAME,
                    brand_pre: i.BRAND_PRE
                });
            }
            for (let i of result.msg.returnFLight) {
                returnFLight.push({
                    flight_id: i.FLIGHT_ID,
                    geo_id_from: i.GEO_ID_FROM,
                    geo_id_to: i.GEO_ID_TO,
                    adult_price: i.ADULT_PRICE,
                    child_price: i.CHILD_PRICE,
                    baby_price: i.BABY_PRICE,
                    plane_id: i.PLANE_ID,
                    start_date: moment(i.START_DATE).format("DD/MM/YYYY"),
                    to_date: moment(i.TO_DATE).format("DD/MM/YYYY HH:mm:ss"),
                    brand_id: i.BRAND_ID,
                    brand_logo: i.BRAND_LOGO,
                    brand_name: i.BRAND_NAME,
                    brand_pre: i.BRAND_PRE
                });
            }
            SuccessResp(resp, {oneWayFlight, returnFLight});
        } else {
            RespCustomCode(resp, result.code, result.msg);
        }
    } catch(e) {
        CatchErr(resp, e, "SearchTicketNew - ticket.js");
    }
}

exports.BookTicket = async(req, resp) => {
    const reqData = req.body;
    try {
        const uid           = GetNumber(reqData, "uid");
        const flight_id     = GetNumber(reqData, "flight_id");
        const email         = GetString(reqData, "email");
        // const name          = GetString(reqData, "name");
        const phone_number  = GetString(reqData, "phone_number");
        const address       = GetString(reqData, "address");
        const passengers    = GetJSONArray(reqData, "passengers");
        // const num_of_adult  = GetNumber(reqData, "num_of_adult");
        // const num_of_child  = GetNumber(reqData, "num_of_child");
        // const num_of_baby   = GetNumber(reqData, "num_of_baby");

        if (passengers.length === 0) {
            RespCustomCode(resp, 900, "Phải có ít nhất một hành khách!");
            return;
        }

        for (const [index, i] of passengers.entries()) {
            if (!i.hasOwnProperty("type_of_passenger") || !i.hasOwnProperty("cus_name")) {
                RespCustomCode(resp, 900, `Phần tủ vị trí ${index} phải có thuộc tính 'type_of_passenger' và 'cus_name'`);
                return;
            }
        }

        const result = await BookTicketDAO(uid, flight_id, email, phone_number, address, passengers);
        if (result.code === 200) {
            SuccessResp(resp, "Đặt vé thành công");
        } else {
            RespCustomCode(resp, result.code, result.msg);
        }
    } catch(e) {
        CatchErr(resp, e, "BookTicket - ticket.js");
    }
}