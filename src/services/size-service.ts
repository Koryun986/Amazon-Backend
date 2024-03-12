import {Size} from "../database/models/size";

class SizeService {
    async getSizes() {
        const sizeEntities = await Size.findAll();
        if (!sizeEntities) {
            return [];
        }
        return sizeEntities;
    }
}

export default new SizeService();