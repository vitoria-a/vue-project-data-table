<template>
  <div class="product-management">
    <h3>Product Table</h3>
    <div class="header">
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">
          <i class="pi pi-shopping-cart"></i>
        </span>
        <InputText
          placeholder="Enter the product name"
          v-model.trim="product.name"
          v-tooltip.bottom="'Enter the name'" 
        />
      </div>

      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">
          <i class="pi pi-info-circle"></i>
        </span>
        <InputText
          placeholder="Enter the product description"
          v-model="product.description"
          v-tooltip.bottom="'Enter the description'" 
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
    </div>
    <div class="options">
      <div class="p-inputgroup">
        <InputText placeholder="Search by product ID" v-model.trim="product.id" v-tooltip.bottom="'Enter the product ID'" />
        <Button icon="pi pi-search" class="p-button-warning" @click="requestSearchProductId(product.id)"/>
      </div>
      <div class="button">
        <Button
          class="p-button-warning"
          label="List Active Products"
          @click="activeProducts"
        />
      </div>
      <div class="button">
        <Button
          class="p-button-warning"
          label="List Inactive Products"
          @click="inactiveProducts"
        />
      </div>
    </div>

    <ConfirmPopup group="editProduct">
      <template #message="slotProps">
        <div class="pop-up-edit">
          <p>{{ slotProps.message.titulo }}</p>
          <p> Name:
            <InputText
              placeholder="Product Name"
              v-model="modifiedProduct.name"
            />
          </p>
          <p> Description:
            <InputText
              placeholder="Product Description"
              v-model="modifiedProduct.description"
            />
          </p>
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
    <ConfirmPopup group="moreOptions">
      <template #message="slotProps">
        <div class="pop-up-more-options">
          <p>{{ slotProps.message.titulo }}</p>
        </div>
      </template>
    </ConfirmPopup>

    <Toast />

    <ProductTable
      :products="products"
      :deleteProduct="deleteProductId"
      :editProduct="editProductId"
      :moreOptions="moreOptions"
      :status="productsActive"
    />
  </div>
</template>

<script>

import ProductTable from '../components/ProductTable.vue';
import {
  getAllProducts,
  postProduct,
  putProduct,
  deleteProduct,
  getProductId,
  patchInactiveProductId,
  patchActiveProductId
} from '../services/productService.js';

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
      products: [],
      productsActive: false,
    };
  },
  computed: {
    hasProduct() {
      let exists = true;
      if (this.product.name && this.product.description) {
        exists = false;
      }
      return exists;
    },
    status() {
      return this.productsActive ? "active" : "inactive";
    }
  },
  async mounted() {
    await this.requestGetAllProducts(true);
  },
  methods: {
    notification(severity, detail) {
      this.$toast.add({ severity: severity, summary: '', detail: detail, life: 3000 });
    },
    async requestGetAllProducts(isActive) {
      try {
        const response = await getAllProducts(isActive);
        let data = response.data.data;
        this.products = data;
      } catch {
        this.products = [];
      }
    },
    async requestPostProduct() {
      try {
        await postProduct(this.product);
        this.notification('success', `${this.product.name} registered`);
        this.requestGetAllProducts(true);
        this.product.name = "";
        this.product.description = "";
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPutProduct(productId, product) {
      try {
        await putProduct(productId, product);
        this.notification('success', `${product.name} updated`);
        this.requestGetAllProducts(true);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestDeleteProduct(product) {
      try {
        await deleteProduct(product.id);
        this.notification('success', `${product.name} deleted`);
        this.requestGetAllProducts(false);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestSearchProductId(productId) {
      try {
        const response = await getProductId(productId);
        let data = response.data.data;
        let searchProductId = [];
        searchProductId.push(data);
        this.products = searchProductId;
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPatchInactiveProductId(productId) {
      try {
        await patchInactiveProductId(productId);
        this.requestGetAllProducts(true);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPatchActiveProductId(productId) {
      try {
        await patchActiveProductId(productId);
        this.requestGetAllProducts(false);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    editProductId(event, product) {
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
    deleteProductId(event, product) {
      this.$confirm.require({
        group: "deleteProduct",
        target: event.currentTarget,
        titulo: `Do you really want to delete ${product.name}?`,
        accept: () => {
          this.requestDeleteProduct(product);
        },
        reject: () => {
          this.notification('info', `The product ${product.name} has not been deleted`);
        }
      });
    },
    moreOptions(event, product) {
      this.$confirm.require({
        group: "moreOptions",
        target: event.currentTarget,
        titulo: `Do you want to ${this.status} the product?`,
        accept: () => {
          if(this.status === 'inactive') {
            this.requestPatchInactiveProductId(product.id);
            this.notification('success', `${product.name} inactivated`);
          }
          if(this.status === 'active') {
            this.requestPatchActiveProductId(product.id);
            this.notification('success', `${product.name} activated`);
          }
        },
        reject: () => {
          this.notification('info', `No changes have been made`);
        }
      });
    },
    activeProducts() {
      this.productsActive = false;
      this.requestGetAllProducts(true);
      this.product.id = "";
    },
    inactiveProducts() {
      this.productsActive = true;
      this.requestGetAllProducts(false);
      this.product.id = "";
    } 
  }
}
</script>