export interface UserAttributes {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_verfied: boolean;
};

export interface AddressAttirbute {
    country: string;
    state: string;
    city: string;
    zip_code: string;
    street_address: string;
    is_default_address: boolean;
};