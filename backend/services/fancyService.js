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

export const premiumMatchingFancyService = async ({ eventId, sid }) => {
    const premiumEventId = `${eventId}-p`;

    const [fancyData, activeMatches] = await Promise.all([
        client.get(`Fancy-${premiumEventId}`),
        client.get("ACTIVE_MATCHES")
    ]);

    const match = activeMatches ? JSON.parse(activeMatches).find(item => item.eventId == eventId) : null;

    const events = match ? {
              eventId: match.eventId,
              status: match.status,
              volumeCheck: match.is_volume,
              markets: match.markets
          }
        : {};

    if (!fancyData) {
        return {
            status: 0,
            message: "Not Found!",
            result: [],
            events
        };
    }

    const sportsBookMarket =  JSON.parse(fancyData)?.sportsBookMarket ?? [];

    const response = sportsBookMarket.filter(market => String(market.id) === String(sid));

    return {
        status: 1,
        message: "Fancy Fetched!",
        result: {
            eventP: `${eventId}-premium`,
            eventId,
            provider: "premium",
            data: response
        },
        events
    };
};

export const updateDisableSettingService = async ({ fancy, status }) => {
    const blocked = JSON.parse(await client.get("blocked") || "[]");

    const blockedSet = new Set(blocked);

    if (status === "remove") {
        blockedSet.delete(fancy);
    } else {
        blockedSet.add(fancy);
    }

    await client.set("blocked", JSON.stringify([...blockedSet]));

    return {
        message: "Updated"
    };
};

export const getDisableSettingService = async (body) => {
    const data = JSON.parse(await client.get('blocked')) || [];

    return data;
}

export const getPremiumFancyService = async (body) => {
    const eventId = body.eventId;
    const data = JSON.parse(await client.get('Fancy-' + eventId + '-p')) || [];

    return data;
}

export const getPFancyService = async ({ eventId }) => {
    const [fancyData, activeMatches, blockedData] = await Promise.all([
        client.get(`Fancy-${eventId}-p`),
        client.get("ACTIVE_MATCHES"),
        client.get("blocked")
    ]);

    const fancy = fancyData ? JSON.parse(fancyData) : null;
    const matches = activeMatches ? JSON.parse(activeMatches) : [];
    const blocked = blockedData ? JSON.parse(blockedData).map(word => word.toUpperCase()) : [];

    const match = matches.find(item => item.eventId == eventId);

    const events = match
        ? {
              eventId: match.eventId,
              status: match.status,
              volumeCheck: match.is_volume,
              markets: match.markets
          }
        : {};

    if (!fancy) {
        return {
            Type: "Premium",
            events,
            data: []
        };
    }

    return {
        Type: "Premium",
        events,
        data: {
            ...fancy,
            sportsBookMarket: fancy.sportsBookMarket.filter(market => {
                if (market.apiSiteStatus !== "ACTIVE") return false;

                const marketName = market.marketName.toUpperCase();

                return !blocked.some(word => marketName.includes(word));
            })
        }
    };
};