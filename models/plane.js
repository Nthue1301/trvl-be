const mysql = require("mysql");
const { query } = require('./../Utils/DB_connection');
const { DB_RESP } = require('./../Utils/UtilsFunction');

exports.CreatePlaneDAO = async function(brand_id, plane_type, plane_name) {
    try {
        let SQL = "SELECT * FROM PLANE WHERE PLANE_TYPE = ? AND PLANE_NAME = ?";
        const r1 = await query(mysql.format(SQL, [plane_type, plane_name]));
        if (r1.length > 0) {
            return DB_RESP(900, "Loại máy bay này đã tồn tại");
        } else {
            SQL = "INSERT INTO PLANE (BRAND_ID, PLANE_TYPE, PLANE_NAME) VALUES (?, ?, ?)";
            await query(mysql.format(SQL, [brand_id, plane_type, plane_name]));
            return DB_RESP(200, "Thành công");
        }
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.DeletePlaneDAO = async function(plane_id) {
    try {
        let SQL     = "SELECT * FROM FLIGHT WHERE PLANE_ID = ?";
        const r1    = await query(mysql.format(SQL, [plane_id]));
        if (r1.length > 0) {
            return DB_RESP(900, "Không thể xoá do vẫn tồn tại các chuyến bay sử dụng máy bay này!");
        } else {
            SQL = "DELETE FROM PLANE WHERE PLANE_ID = ?";
            await query(mysql.format(SQL, [plane_id]));
            return DB_RESP(200, "Thành công");
        }
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.EditPlaneDAO = async function(plane_id, plane_type, plane_name) {
    try {
        let SQL = "UPDATE PLANE SET PLANE_TYPE = ?, PLANE_NAME = ? WHERE PLANE_ID = ?";
        await query(mysql.format(SQL, [plane_type, plane_name, plane_id]));
        return DB_RESP(200, "Thành công");
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.GetPlaneDAO = async function() {
    try {
        let SQL         = "SELECT * FROM PLANE a JOIN BRAND b ON a.BRAND_ID = b.BRAN_ID";
        const result    = await query(mysql.format(SQL));
        return DB_RESP(200, result);
    } catch (e) {
        return DB_RESP(900, e);
    }
}