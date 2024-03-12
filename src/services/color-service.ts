import {Color} from "../database/models/color";
import {Size} from "../database/models/size";

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

    async updateColor(color: Color) {
        const colorEntity = await Color.findByPk(color.id);
        if (!colorEntity) {
            throw new Error("Color with this id doesn't exist");
        }
        colorEntity.name = color.name;
        await colorEntity.save();
        return colorEntity;
    }
}

export default new ColorService();