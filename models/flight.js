const mysql = require("mysql");
const { query } = require('./../Utils/DB_connection');
const { DB_RESP } = require('./../Utils/UtilsFunction');

exports.CreateFlightDAO = async function(geo_id_from, geo_id_to, price_economy, price_premium, price_business, price_first, plane_id, start_date, to_date, list_seat_number) {
    try {
        let SQL = "SELECT * FROM FLIGHT WHERE PLANE_ID = ? AND (START_DATE >= ? AND START_DATE <= ? AND TO_DATE >= ?) OR (START_DATE <= ? AND TO_DATE <= ?) OR (TO_DATE >= ? AND TO_DATE <= ? AND START_DATE <= ?)";
        const r1 = await query(mysql.format(SQL, [plane_id, start_date, to_date, to_date, start_date, to_date, start_date, to_date, start_date]));
        if (r1.length > 0) {
            return DB_RESP(900, "Máy bay có lịch trình bay trong khoảng thời gian này!");
        } else {
            SQL = "INSERT INTO FLIGHT (GEO_ID_FROM, GEO_ID_TO, PRICE_ECONOMY, PRICE_PREMIUM, PRICE_BUSINESS, PRICE_FIRST, PLANE_ID, START_DATE, TO_DATE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            let {insertId} = await query(mysql.format(SQL, [geo_id_from, geo_id_to, price_economy, price_premium, price_business, price_first, plane_id, start_date, to_date]));
            SQL = "INSERT INTO TICKET (SEAT_NUMBER, FLIGHT_ID, IS_BOOKED) VALUES ?";
            let BindingValues = [];
            for (let i of list_seat_number) {
                console.log(i);
                BindingValues.push([i, insertId, 0]);
            }
            await query(mysql.format(SQL, [BindingValues]));
            return DB_RESP(200, "Thành công");
        }
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.DeleteFlightDAO = async function(flight_id) {
    try {
        let SQL     = "SELECT * FROM TICKET WHERE FLIGHT_ID = ? AND IS_BOOKED = 1";
        const r1    = await query(mysql.format(SQL, [flight_id]));
        if (r1.length > 0) {
            return DB_RESP(900, "Không thể xoá do chuyến bay này tồn tại vé đã có người đặt chỗ!");
        } else {
            SQL = "DELETE FROM FLIGHT WHERE FLIGHT_ID = ?";
            await query(mysql.format(SQL, [flight_id]));
            return DB_RESP(200, "Thành công");
        }
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.EditFlightDAO = async function(flight_id, geo_id_from, geo_id_to, price_economy, price_premium, price_business, price_first, plane_id, start_date, to_date) {
    try {
        let SQL = "SELECT * FROM FLIGHT WHERE PLANE_ID <> ? AND (START_DATE <= ? AND TO_DATE >= ?) OR (START_DATE >= ? AND TO_DATE <= ?) OR (START_DATE >= ? AND ? <= TO_DATE)";
        const r1 = await query(mysql.format(SQL, [plane_id, start_date, start_date, start_date, to_date, start_date, to_date]));
        console.log(r1);
        if (r1.length > 0) {
            return DB_RESP(900, "KHÔNG thể cập nhật do máy bay đã có lịch trình bay trong khoảng thời gian này!");
        } else {
            SQL = "UPDATE FLIGHT SET GEO_ID_FROM = ?, GEO_ID_TO = ?, PRICE_ECONOMY = ?, PRICE_PREMIUM = ?, PRICE_BUSINESS = ?, PRICE_FIRST = ?, PLANE_ID = ?, START_DATE = ?, TO_DATE = ? WHERE FLIGHT_ID = ?";
            await query(mysql.format(SQL, [geo_id_from, geo_id_to, price_economy, price_premium, price_business, price_first, plane_id, start_date, to_date, flight_id]));
            return DB_RESP(200, "Thành công");
        }
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.GetFlightDAO = async function() {
    try {
        let SQL         = "SELECT * FROM flight a JOIN geography b ON a.GEO_ID_FROM = b.GEO_ID JOIN (SELECT GEO_ID AS GEO_ID_1, PROVINCE_ID AS PROVINCE_ID_1, DISTRICT_ID AS DISTRICT_ID_1, WARD_ID AS WARD_ID_1, PROVINCE_NAME AS PROVINCE_NAME_1, DISTRICT_NAME AS DISTRICT_NAME_1, WARD_NAME AS WARD_NAME_1 FROM geography) c ON a.GEO_ID_TO = c.GEO_ID_1 JOIN plane d ON a.PLANE_ID = d.PLANE_ID";
        const result    = await query(mysql.format(SQL));
        return DB_RESP(200, result);
    } catch (e) {
        return DB_RESP(900, e);
    }
}