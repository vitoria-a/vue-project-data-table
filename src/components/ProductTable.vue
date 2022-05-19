<template>
  <div class="product-table">
    <h3>Price Table</h3>
    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">
        <i class="pi pi-box"></i>
      </span>
      <InputText
        v-model.trim="productName"
        placeholder="Enter the product name"
      />
    </div>

    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">$</span>
      <InputNumber
        :minFractionDigits="2"
        :maxFractionDigits="5"
        placeholder="Enter the product price"
        v-model="productPrice"
      />
    </div>
    <br />
    <Button
      label="Adicionar"
      class="p-button-success"
      @click="saveProductData"
    />
    <br />
    <br />

    <DataTable
      :rows="10"
      :rowsPerPageOptions="[2, 5, 10]"
      :paginator="true"
      :value="productsList"
      class="p-datatable-customers"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      filterDisplay="menu"
      removableSort
      responsiveLayout="scroll"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      showGridlines
      v-model:filters="filters"
    >
      <Column :sortable="true" field="productName" header="Product">
        <template #body="{ data }">
          {{ data.productName }}
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
      <Column
        :sortable="true"
        field="productPrice"
        header="Price"
        dataType="numeric"
      >
        <template #body="{ data }">
          {{ formatPrice(data.productPrice) }}
        </template>
        <template #filter="{ filterModel }">
          <InputNumber
            :minFractionDigits="2"
            :maxFractionDigits="5"
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
      productName: "",
      productPrice: 0,
      productsList: [],
      productNameToEdit: "",
      productPriceToEdit: 0,
      filters: null
    };
  },
  created() {
    this.initFilters();
  },
  methods: {
    saveProductData() {
      if (!this.productPrice || !this.productName) {
        this.$toast.add({
          severity: 'warn',
          summary: '',
          detail: 'Check empty fields!',
          life: 3000
        });
      } else {
        if (this.existsProductBeforeSave()) {
          this.$toast.add({
            severity: 'warn',
            summary: '',
            detail: 'The product is already registered',
            life: 3000
          });
        } else {
          this.productsList.push({
            productName: this.formatName(this.productName),
            productPrice: this.productPrice
          });
          this.$toast.add({
            severity: 'success',
            summary: '',
            detail: `${this.formatName(this.productName)} registered`,
            life: 3000
          });
        }
        this.productName = "";
        this.productPrice = 0;
      }
    },
    editProduct(event, product) {
      this.productNameToEdit = product.productName;
      this.productPriceToEdit = product.productPrice;
      this.$confirm.require({
        group: "editProduct",
        target: event.currentTarget,
        titulo: "Do you really want to edit?",
        accept: () => {
          if (this.existsProductBeforeConfirmEdit()) {
            this.$toast.add({
              severity: 'warn',
              summary: '',
              detail: `The product ${this.formatName(this.productNameToEdit)} is already registered`,
              life: 3000
            });
          } else {
            product.productName = this.productNameToEdit;
            product.productPrice = this.productPriceToEdit;
            this.$toast.add({
              severity: 'success',
              summary: '',
              detail: `${this.formatName(this.productNameToEdit)} updated`,
              life: 3000
            });
          }
        },
        reject: () => {
          this.$toast.add({
            severity: 'info',
            summary: '',
            detail: `The product ${this.formatName(product.productName)} has not been updated`,
            life: 3000
          });
        }
      });
    },
    deleteProduct(event, product) {
      this.$confirm.require({
        target: event.currentTarget,
        titulo: "Do you really want to delete?",
        accept: () => {
          var index = this.productsList.indexOf(product);
          this.productsList.splice(index, 1);
          this.$toast.add({
            severity: 'success',
            summary: '',
            detail: `${this.formatName(product.productName)} excluded`,
            life: 3000
          });
        },
        reject: () => {
          this.$toast.add({
            severity: 'info',
            summary: '',
            detail: 'You have canceled',
            life: 3000
          });
        }
      });
    },
    existsProductBeforeSave() {
      var existsName = false;
      this.productsList.forEach(product => {
        if (this.formatName(this.productName) === this.formatName(product.productName)) {
          existsName = true;
        }
      });
      return existsName;
    },
    existsProductBeforeConfirmEdit() {
      var existsName = false;
      this.productsList.forEach(product => {
        if (this.formatName(this.productNameToEdit) === this.formatName(product.productName)) {
          existsName = true;
        }
      });
      return existsName;
    },
    formatPrice(price) {
      return price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    },
    initFilters() {
      this.filters = {
        'productName': {
          operator: FilterOperator.AND,
          constraints: [{
            value: null,
            matchMode: FilterMatchMode.CONTAINS
          }]
        },
        'productPrice': {
          operator: FilterOperator.AND,
          constraints: [{
            value: null,
            matchMode: FilterMatchMode.EQUALS
          }]
        }
      }
    }
  }
};
</script>