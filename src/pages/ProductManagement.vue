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
        @click="save"
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

export default {
  name: 'ProductManagement',
  components: {
    ProductTable
  },
  data() {
    return {
      modifiedProduct: {
        name: "",
        description: 0
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
  methods: {
    notification(severity, detail) {
      this.$toast.add({ severity: severity, summary: '', detail: detail, life: 3000 });
    },
    generateID(list = []) {
      let id = 0;
      if (list || list.length > 0) {
        list.forEach(content => id = content.id);
      }
      return id + 1;
    },
    save() {
      if (this.exists(this.product, this.products)) {
        this.notification('warn', `The product ${this.toUpperCaseFirstLetter(this.product.name)} is already registered`);
      } else {
        this.products.push({
          id: this.generateID(this.products),
          name: this.toUpperCaseFirstLetter(this.product.name),
          description: this.product.description
        });
        this.notification('success', `${this.toUpperCaseFirstLetter(this.product.name)} registered`);
      }
      this.product.name = "";
      this.product.description = "";
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