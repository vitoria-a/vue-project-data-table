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
import { getAllProducts, postProduct } from '../services/productService.js';

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

        this.notification('success', `${this.toUpperCaseFirstLetter(this.product.name)} registered`);
        this.requestGetAllProducts();
        this.clearInput();
      } catch {
        this.notification('warn', `The product ${this.toUpperCaseFirstLetter(this.product.name)} has not been registered`);
      }

    },
    editProduct(event, product) {
      this.modifiedProduct = { ...product };
      this.$confirm.require({
        group: "editProduct",
        target: event.currentTarget,
        titulo: "Do you really want to edit?",
        accept: () => {
          if (this.exists(this.modifiedProduct, this.products)) {
            this.notification('warn', `The product ${this.toUpperCaseFirstLetter(this.modifiedProduct.name)} is already registered`);
          } else {
            product.name = this.toUpperCaseFirstLetter(this.modifiedProduct.name);
            product.description = this.modifiedProduct.description;
            this.notification('success', `${this.toUpperCaseFirstLetter(this.modifiedProduct.name)} updated`);
          }
        },
        reject: () => {
          this.notification('info', `The product ${this.toUpperCaseFirstLetter(product.name)} has not been updated`);
        }
      });
    },
    deleteProduct(event, product) {
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
    },
    exists(product = {}, products = []) {
      let exists = false;
      products.forEach(content => {
        if (product.id !== content.id) {
          if (content.name.toLowerCase() === product.name.toLowerCase()) {
            exists = true;
          }
        }
      });
      return exists;
    },
    toUpperCaseFirstLetter(name) {
      return name[0].toUpperCase() + name.substring(1).toLowerCase();
    }
  }
}
</script>