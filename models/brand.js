const mysql = require("mysql");
const { query } = require('./../Utils/DB_connection');
const { DB_RESP } = require('./../Utils/UtilsFunction');

exports.CreateBrandDAO = async function(brand_name) {
    try {
        let SQL = "SELECT * FROM BRAND WHERE BRAND_NAME = ?";
        const r1 = await query(mysql.format(SQL, [brand_name]));
        if (r1.length > 0) {
            return DB_RESP(900, "Tên này đã tồn tại");
        } else {
            SQL         = "INSERT INTO BRAND (BRAND_NAME) VALUES (?)";
            await query(mysql.format(SQL, [brand_name]));
            return DB_RESP(200, "Thành công");
        }
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.DeleteBrandDAO = async function(brand_id) {
    try {
        let SQL = "DELETE FROM BRAND WHERE BRAN_ID = ?";
        await query(mysql.format(SQL, [brand_id]));
        return DB_RESP(200, "Thành công");
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.EditBrandDAO = async function(brand_id, brand_name) {
    try {
        let SQL = "UPDATE BRAND SET BRAND_NAME = ? WHERE BRAN_ID = ?";
        await query(mysql.format(SQL, [brand_name, brand_id]));
        return DB_RESP(200, "Thành công");
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.GetBrandDAO = async function() {
    try {
        let SQL         = "SELECT * FROM BRAND";
        const result    = await query(mysql.format(SQL));
        return DB_RESP(200, result);
    } catch (e) {
        return DB_RESP(900, e);
    }
}