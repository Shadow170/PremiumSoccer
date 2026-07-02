import axios from "axios";
import client from "./backend/common/redis.js";
import dotenv from 'dotenv';
dotenv.config();

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
        console.log('here', data)
        await client.set('ACTIVE_MATCHES', JSON.stringify(data));
    } catch (error) {
        console.error("getActiveMatches failed:", error.message);

        if (error.response) {
            console.error(error.response.status, error.response.data);
        }
    }
}

const MInterval = setInterval(() => {

    getActiveMatches();
}, 1000 * 2);


getActiveMatches()