const mysql = require("mysql");
const { query } = require('./../Utils/DB_connection');
const { DB_RESP } = require('./../Utils/UtilsFunction');

exports.CreateTicketDAO = async function(ticket_id, email, customer_name) {
    try {
        let SQL = "SELECT IS_BOOKED FROM TICKET WHERE TICKET_ID = ?";
        const r1 = await query(mysql.format(SQL, [ticket_id]));
        if (r1.length === 0) {
            return DB_RESP(900, "'ticket_id' này không tồn tại!");
        } else {
            if (r1[0].IS_BOOKED === 1) {
                return DB_RESP(900, "Vé này đã được đặt bởi khách hàng khác!");
            } else {
                SQL = "UPDATE TICKET SET IS_BOOKED = 1, EMAIL = ?, CUS_NAME = ? WHERE TICKET_ID = ?";
                await query(mysql.format(SQL, [email, customer_name, ticket_id]));
                // SQL = "SELECT * FROM TICKET a JOIN FLIGHT b ON a.FLIGHT_ID = b.FLIGHT_ID WHERE a.TICKET_ID = ?";
                // const r2 = await query(mysql.format(SQL, [ticket_id]));
                // let t = CREATE_TRANSPORTER();
                // t.sendMail({
                //     from: process.env.EMAIL,
                //     to: email,
                //     subject: "THÔNG BÁO",
                //     html: `<p>Quý khách vừa đặt thành công vé máy bay. Ghế ngồi của quý khách là <b>${r2[0].SEAT_NUMBER}</b> và khởi hành lúc ${moment(r2[0].START_DATE, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss")}. Thời gian dự kiến đến là ${moment(r2[0].TO_DATE, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss")}. Chúc quý khách có một chuyến đi bình an và vui vẻ!</p>`
                // });
                return DB_RESP(200, "Thành công");
            }
        }
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.CancelTicketDAO = async function(ticket_id) {
    try {
        let SQL = "UPDATE TICKET SET IS_BOOKED = 0, EMAIL = NULL, CUS_NAME = NULL WHERE TICKET_ID = ?";
        await query(mysql.format(SQL, [ticket_id]));
        return DB_RESP(200, "Thành công");
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.EditTicketDAO = async function(ticket_id, email, cus_name, is_booked) {
    try {
        let SQL = "UPDATE TICKET SET IS_BOOKED = ?, EMAIL = ?, CUS_NAME = ? WHERE TICKET_ID = ?";
        await query(mysql.format(SQL, [is_booked, email, cus_name, ticket_id]));
        return DB_RESP(200, "Thành công");
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.GetTicketDAO = async function() {
    try {
        let SQL         = "SELECT * FROM TICKET a JOIN FLIGHT b ON a.FLIGHT_ID = b.FLIGHT_ID";
        const result    = await query(mysql.format(SQL));
        return DB_RESP(200, result);
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.SearchTicketDAO = async(plane_info, price_from, price_to, start_date, location_name) => {
    try {
        let arrSQL = [];
        let SQL = "SELECT DISTINCT * FROM TICKET a, FLIGHT b, GEOGRAPHY c, (SELECT GEO_ID AS GEO_ID_1, PROVINCE_ID AS PROVINCE_ID_1, DISTRICT_ID AS DISTRICT_ID_1, WARD_ID AS WARD_ID_1, PROVINCE_NAME AS PROVINCE_NAME_1, DISTRICT_NAME AS DISTRICT_NAME_1, WARD_NAME AS WARD_NAME_1 FROM geography) d, PLANE e WHERE a.FLIGHT_ID = b.FLIGHT_ID AND b.GEO_ID_FROM = c.GEO_ID AND b.GEO_ID_TO = d.GEO_ID_1 AND e.PLANE_ID = b.PLANE_ID AND a.IS_BOOKED = 0";
        if (plane_info !== '') {
            SQl += " AND (PLANE_TYPE LIKE ? OR PLANE_NAME LIKE ?)";
            arrSQL.push(`%${plane_info}%`);
            arrSQL.push(`%${plane_info}%`);
        }

        if (price_from > 0 || price_to > 0) {
            SQL += " AND (PRICE_ECONOMY <= ? AND PRICE_ECONOMY >= ?) OR (PRICE_PREMIUM <= ? AND PRICE_PREMIUM >= ?) OR (PRICE_BUSINESS <= ? AND PRICE_BUSINESS >= ?) OR (PRICE_FIRST <= ? AND PRICE_FIRST >= ?)";
            arrSQL.push(price_from);
            arrSQL.push(price_to);
            arrSQL.push(price_from);
            arrSQL.push(price_to);
            arrSQL.push(price_from);
            arrSQL.push(price_to);
            arrSQL.push(price_from);
            arrSQL.push(price_to);
        }

        if (start_date !== '') {
            //str_to_date: https://www.w3schools.com/sql/func_mysql_str_to_date.asp
            SQL += " AND str_to_date(?, '%d/%m/%Y %H:%i:%S') >= START_DATE AND str_to_date(?, '%d/%m/%Y %H:%i:%S') >= TO_DATE";
            arrSQL.push(start_date);
            arrSQL.push(start_date);
        }

        if (location_name !== '') {
            SQL += " AND (WARD_NAME LIKE ? OR PROVINCE_NAME LIKE ? OR DISTRICT_NAME LIKE ? OR WARD_NAME_1 LIKE ? OR PROVINCE_NAME_1 LIKE ? OR DISTRICT_NAME_1 LIKE ?)";
            arrSQL.push(`%${location_name}%`);
            arrSQL.push(`%${location_name}%`);
            arrSQL.push(`%${location_name}%`);
            arrSQL.push(`%${location_name}%`);
            arrSQL.push(`%${location_name}%`);
            arrSQL.push(`%${location_name}%`);
        }
        const result = await query(mysql.format(SQL, arrSQL));
        return DB_RESP(200, result);
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.SearchTicketNewDAO = async (from_id, to_id, start_date, end_date) => {
    try {
        let SQL, SQL1;
        if (end_date === '') {
            SQL = "select * from flight a, brand b, plane c where a.START_DATE >= str_to_date(?, '%d/%m/%Y %H:%i:%S') AND a.START_DATE <= str_to_date(?, '%d/%m/%Y %H:%i:%S') and a.GEO_ID_FROM = ? and a.GEO_ID_TO = ?  AND a.PLANE_ID = c.PLANE_ID AND c.BRAND_ID = b.BRAN_ID";
            const result = await query(mysql.format(SQL, [`${start_date} 00:00:00`, `${start_date} 23:59:59`, from_id, to_id]));
            return DB_RESP(200, {
                oneWayFlight: result,
                returnFLight: []
            });
        } else {
            SQL = `select * from flight a, brand b, plane c where a.START_DATE >= str_to_date(?, '%d/%m/%Y %H:%i:%S') AND a.START_DATE <= str_to_date(?, '%d/%m/%Y %H:%i:%S') AND a.GEO_ID_FROM = ? AND a.GEO_ID_TO = ?  AND a.PLANE_ID = c.PLANE_ID AND c.BRAND_ID = b.BRAN_ID`;
            SQL1 = `SELECT * FROM flight a, brand b, plane c WHERE a.TO_DATE >= str_to_date(?, '%d/%m/%Y %H:%i:%S') AND a.TO_DATE <= str_to_date(?, '%d/%m/%Y %H:%i:%S') AND a.GEO_ID_FROM = ? AND a.GEO_ID_TO = ?  AND a.PLANE_ID = c.PLANE_ID AND c.BRAND_ID = b.BRAN_ID`;
            const result = await query(mysql.format(SQL, [`${start_date} 00:00:00`, `${start_date} 23:59:59`, from_id, to_id]));
            const result1 = await query(mysql.format(SQL1, [`${end_date} 00:00:00`, `${end_date} 23:59:59`, to_id, from_id]));
            return DB_RESP(200, {
                oneWayFlight: result,
                returnFLight: result1
            });
        }
    } catch (e) {
        return DB_RESP(900, e);
    }
}

exports.BookTicketDAO = async(uid, flight_id, email, phone_number, address, passengers) => {
    try {
        const totalPassenger = passengers.length;
        let SQL = "SELECT * FROM TICKET WHERE FLIGHT_ID = ? AND UID_BOOKED = 0";
        const r = await query(mysql.format(SQL, [flight_id]));
        if (r.length < totalPassenger) {
            console.log("FAIL");
            return DB_RESP(900, "Số ghế trống không còn đủ!");
        } else {
            console.log("OK");
            SQL = "SELECT TICKET_ID FROM TICKET WHERE FLIGHT_ID = ? AND UID_BOOKED = 0 LIMIT ?";
            const r1 = await query(mysql.format(SQL, [flight_id, totalPassenger]));
            console.log(r1);
            SQL = "UPDATE TICKET SET UID_BOOKED = ?, EMAIL = ?, CUS_NAME = ?, PHONE = ?, ADDRESS = ?, STATE = ? WHERE TICKET_ID = ?";
            let ListPendingQuery = [];
            r1.map(function(i, index) {
                const f = query(mysql.format(SQL, [uid, email, passengers[index].cus_name, phone_number, address, passengers[index].type_of_passenger, i.TICKET_ID]));
                ListPendingQuery.push(f);
            });
            await Promise.all(ListPendingQuery);
            return DB_RESP(200, "");
        }
    } catch (e) {
        return DB_RESP(900, e);
    }
}