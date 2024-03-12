import {Color} from "../database/models/color";

class ColorService {
    async getColors() {
        const colorEntities = await Color.findAll();
        if (!colorEntities) {
            return [];
        }
        return colorEntities;
    }
}

export default new ColorService();