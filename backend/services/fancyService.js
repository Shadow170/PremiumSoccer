import client from "../common/redis.js"


export const getPSFancyService = async ({eventId}) => {

    const premiumEventId = `${eventId}-p`;


    const redisData = await client.get(`Fancy-${premiumEventId}`);

    if(!redisData)
    {
         return {
            status: 0,
            message: "Not Found!",
            result: []
        };
    }

    // let data
    // if (result) {
    //     const result_data = { eventP: body.eventId + '-premium', eventId: body.eventId, provider: 'premium', data: result }

    //     data = {
    //         message: 'Fancy Fetched!',
    //         result: result_data,
    //         status: 1
    //     }
    // }
    // else {
    //     data = {
    //         message: 'Not Found!',
    //         result: [],
    //         status: 0
    //     }
    // }

    return {
        status: 1,
        message: "Fancy Fetched!",
        result: {
            eventId,
            eventP: `${eventId}-premium`,
            provider: "premium",
            data: redisData
        }
    }
   
}

export const premiumMatchingFancyService = async (body) => {
    const eventId = body.eventId + '-p';
    const sid = body.sid;
    const result = await client.get('Fancy-' + eventId);
   
    const lt = JSON.parse(await client.get('ACTIVE_MATCHES'))?.find(dt => dt.eventId == body.eventId);
    let events = {};

    let result_data;
    if (lt) {
        events = { eventId: lt.eventId, status: lt.status, volumeCheck: lt.is_volume, markets: lt.markets }
    }

    if (result) {
        const response = JSON.parse(result)?.sportsBookMarket?.filter(dt => String(dt.id) === String(sid)) || [];
        let nresult = { eventP: body.eventId + '-premium', eventId: body.eventId, provider: 'premium', data: response };

        result_data = {
            message: 'Fancy Fetched!',
            result: nresult,
            status: 1,
            events
        }
    }
    else {
        result_data = {
            message: 'Not Found!',
            result: [],
            status: 0,
            events
        }
    }

    return result_data;
}

export const updateDisableSettingService = async (body) => {
    const { fancy, status } = body;

    const resp = JSON.parse(await client.get('blocked')) || [];

    let allData = [];
    if (status == 'remove') {
        allData = resp.filter(dt => dt != fancy);
    }
    else {
        allData = [...resp, fancy];
    }

    const newRes = [...new Set(allData)];
    await client.set('blocked', JSON.stringify(newRes));

    return {
        message: 'updated'
    }
}

export const getDisableSettingService = async (body) => {
    const data = JSON.parse(await client.get('blocked')) || [];

    return data;
}

export const getPremiumFancyService = async (body) => {
    const eventId = body.eventId;
    const data = JSON.parse(await client.get('Fancy-' + eventId + '-p')) || [];

    return data;
}

export const getPFancyService = async (body) => {
    const premium = await Promise.allSettled([client.get('Fancy-' + body.eventId + '-p'), client.get('ACTIVE_MATCHES'), client.get('blocked')]);
    const dt = JSON.parse(premium[0]?.value);
    const lt = JSON.parse(premium[1]?.value)?.find(dt => dt.eventId == eventId);
    const blocked = JSON.parse(premium[2]?.value)?.map(dt => dt.toUpperCase()) || [];
    let events = {};
    if (lt) {
        events = { eventId: lt.eventId, status: lt.status, volumeCheck: lt.is_volume, markets: lt.markets }
    }

    if (dt) {
        const result = dt;
        return {
            Type: 'Premium', events, data: {
                ...result, sportsBookMarket: result?.sportsBookMarket?.filter(dt => dt.apiSiteStatus == 'ACTIVE' && !blocked.some(
                    (tn) => {
                        return dt.marketName.toUpperCase().includes(tn);
                    }))
            }
        };
    }
    else {
        return { Type: 'Premium', events, data: [] };
    }
}