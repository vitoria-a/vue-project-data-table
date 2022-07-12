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
          $
        </span>
        <InputNumber
          placeholder="Enter the product price"
          v-model="product.price"
          v-tooltip.bottom="'Enter the price'"
          :minFractionDigits="2"
          :maxFractionDigits="2"
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
          @click="save"
        />
      </div>
    </div>
    <div class="buttons">
      <div class="button">
        <Button
          class="p-button-warning"
          label="List Active Products"
          @click="showActiveProducts"
        />
      </div>
      <div class="button">
        <Button
          class="p-button-warning"
          label="List Inactive Products"
          @click="showInactiveProducts"
        />
      </div>
    </div>

    <ConfirmPopup group="editProduct">
      <template #message="slotProps">
        <div class="pop-up-edit">
          <p>{{ slotProps.message.title }}</p>
          <p> Name:
            <InputText
              class="input"
              placeholder="Product Name"
              v-model="modifiedProduct.name"
            />
          </p>
          <p> Description:
            <InputText
              class="input"
              placeholder="Product Description"
              v-model="modifiedProduct.description"
            />
          </p>
          <p> Price:
            <InputNumber
              class="input"
              placeholder="Product Price"
              v-model="modifiedProduct.price"
              :minFractionDigits="2"
              :maxFractionDigits="2"
            />
          </p>
        </div>
      </template>
    </ConfirmPopup>
    <ConfirmPopup group="deleteProduct">
      <template #message="slotProps">
        <div class="pop-up-delete">
          <p>{{ slotProps.message.title }}</p>
        </div>
      </template>
    </ConfirmPopup>
    <ConfirmPopup group="status">
      <template #message="slotProps">
        <div class="pop-up-status">
          <p>{{ slotProps.message.title }}</p>
        </div>
      </template>
    </ConfirmPopup>

    <Toast />

    <ProductTable
      ref="productTable"
      :products="products"
      :deleteProduct="deleteProductId"
      :editProduct="editProductId"
      :activeProduct="activeProductId"
      :inactiveProduct="inactiveProductId"
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
      active: true,
      modifiedProduct: {
        id: null,
        name: "",
        description: "",
        price: 0
      },
      product: {
        id: null,
        name: "",
        description: "",
        price: 0,
        isActive: true
      },
      products: []
    };
  },
  computed: {
    hasProduct() {
      return (this.product.name && this.product.description) ? false : true;
    },
    hasProductId() {
      return this.product.id ? false : true;
    },
    status() {
      return this.active ? "inactive" : "active";
    }
  },
  async mounted() {
    await this.requestGetAllProducts(this.active);
  },
  methods: {
    notification(severity, detail) {
      this.$toast.add({ severity: severity, summary: '', detail: detail, life: 3000 });
    },
    clear() {
      this.product = {
        id: null,
        name: "",
        description: "",
        price: 0
      }
    },
    showActiveProducts() {
      this.active = true;
      this.$refs.productTable.active = false;
      this.requestGetAllProducts(this.active);
    },
    showInactiveProducts() {
      this.active = false;
      this.$refs.productTable.active = true;
      this.requestGetAllProducts(this.active);
    },
    editProductId(event, product) {
      this.modifiedProduct = { ...product };
      this.$confirm.require({
        group: "editProduct",
        target: event.currentTarget,
        title: "Do you really want to edit?",
        accept: () => {
            this.edit(this.modifiedProduct);
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
        title: `Do you really want to delete ${product.name}?`,
        accept: () => {
          this.delete(product);
        },
        reject: () => {
          this.notification('info', `The product ${product.name} has not been deleted`);
        }
      });
    },
    activeProductId(event, product) {
      this.$confirm.require({
        group: "status",
        target: event.currentTarget,
        title: `Do you want to ${this.status} the product?`,
        accept: () => {
          this.activeProduct(product.id);
        },
        reject: () => {
          this.notification('info', `No changes have been made`);
        }
      });
    },
    inactiveProductId(event, product) {
      this.$confirm.require({
        group: "status",
        target: event.currentTarget,
        title: `Do you want to ${this.status} the product?`,
        accept: () => {
          this.inactiveProduct(product.id);
        },
        reject: () => {
          this.notification('info', `No changes have been made`);
        }
      });
    },
    async save() {
      await this.requestPostProduct(this.product);
      this.clear();
      await this.requestGetAllProducts(this.active);
    },
    async edit(product) {
      await this.requestPutProduct(product);
      await this.requestGetAllProducts(this.active);
    },
    async delete(product) {
      await this.requestDeleteProduct(product);
      await this.requestGetAllProducts(this.active);
    },
    async inactiveProduct(productId) {
      await this.requestPatchInactiveProductId(productId);
      await this.requestGetAllProducts(this.active);
    },
    async activeProduct(productId) {
      await this.requestPatchActiveProductId(productId);
      await this.requestGetAllProducts(this.active);
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
    async requestPostProduct(product) {
      try {
        await postProduct(product);
        this.notification('success', `${product.name} registered`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPutProduct(product) {
      try {
        await putProduct(product.id, {
          name: product.name,
          description: product.description,
          price: product.price
        } );
        this.notification('success', `${product.name} updated`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestDeleteProduct(product) {
      try {
        await deleteProduct(product.id);
        this.notification('success', `${product.name} deleted`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPatchActiveProductId(productId) {
      try {
        await patchActiveProductId(productId);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPatchInactiveProductId(productId) {
      try {
        await patchInactiveProductId(productId);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    } 
  }
}
</script>