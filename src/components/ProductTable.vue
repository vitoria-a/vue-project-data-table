<template>
  <div class="product-table">
    <DataTable
      class="p-datatable-customers"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      filterDisplay="menu"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      removableSort
      responsiveLayout="scroll"
      showGridlines
      v-model:filters="filters"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25]"
      :value="products"
    >
      <Column field="id" header="ID" :sortable="true">
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
      <Column field="name" header="Product" :sortable="true">
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
      <Column dataType="numeric" field="price" header="Price" :sortable="true">
        <template #body="{ data }">
          {{ formatCurrencyType(data.price) }}
        </template>
        <template #filter="{ filterModel }">
          <InputNumber
            currency="BRL"
            locale="pt-BR"
            mode="currency"
            placeholder="Search by product price"
            v-model="filterModel.value"
            :maxFractionDigits="2"
            :minFractionDigits="2"
          />
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button
            class="p-button p-button-success"
            icon="pi pi-pencil"
            @click="editProduct($event, slotProps.data)"
          />
          <Button
            class="p-button p-button-danger"
            icon="pi pi-trash"
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
  name: 'ProductTable',
  props: {
    products: {
      type: Array,
      default: new Array()
    },
    deleteProduct: {
      type: Function,
      default() {
        return 'Default function'
      }
    }
  },
  data() {
    return {
      filters: null
    }
  },
  created() {
    this.initFilters();
  },
  methods: {
    initFilters() {
      this.filters = {
        'id': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        'price': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
      }
    },
    notification(severity, detail) {
      this.$toast.add({ severity: severity, summary: '', detail: detail, life: 3000 });
    },
    formatCurrencyType(price) {
      return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    },
  },
};
</script>