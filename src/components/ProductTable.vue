<template>
  <div>
    <h3>Price Table</h3>
    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">
        <i class="pi pi-box"></i>
      </span>
      <InputText
        placeholder="Enter the product name"
        v-model.trim="productName"
      />
    </div>

    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">$</span>
      <InputNumber
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
      :value="productsList"
      class="p-datatable-customers"
      responsiveLayout="scroll"
      showGridlines
      v-model:filters="filters1"
    >
      <Column field="productName" header="Product">
        <template #body="{ data }">
          {{ data.productName }}
        </template>
        <template #filter="{ filterModel }">
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Search by product name"
          /> </template
      ></Column>
      <Column field="productPrice" header="Price" dataType="numeric">
        <template #body="{ data }">
          {{ data.productPrice }}
        </template>
        <template #filter="{ filterModel }">
          <InputNumber
            v-model="filterModel.value"
            placeholder="Search by product price"
            mode="currency"
            currency="BRL"
            locale="pt-BR"
          /> </template
      ></Column>
    </DataTable>
  </div>
</template>

<script>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
export default {
  data() {
    return {
      productName: "",
      productPrice: null,
      productsList: [],
      filters1: {
        'productName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        'productPrice': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
      }
    };
  },
  methods: {
    saveProductData() {
      if (this.productName !== "" && this.productPrice !== "") {
        this.productsList.push({
          productName: this.productName,
          productPrice: this.productPrice
        });
        this.productName = "";
        this.productPrice = null;
      } else {
        alert("Por favor, preencha os campos vazios!");
      }
    }
  }
};
</script>