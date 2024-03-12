import {Color} from "../database/models/color";

class ColorService {
    async getColors() {
        const colorEntities = await Color.findAll();
        if (!colorEntities) {
            return [];
        }
        return colorEntities;
    }

    async createColor(name: string) {
        const ifExist = await Color.findOne({where: {name}});
        if (ifExist) {
            throw new Error("Color with this name already exists");
        }
        const colorEntity = await Color.create({name});
        await colorEntity.save();
        return colorEntity;
    }
}

export default new ColorService();