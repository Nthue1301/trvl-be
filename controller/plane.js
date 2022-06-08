const { GetNumber, GetString } = require('./../Utils/GetValue');
const { CreatePlaneDAO, DeletePlaneDAO, EditPlaneDAO, GetPlaneDAO } = require("./../models/plane");
const { RespCustomCode } = require("./../Utils/UtilsFunction");

exports.CreatePlane = async function(req, resp) {
    let reqData = req.body;
    try {
        const brand_id      = GetNumber(reqData, "brand_id");
        const plane_type    = GetString(reqData, "plane_type").toUpperCase();
        const plane_name    = GetString(reqData, "plane_name").toUpperCase();
        const result        = await CreatePlaneDAO(brand_id, plane_type, plane_name);
        RespCustomCode(resp, result.code, result.msg);
    } catch (e) {
        CatchErr(resp, e, "CreatePlane - TicketController.js");
    }
}

exports.DeletePlane = async function(req, resp) {
    let reqData = req.body;
    try {
        const plane_id    = GetNumber(reqData, "plane_id");
        const result      = await DeletePlaneDAO(plane_id);
        RespCustomCode(resp, result.code, result.msg);
    } catch (e) {
        CatchErr(resp, e, "DeletePlane - TicketController.js");
    }
}

exports.EditPlane = async function(req, resp) {
    let reqData = req.body;
    try {
        const plane_id    = GetNumber(reqData, "plane_id");
        const plane_type  = GetString(reqData, "plane_type");
        const plane_name  = GetString(reqData, "plane_name");
        const result      = await EditPlaneDAO(plane_id, plane_type, plane_name);
        RespCustomCode(resp, result.code, result.msg);
    } catch (e) {
        CatchErr(resp, e, "EditPlane - TicketController.js");
    }
}

exports.GetPlane = async function(req, resp) {
    let reqData = req.body;
    try {
        const result    = await GetPlaneDAO();
        let respResult  = [];
        if (result.code === 200) {
            for (let i of result.msg) {
                respResult.push({
                    brand_id    : i.BRAND_ID    === null ? -1 : i.BRAND_ID,
                    brand_name  : i.BRAND_NAME  === null ? "" : i.BRAND_NAME,
                    plane_id    : i.PLANE_ID    === null ? -1 : i.PLANE_ID,
                    plane_type  : i.PLANE_TYPE  === null ? "" : i.PLANE_TYPE,
                    plane_name  : i.PLANE_NAME  === null ? "" : i.PLANE_NAME
                });
            }
            SuccessResp(resp, respResult);
        } else {
            RespCustomCode(resp, result.code, result.msg);
        }
    } catch (e) {
        CatchErr(resp, e, "GetPlane - TicketController.js");
    }
}