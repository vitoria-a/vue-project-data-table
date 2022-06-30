<template>
  <div class="product-management">
    <h3>Product Table</h3>
    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">
        <i class="pi pi-box"></i>
      </span>
      <InputText
        placeholder="Enter the product name"
        v-model.trim="product.name"
      />
    </div>

    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">
        <i class="pi pi-book"></i>
      </span>
      <InputText
        placeholder="Enter the product description"
        v-model="product.description"
      />
    </div>

    <div class="button">
      <Button
        class="p-button-success"
        label="Adicionar"
        :disabled="hasProduct"
        @click="requestPostProduct"
      />
    </div>

    <ConfirmPopup group="editProduct">
      <template #message="slotProps">
        <div class="pop-up-edit">
          <p>{{ slotProps.message.titulo }}</p>
          <InputText
            placeholder="Product Name"
            v-model="modifiedProduct.name"
          />
          <InputText
            placeholder="Product Price"
            v-model="modifiedProduct.description"
          />
        </div>
      </template>
    </ConfirmPopup>

    <ConfirmPopup group="deleteProduct">
      <template #message="slotProps">
        <div class="pop-up-delete">
          <p>{{ slotProps.message.titulo }}</p>
        </div>
      </template>
    </ConfirmPopup>

    <Toast />

    <ProductTable :products="products" :deleteProduct="deleteProduct" :editProduct="editProduct"/>
  </div>
</template>

<script>

import ProductTable from '../components/ProductTable.vue';
import { getAllProducts, postProduct, putProduct } from '../services/productService.js';

export default {
  name: 'ProductManagement',
  components: {
    ProductTable
  },
  data() {
    return {
      modifiedProduct: {
        id: null,
        name: "",
        description: ""
      },
      product: {
        id: null,
        name: "",
        description: ""
      },
      products: []
    };
  },
  computed: {
    hasProduct() {
      let exists = true;
      if (this.product.name && this.product.description) {
        exists = false;
      }
      return exists;
    }
  },
  async mounted() {
    await this.requestGetAllProducts();
  },
  methods: {
    notification(severity, detail) {
      this.$toast.add({ severity: severity, summary: '', detail: detail, life: 3000 });
    },
    clearInput() {
      this.product.name = "";
      this.product.description = "";
    },
    async requestGetAllProducts() {
      try {
        const response = await getAllProducts();
        let data = response.data.data;
        this.products = data;
      } catch {
        this.products = [];
      }
    },
    async requestPostProduct() {
      try {
        const response = await postProduct(this.product);
        let data = response.data.data;
        this.product.id = data.id;
        this.product.name = data.name;
        this.product.description = data.description;

        this.notification('success', `${this.product.name} registered`);
        this.requestGetAllProducts();
        this.clearInput();
      } catch (error) {
        this.notification('info', `${error.response.data.errors}`);
      }

    },
    async requestPutProduct(productId, product) {
      try {
        const response = await putProduct(productId, product);
        let data = response.data.data;
        product.name = data.name;
        product.description = data.description;

        this.notification('success', `${product.name} updated`);
        this.requestGetAllProducts();
      } catch (error) {
        this.notification('info', `${error.response.data.errors}`);
      }
    },
    editProduct(event, product) {
      this.modifiedProduct = { ...product };
      this.$confirm.require({
        group: "editProduct",
        target: event.currentTarget,
        titulo: "Do you really want to edit?",
        accept: () => {
          this.requestPutProduct(this.modifiedProduct.id, this.modifiedProduct);
        },
        reject: () => {
          this.notification('info', `The product ${product.name} has not been updated`);
        }
      });
    },
    /* deleteProduct(event, product) {
      this.$confirm.require({
        group: "deleteProduct",
        target: event.currentTarget,
        titulo: `Do you really want to delete ${this.toUpperCaseFirstLetter(product.name)}?`,
        accept: () => {
          let index = this.products.indexOf(product);
          this.products.splice(index, 1);
          this.notification('success', `${this.toUpperCaseFirstLetter(product.name)} deleted`);
        },
        reject: () => {
          this.notification('info', `The product ${this.toUpperCaseFirstLetter(product.name)} has not been deleted`);
        }
      });
    }, */
  }
}
</script>