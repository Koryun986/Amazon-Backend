import {Category} from "../database/models/category";

type CategoryTreeItem = {
    id: number;
    name: string;
    children: CategoryTreeItem[];
};

class CategoryService {
    async getCategories() {
        const categoryEntities = await Category.findAll();
        if (!categoryEntities) {
            return [];
        }
        return this.getCategoriesStructured(categoryEntities);
    }

    async createCategory(category: Omit<Category, "id">) {
        const isCategoryExist = await Category.findOne({where: {name: category.name}});
        if (isCategoryExist) {
            throw new Error("Category with this name already exists");
        }
        const categoryEntity = await Category.create({...category, parent_id: category.parent_id ? category.parent_id: null});
        await categoryEntity.save();
        return categoryEntity;
    }

    async updateCategory(category: Category) {
        const categoryEntity = await Category.findByPk(category.id);
        if (!categoryEntity) {
            throw new Error("Category with this id doesn't exist");
        }
        await categoryEntity.update(category);
        await categoryEntity.save();
        return categoryEntity;
    }

    private getCategoriesStructured(categoryEntities: Category[]) {
        const categoryMap: { [id: number]: CategoryTreeItem } = {};
        const rootCategories: CategoryTreeItem[] = [];

        categoryEntities.forEach(category => {
            const categoryItem = this.getCategoryTreeItemFromEntity(category);
            categoryMap[category.id] = categoryItem;
            if (category.parent_id === null) {
                rootCategories.push(categoryItem);
            } else {
                const parentCategory = categoryMap[category.parent_id];
                if (parentCategory) {
                    if (!parentCategory.children) {
                        parentCategory.children = [];
                    }
                    parentCategory.children.push(categoryItem);
                }
            }
        });

        return rootCategories;
    }

    private getCategoryTreeItemFromEntity(category: Category): CategoryTreeItem {
        return {
            id: category.id,
            name: category.name,
            children: []
        };
    }
}

export default new CategoryService();