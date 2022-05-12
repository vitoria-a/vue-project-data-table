<template>
  <div>
    <h3>Price Table</h3>
    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">
        <i class="pi pi-box"></i>
      </span>
      <InputText placeholder="Enter the product name" />
    </div>

    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">$</span>
      <InputNumber placeholder="Enter the product price" />
    </div>

    <Button label="Adicionar" class="p-button-success" />
    <br />
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  methods: {

  }
};
</script>