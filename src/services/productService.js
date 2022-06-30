import axios from 'axios';

const baseURL =  'http://localhost:8080/api/v1/products';

export function getAllProducts() {
    return axios.get(baseURL);
};

export function postProduct(product) {
    return axios.post(baseURL, product);
}

export function putProduct(id, product) {
    return axios.put(baseURL + `/${id}`, product);
}

export function deleteProduct(id) {
    return axios.delete(baseURL + `/${id}`);
}