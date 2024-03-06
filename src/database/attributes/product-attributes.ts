export interface ColorAttribute {
    name: string;
};

export interface SizeAttribute {
    name: string;
};

export interface Category {
    name: string;
};

export interface Product {
    name: string;
    description: string;
    brand: string;
    price: number;
    is_published: boolean;
    times_bought: number;
    total_earnings: number;
};