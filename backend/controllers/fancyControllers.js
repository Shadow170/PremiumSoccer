import * as fancyService from "../services/fancyService.js";

export const getPSFancy = async(req,res) => {
    try {
        const result = await fancyService.getPSFancyService(req.query);

        res.status(200).json({...result});  
    } catch (error) {        
        console.log('getPSFancy',error)
        res.status(500).json({ message: error._message });
    }
}

export const premiumMatchingFancy = async(req,res) =>{
    try {
        const result = await fancyService.premiumMatchingFancyService(req.query);
        res.status(200).json({...result})
    } catch (error) {
        console.log('premiumMatchingFancy',error)
        res.status(500).json({ message: error._message });
    }
}

export const updateDisableSetting = async(req,res) => {
    try {
        const result = await fancyService.updateDisableSettingService(req.body);
        res.status(200).json({...result})
    } catch (error) {
        console.log('updateDisableSetting',error)
        res.status(500).json({ message: error._message });
    }
}

export const getDisableSetting = async(req,res) =>{
    try {
        const result = await fancyService.getDisableSettingService(req.body);
        res.status(200).json({...result})
    } catch (error) {
        console.log('getDisableSetting',error)
        res.status(500).json({ message: error._message });
    }
}

export const getPremiumFancy = async(req,res) =>{
    try {
        const result = await fancyService.getPremiumFancyService(req.query);
        res.status(200).json({...result})
    } catch (error) {
        console.log('getPremiumFancy',error)
        res.status(500).json({ message: error._message });
    }
}

export const getPFancy = async(req,res) => {
     try {
        const result = await fancyService.getPFancyService(req.query);
        res.status(200).json({...result})
    } catch (error) {
        console.log('getPFancy',error)
        res.status(500).json({ message: error._message });
    }
}