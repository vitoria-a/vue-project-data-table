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
      scrollHeight="200px"
      v-model:filters="filters"
      :scrollable="true"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25]"
      :value="products"
    >
      <Column field="id" header="ID" :sortable="true">
        <template #body="{ data }">
          <router-link
            tag="Button"
            v-tooltip.left="'Click here for more information'"
            :to="`/${data.id}/details`">
              {{ data.id }}
          </router-link>
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
      <Column field="name" header="Name" :sortable="true">
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
       <Column field="price" header="Price" :sortable="true">
        <template #body="{ data }">
          {{ data.price }}
        </template>
        <template #filter="{ filterModel }">
          <InputNumber
            class="p-column-filter"
            placeholder="Search by product price"
            type="text"
            v-model="filterModel.value"
            :minFractionDigits="2"
            :maxFractionDigits="2"
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
      <Column header="Actions" class="actions">
        <template #body="slotProps">
          <Button
            class="p-button p-button-success"
            icon="pi pi-pencil"
            @click="editProduct($event, slotProps.data)"
          />
          <Button 
            v-if="active"
            class="p-button"
            icon="pi pi-eye"
            @click="activeProduct($event, slotProps.data)"
          />
          <Button 
            v-else
            class="p-button"
            icon="pi pi-eye-slash"
            @click="inactiveProduct($event, slotProps.data)"
          /> 
          <Button
            class="p-button p-button-danger"
            icon="pi pi-trash"
            v-show="active"
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
    },
    editProduct: {
      type: Function,
      default() {
        return 'Default function'
      }
    },
    activeProduct: {
      type: Function,
      default() {
        return 'Default function'
      }
    },
    inactiveProduct: {
      type: Function,
      default() {
        return 'Default function'
      }
    }
  },
  data() {
    return {
      active: false,
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
        'price': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'description': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
      }
    },
    notification(severity, detail) {
      this.$toast.add({ severity: severity, summary: '', detail: detail, life: 3000 });
    },
  },
};
</script>