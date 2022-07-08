<template>
<div class="product-details">
  <h3> Product Details </h3>
    <Card>
      <template #header>
        <div>
          <router-link class="button-home" tag="Button" to="/">
            <i class="pi pi-home"/>
          </router-link>
          > Product Details
        </div>
      </template>
      <template #content>
        <p> Product ID: <strong>{{ product.id }}</strong></p>
        <p> Name: <strong>{{ product.name }}</strong></p>
        <p> Price: <strong>{{ product.price }}</strong></p>
        <p> Description: <strong>{{ product.description }}</strong></p>
        <p> Status: <strong>{{ this.status }}</strong></p>
        <p> Created Date: <strong>{{ product.createdDate }}</strong></p>
        <p> Updated Date: <strong>{{ product.updatedDate }}</strong></p>
      </template>  
    </Card>
  </div>
</template>

<script>

import { getProductId } from '../services/productService.js'
export default {
    name: 'ProductDetails',
    props: {
        id: String,
        default: ""
    },
    data() {
        return {
            product: {}
        }
    },
    async mounted() {
        await this.requestGetProductId(this.id);
    },
    computed: {
      status() {
        return this.product.isActive ? 'Produto ativo' : 'Produto Inativo';
      }
    },
    methods: {
    async requestGetProductId(productId) {
      try {
        const response = await getProductId(productId);
        let data = response.data.data;
        this.product = { ...data };  
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    }
}
</script>