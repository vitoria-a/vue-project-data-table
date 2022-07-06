import axios from 'axios';

const baseURL =  'http://localhost:8080/api/v1/products';

export function getAllProducts(isActive) {
    return axios.get(baseURL + `?isActive=${isActive}`);
}

export function getProductId(id) {
    return axios.get(baseURL + `/${id}`);
}

export function postProduct(product) {
    return axios.post(baseURL, product);
}

export function putProduct(id, product) {
    return axios.put(baseURL + `/${id}`, product);
}

export function deleteProduct(id) {
    return axios.delete(baseURL + `/${id}`);
}

export function patchInactiveProductId(id) {
    return axios.patch(baseURL + `/${id}/inactive`);
}

export function patchActiveProductId(id) {
    return axios.patch(baseURL + `/${id}/active`);
}