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
      <Column  field="description" header="Description" :sortable="true">
        <template #body="{ data }">
          {{ data.description }}
        </template>
        <template #filter="{ filterModel }">
          <InputText
            placeholder="Search by product description"
            type="text"
            v-model="filterModel.value"
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
            v-show="status"
            @click="deleteProduct($event, slotProps.data)"
          />
          <Button
            class="p-button"
            icon="pi pi-ellipsis-v"
            @click="moreOptions($event, slotProps.data)"
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
    },
    editProduct: {
      type: Function,
      default() {
        return 'Default function'
      }
    },
    moreOptions: {
      type: Function,
      default() {
        return 'Default function'
      }
    },
    status: {
      type: Boolean,
      default: false
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
        'description': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
      }
    },
    notification(severity, detail) {
      this.$toast.add({ severity: severity, summary: '', detail: detail, life: 3000 });
    },
  },
};
</script>