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
        v-model.trim="productPrice"
      />
    </div>

    <Button
      label="Adicionar"
      class="p-button-success"
      @click="saveProductData"
    />
    <br />
  </div>
</template>

<script>
export default {
  data() {
    return {
      productName: "",
      productPrice: null,
      productsList: []
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
    },
  }
};
</script>