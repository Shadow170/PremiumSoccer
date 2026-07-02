import * as fancyService from "../services/fancyService.js";

export const getPSFancy = async(req,res) => {
    try {
        const result = await fancyService.getPSFancyService(req.query);
    } catch (error) {
        
        console.log('getPSFancy',error)
    }
}

export const premiumMatchingFancy = async(req,res) =>{
    try {
        const result = await fancyService.premiumMatchingFancyService(req.query);
    } catch (error) {
        console.log('premiumMatchingFancy',error)
    }
}

export const updateDisableSetting = async(req,res) => {
    try {
        const result = await fancyService.updateDisableSettingService(req.query);
    } catch (error) {
        console.log('updateDisableSetting',error)
    }
}

export const getDisableSetting = async(req,res) =>{
    try {
        const result = await fancyService.getDisableSettingService(req.query);
    } catch (error) {
        console.log('getDisableSetting',error)
    }
}

export const getPremiumFancy = async(req,res) =>{
    try {
        const result = await fancyService.getPremiumFancyService(req.query);
    } catch (error) {
        console.log('getPremiumFancy',error)
    }
}