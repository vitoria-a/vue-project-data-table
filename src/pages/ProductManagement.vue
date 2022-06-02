<template>
  <div class="product-management">
    <h3>Price Table</h3>
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
      <span class="p-inputgroup-addon">$</span>
      <InputNumber
        placeholder="Enter the product price"
        v-model="product.price"
        :maxFractionDigits="2"
        :minFractionDigits="2"
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
          <InputNumber
            currency="BRL"
            locale="pt-BR"
            mode="currency"
            placeholder="Product Price"
            v-model="modifiedProduct.price"
            :maxFractionDigits="2"
            :minFractionDigits="2"
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

    <ProductTable :products="products" :deleteProduct="deleteProduct" />
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
        price: 0
      },
      product: {
        name: "",
        price: null
      },
      products: []
    };
  },
  computed: {
    hasProduct() {
      let exists = true;
      if (this.product.name && this.product.price) {
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
          price: this.product.price
        });
        this.notification('success', `${this.toUpperCaseFirstLetter(this.product.name)} registered`);
      }
      this.product.name = "";
      this.product.price = null;
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
            product.price = this.modifiedProduct.price;
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
    formatCurrencyType(price) {
      return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    },
    toUpperCaseFirstLetter(name) {
      return name[0].toUpperCase() + name.substring(1).toLowerCase();
    }
  }
}
</script>