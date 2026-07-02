import client from "../common/redis.js"


export const getPSFancyService = async(body) => {

        const eventId = body.eventId +'-p';

        const result = await client.get('Fancy-'+eventId);

}

export const premiumMatchingFancyService = async(body) => {
    const eventId = body.eventId +'-p';
    const sid = body.sid;

    const result = await client.get('Fancy-'+eventId);

    const lt = JSON.parse(await client.get('ACTIVE_MATCHES'))?.find(dt => dt.eventId == req.query.eventId);
}

