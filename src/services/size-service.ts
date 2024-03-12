import {Size} from "../database/models/size";

class SizeService {
    async getSizes() {
        const sizeEntities = await Size.findAll();
        if (!sizeEntities) {
            return [];
        }
        return sizeEntities;
    }

    async createSize(size: string) {
        const sizeEntity = await Size.create({name: size});
        await sizeEntity.save();
        return sizeEntity;
    }
}

export default new SizeService();