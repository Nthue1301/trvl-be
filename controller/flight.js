const { CreateFlightDAO, DeleteFlightDAO, EditFlightDAO, GetFlightDAO } = require('../models/flight');
const { GetNumber, GetString, GetStringArray } = require('./../Utils/GetValue');
const moment = require("moment");
const { RespCustomCode, CatchErr } = require("./../Utils/UtilsFunction");

exports.CreateFlight = async function(req, resp) {
    let reqData = req.body;
    try {
        const geo_id_from       = GetNumber(reqData, "geo_id_from");
        const geo_id_to         = GetNumber(reqData, "geo_id_to");
        const price_economy     = GetNumber(reqData, "price_economy");
        const price_premium     = GetNumber(reqData, "price_premium");
        const price_business    = GetNumber(reqData, "price_business");
        const price_first       = GetNumber(reqData, "price_first");
        const plane_id          = GetNumber(reqData, "plane_id");
        const start_date        = GetString(reqData, "start_date");
        const to_date           = GetString(reqData, "to_date");
        const list_seat_number  = GetStringArray(reqData, "list_seat_number");

        if (!moment(start_date, "DD/MM/YYYY HH:mm:ss").isValid() || !moment(to_date, "DD/MM/YYYY HH:mm:ss").isValid()) {
            RespCustomCode(resp, 900, "'start_date' và 'to_date' phải theo định dạng 'DD/MM/YYYY HH:mm:ss'");
            return;
        }

        const result = await CreateFlightDAO(geo_id_from, geo_id_to, price_economy, price_premium, price_business, price_first, plane_id, moment(start_date, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"), moment(to_date, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"), list_seat_number);
        RespCustomCode(resp, result.code, result.msg);
    } catch (e) {
        console.log(e);
        CatchErr(resp, e, "CreateFlight - flight.js");
    }
}

exports.DeleteFlight = async function(req, resp) {
    let reqData = req.body;
    try {
        const flight_id   = GetNumber(reqData, "flight_id");
        const result      = await DeleteFlightDAO(flight_id);
        RespCustomCode(resp, result.code, result.msg);
    } catch (e) {
        CatchErr(resp, e, "DeleteFlight - flight.js");
    }
}

exports.EditFlight = async function(req, resp) {
    let reqData = req.body;
    try {
        const flight_id     = GetNumber(reqData, "flight_id");
        const geo_id_from   = GetNumber(reqData, "geo_id_from");
        const geo_id_to     = GetNumber(reqData, "geo_id_to");
        const price_economy = GetNumber(reqData, "price_economy");
        const price_premium = GetNumber(reqData, "price_premium");
        const price_business= GetNumber(reqData, "price_business");
        const price_first   = GetNumber(reqData, "price_first");
        const plane_id      = GetNumber(reqData, "plane_id");
        const start_date    = GetNumber(reqData, "start_date");
        const to_date       = GetNumber(reqData, "to_date");

        if (!moment(start_date, "DD/MM/YYYY HH:mm:ss").isValid() || !moment(to_date, "DD/MM/YYYY HH:mm:ss").isValid()) {
            RespCustomCode(resp, 900, "'start_date' và 'to_date' phải theo định dạng 'DD/MM/YYYY HH:mm:ss'");
            return;
        }
        const result      = await EditFlightDAO(flight_id, geo_id_from, geo_id_to, price_economy, price_premium, price_business, price_first, plane_id, moment(start_date, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"), moment(to_date, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));
        RespCustomCode(resp, result.code, result.msg);
    } catch (e) {
        CatchErr(resp, e, "EditFlight - flight.js");
    }
}

exports.GetFlight = async function(req, resp) {
    let reqData = req.body;
    try {
        const result    = await GetFlightDAO();
        let respResult  = [];
        if (result.code === 200) {
            for (let i of result.msg) {
                respResult.push({
                    flight_id: i.FLIGHT_ID,
                    price_economy_class: i.PRICE_ECONOMY,
                    price_premium_class: i.PRICE_PREMIUM,
                    price_business_class: i.PRICE_BUSINESS,
                    price_first_class: i.PRICE_FIRST,
                    start: {
                        start_time      : i.START_DATE      === null ? "" : moment(i.START_DATE, "DD/MM/YYYY HH:mm:ss"),
                        geo_id          : i.GEO_ID          === null ? -1 : i.GEO_ID,
                        province_id     : i.PROVINCE_ID     === null ? -1 : i.PROVINCE_ID,
                        ward_id         : i.WARD_ID         === null ? -1 : i.WARD_ID,
                        district_id     : i.DISTRICT_ID     === null ? -1 : i.DISTRICT_ID,
                        province_name   : i.PROVINCE_NAME   === null ? "" : i.PROVINCE_NAME,
                        ward_name       : i.WARD_NAME       === null ? "" : i.WARD_NAME,
                        district_name   : i.DISTRICT_NAME   === null ? "" : i.DISTRICT_NAME
                    },
                    to: {
                        start_time      : i.TO_DATE          === null ? "" : moment(i.TO_DATE, "DD/MM/YYYY HH:mm:ss"),
                        geo_id          : i.GEO_ID_1         === null ? -1 : i.GEO_ID_1,
                        province_id     : i.PROVINCE_ID_1    === null ? -1 : i.PROVINCE_ID_1,
                        ward_id         : i.WARD_ID_1        === null ? -1 : i.WARD_ID_1,
                        district_id     : i.DISTRICT_ID_1    === null ? -1 : i.DISTRICT_ID_1,
                        province_name   : i.PROVINCE_NAME_1  === null ? "" : i.PROVINCE_NAME_1,
                        ward_name       : i.WARD_NAME_1      === null ? "" : i.WARD_NAME_1,
                        district_name   : i.DISTRICT_NAME_1  === null ? "" : i.DISTRICT_NAME_1
                    }
                });
            }
            SuccessResp(resp, respResult);
        } else {
            RespCustomCode(resp, result.code, result.msg);
        }
    } catch (e) {
        CatchErr(resp, e, "GetFlight - flight.js");
    }
}