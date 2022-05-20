<template>
  <div class="product-table">
    <h3>Price Table</h3>
    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">
        <i class="pi pi-box"></i>
      </span>
      <InputText
        v-model.trim="product.name"
        placeholder="Enter the product name"
      />
    </div>

    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">$</span>
      <InputNumber
        :minFractionDigits="2"
        :maxFractionDigits="2"
        placeholder="Enter the product price"
        v-model="product.price"
      />
    </div>
    <br />
    <Button
      label="Adicionar"
      class="p-button-success"
      :disabled="hasProduct"
      @click="save"
    />
    <br />
    <br />

    <ConfirmPopup group="editProduct">
      <template #message="slotProps">
        <div class="pop-up-edit">
          <p>{{ slotProps.message.titulo }}</p>
          <InputText
            placeholder="Product Name"
            v-model="modifiedProduct.name"
          />
          <InputNumber
            :minFractionDigits="2"
            :maxFractionDigits="2"
            placeholder="Product Price"
            v-model="modifiedProduct.price"
            currency="BRL"
            mode="currency"
            locale="pt-BR"
          />
        </div>
      </template>
    </ConfirmPopup>

    <ConfirmPopup>
      <template #message="slotProps">
        <div class="pop-up-delete">
          <p>{{ slotProps.message.titulo }}</p>
        </div>
      </template>
    </ConfirmPopup>

    <Toast />

    <DataTable
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25]"
      :paginator="true"
      :value="products"
      class="p-datatable-customers"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      filterDisplay="menu"
      removableSort
      responsiveLayout="scroll"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      showGridlines
      v-model:filters="filters"
    >
      <Column :sortable="true" field="id" header="ID">
        <template #body="{ data }">
          {{ data.id }}
        </template>
        <template #filter="{ filterModel }">
          <InputText
            class="p-column-filter"
            placeholder="Search by product ID"
            type="text"
            v-model="filterModel.value"
          />
        </template>
      </Column>
      <Column :sortable="true" field="name" header="Product">
        <template #body="{ data }">
          {{ data.name }}
        </template>
        <template #filter="{ filterModel }">
          <InputText
            class="p-column-filter"
            placeholder="Search by product name"
            type="text"
            v-model="filterModel.value"
          />
        </template>
      </Column>
      <Column :sortable="true" field="price" header="Price" dataType="numeric">
        <template #body="{ data }">
          {{ formatCurrencyType(data.price) }}
        </template>
        <template #filter="{ filterModel }">
          <InputNumber
            :minFractionDigits="2"
            :maxFractionDigits="2"
            currency="BRL"
            v-model="filterModel.value"
            placeholder="Search by product price"
            mode="currency"
            locale="pt-BR"
          />
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button p-button-success"
            @click="editProduct($event, slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button p-button-danger"
            @click="deleteProduct($event, slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import { FilterMatchMode, FilterOperator } from 'primevue/api';

export default {
  data() {
    return {
      product: {
        name: "",
        price: 0
      },
      modifiedProduct: {
        name: "",
        price: 0
      },
      products: [],
      filters: null
    };
  },
  created() {
    this.initFilters();
  },
  computed: {
    hasProduct() {
      let exists = true;
      if (this.product.price && this.product.name) {
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
      if (this.exists(this.product)) {
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
      this.product.price = 0;
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
        target: event.currentTarget,
        titulo: `Do you really want to delete ${this.toUpperCaseFirstLetter(product.name)}?`,
        accept: () => {
          let index = this.products.indexOf(product);
          this.products.splice(index, 1);
          this.notification('sucess', `${this.toUpperCaseFirstLetter(product.name)} excluded`);
        },
        reject: () => {
          this.notification('info', 'You have canceled');
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
    },
    initFilters() {
      this.filters = {
        'id': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        'price': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
      }
    }
  }
};
</script>