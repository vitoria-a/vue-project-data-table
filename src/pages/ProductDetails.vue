<template>
  <h3> Details </h3>
  <p> {{ product.name }}</p>
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