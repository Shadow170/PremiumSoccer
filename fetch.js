import axios from "axios";
import client from "./backend/common/redis.js";
import dotenv from 'dotenv';
dotenv.config();
import { Emitter } from "@socket.io/redis-emitter";
import zlib from "zlib";
import msgpack from "msgpack-lite";
const io = new Emitter(client);

const axiosApi = axios.create({ timeout: 2000 });

const getActiveMatches = async () => {
    try {

        const eventIds = (await client.keys('Fancy-*-p')).map(key => {
            const match = key.match(/^Fancy-(-?\d+)-p$/);
            return match ? match[1] : null;
        }).filter(Boolean).join(',');

        if (!eventIds) {
            return;
        }
        const { data } = await axiosApi.get(`${process.env.MAIN_REDIS}${eventIds}`);
        await client.set('ACTIVE_MATCHES', JSON.stringify(data));
    } catch (error) {
        console.error("getActiveMatches failed:", error.message);

        if (error.response) {
            console.error(error.response.status, error.response.data);
        }
    }
}

const fetchMatches = async () => {
    try {
        const resp = await client.keys('Fancy-*-p');
        if (resp) {
            const mdata = resp.map(dt => {
                const spl = dt.split('-');
                return spl.length > 3 ? '-' + spl[2] : spl[1];
            });

            for (const eventId of mdata) {
                getPS(eventId);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

const getPS = async (eventId) => {
    const premium = await Promise.allSettled([client.get('Fancy-' + eventId + '-p'), client.get('ACTIVE_MATCHES'), client.get('blocked')]);
    const dt = JSON.parse(premium[0]?.value);
    const lt = JSON.parse(premium[1]?.value)?.find(dt => dt.eventId == eventId);
    const blocked = JSON.parse(premium[2]?.value)?.map(dt => dt.toUpperCase()) || [];
    let events = {};
    if (lt) {
        events = { eventId: lt.eventId, status: lt.status, volumeCheck: lt.is_volume, markets: lt.markets }
    }

    if (dt) {
        const result = dt;
        if (result?.message) { //&& result?.message == "You have been logged off because you have logged on at another location."
            if (checkTimeDiff()) {
                time = new Date();
                await sendMessage(result?.message);
            }
        }
        const respon = {
            Type: 'Premium', events, data: {
                ...result, sportsBookMarket: result?.sportsBookMarket?.filter(dt => dt.apiSiteStatus == 'ACTIVE' && !blocked.some(
                    (tn) => {
                        return dt.marketName.toUpperCase().includes(tn);
                    }))
            }
        };

        io.to('room-PRMFancy/Auto/' + eventId).emit('PRMFancy/Auto/' + eventId, CompressData(respon));
    }
    else {
        const respon = { Type: 'Premium', events, data: [] };
        io.to('room-PRMFancy/Auto/' + eventId).emit('PRMFancy/Auto/' + eventId, CompressData(respon));
    }
}


const CompressData = (data) => {
    try {
        const packed = msgpack.encode(data);
        const compressed = zlib.deflateSync(packed);
        return compressed;
    } catch (error) {
        console.error("Compression failed:", error);
        return null;
    }
}

getActiveMatches();

const MInterval = setInterval(() => {
    getActiveMatches();
}, 1000 * 2);

setInterval(() => {
    fetchMatches();
}, 500);