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
        const ifExist = await Size.findOne({where: {name: size}});
        if (ifExist) {
            throw new Error("Size with this name already exists");
        }
        const sizeEntity = await Size.create({name: size});
        await sizeEntity.save();
        return sizeEntity;
    }

    async updateSize(size: Size) {
        const sizeEntity = await Size.findByPk(size.id);
        if (!sizeEntity) {
            throw new Error("Size with this id doesn't exist");
        }
        sizeEntity.name = size.name;
        await sizeEntity.save();
        return sizeEntity;
    }
}

export default new SizeService();