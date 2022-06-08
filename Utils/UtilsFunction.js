const nodemailer = require("nodemailer");
const {GetString} = require("./GetValue");
const {query} = require("./DB_connection");
const mysql = require("mysql");

const IMAGE_PATH    = "assets/image";
exports.IMAGE_PATH  = IMAGE_PATH;

const RespCustomCode = (resp, code, data) => {
    resp.statusCode = 200;
    resp.json({
        "code": code,
        "msg": data
    });
}

const CatchErr = (resp, e, func_name) => {
    console.log(`======================== ${func_name} ==========================`);
    if (!!e.message) {
        RespCustomCode(resp, 900, e.message);
    } else if (!!e.sqlMessage) {
        RespCustomCode(resp, 900, e.sqlMessage);
    }
}

const DB_RESP = (code, data) => {
    return {
        "code": code,
        "msg": data
    }
}

exports.DB_RESP         = DB_RESP;
exports.RespCustomCode  = RespCustomCode;
exports.CatchErr        = CatchErr;

exports.SuccessResp = (resp, data) => {
    if (data === undefined) {
        RespCustomCode(resp, 200, "Thành công");
    } else {
        RespCustomCode(resp, 200, data);
    }
}

exports.CREATE_TRANSPORTER = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
}

exports.CheckSessionID = async (req, resp, next) => {
    let reqData = req.body;
    try {
        let ssid = GetString(reqData, "ssid");
        let SQL_QUERY   = "SELECT a.UID, a.USERNAME, a.EMAIL, a.IS_ADMIN FROM USER a JOIN USER_SESSION b ON a.UID = b.UID WHERE b.SESSION = ?";
        let result      = await query(mysql.format(SQL_QUERY, [ssid]));
        if (result.length === 0) {
            resp.statusCode = 200;
            resp.json({
                "code": 201,
                "msg": "Người dùng chưa đăng nhập"
            });
        } else {
            reqData.request_by      = result[0].USERNAME;
            reqData.request_uid     = result[0].UID;
            reqData.request_email   = result[0].EMAIL;
            reqData.is_admin        = result[0].IS_ADMIN === 1 ? true : false;
            next();
        }
    } catch (e) {
        CatchErr(resp, e, "CheckSessionID - UtilsFunction.js")
    }
}

exports.CheckSessionIDForMultiparty = async (req, ssid) => {
    let reqData = req.body;
    try {
        let SQL_QUERY = "SELECT a.UID, a.USERNAME, a.EMAIL, a.IS_ADMIN FROM USER a JOIN USER_SESSION b ON a.UID = b.UID WHERE b.SESSION = ?";
        let result = await query(mysql.format(SQL_QUERY, [ssid]));
        if (result.length === 0) {
            return DB_RESP(201, "Người dùng chưa đăng nhập");
        } else {
            reqData.request_by      = result[0].USERNAME;
            reqData.request_uid     = result[0].UID;
            reqData.request_email   = result[0].EMAIL;
            reqData.is_admin        = result[0].IS_ADMIN === 1 ? true : false;
            return DB_RESP(200, "");
        }
    } catch (e) {
        return DB_RESP(900, e);
    }
}

const PORT  = process.env.SV_PORT || 8080;
const ip    = require("ip");

exports.HOST_PORT       = PORT;
exports.HOST_ADDRESS    = `${ip.address()}:${PORT}/`;