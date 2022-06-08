const { CreateBrandDAO, DeleteBrandDAO, EditBrandDAO, GetBrandDAO } = require('../models/brand');
const { GetNumber, GetString } = require('./../Utils/GetValue');
const moment = require("moment");
const { RespCustomCode } = require("./../Utils/UtilsFunction");

exports.CreateBrand = async function(req, resp) {
    let reqData = req.body;
    try {
        const brand_name    = GetString(reqData, "brand_name").toUpperCase();
        const result        = await CreateBrandDAO(brand_name);
        RespCustomCode(resp, result.code, result.msg);
    } catch (e) {
        CatchErr(resp, e, "CreateBrand - TicketController.js");
    }
}

exports.DeleteBrand = async function(req, resp) {
    let reqData = req.body;
    try {
        const brand_id    = GetNumber(reqData, "brand_id");
        const result      = await DeleteBrandDAO(brand_id);
        RespCustomCode(resp, result.code, result.msg);
    } catch (e) {
        CatchErr(resp, e, "DeleteBrand - TicketController.js");
    }
}

exports.EditBrand = async function(req, resp) {
    let reqData = req.body;
    try {
        const brand_id    = GetNumber(reqData, "brand_id");
        const brand_name  = GetString(reqData, "brand_name");
        const result      = await EditBrandDAO(brand_id, brand_name);
        RespCustomCode(resp, result.code, result.msg);
    } catch (e) {
        CatchErr(resp, e, "EditBrand - TicketController.js");
    }
}

exports.GetBrand = async function(req, resp) {
    let reqData = req.body;
    try {
        const result    = await GetBrandDAO();
        let respResult  = [];
        if (result.code === 200) {
            for (let i of result.msg) {
                respResult.push({
                   brand_id     : i.BRAN_ID     === null ? -1 : i.BRAN_ID,
                   brand_name   : i.BRAND_NAME  === null ? "" : i.BRAND_NAME
                });
            }
            SuccessResp(resp, respResult);
        } else {
            RespCustomCode(resp, result.code, result.msg);
        }
    } catch (e) {
        CatchErr(resp, e, "GetBrand - TicketController.js");
    }
}