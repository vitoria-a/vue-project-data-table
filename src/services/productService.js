import axios from 'axios';

const baseURL =  'http://localhost:8080/api/v1/products';

export function getAllProducts() {
    return axios.get(baseURL);
};

export function postProduct(product) {
    return axios.post(baseURL, product);
}