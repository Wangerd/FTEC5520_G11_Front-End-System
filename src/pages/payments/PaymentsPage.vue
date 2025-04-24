<template>
  <h1 class="page-title">DID Management</h1>

  <VaCard class="mb-6">
    <VaCardContent>
      <div class="text-2xl font-bold leading-5 mb-6">Enterprise Identity DID</div>

      <PaymentCardList />
    </VaCardContent>
  </VaCard>

  <VaCard class="mb-6">
    <VaCardContent>
      <div class="text-2xl font-bold leading-5 mb-6">Operational DID</div>

      <BillingAddressList />

      <div class="space-y-2 mt-6">
        <div class="text-lg font-bold mb-2">Certificate Authority</div>
        <div class="space-y-1">
          <div class="text-sm text-gray-500">Standardization - W3C/DIF</div>
          <div class="text-sm text-primary underline">More info</div>
        </div>
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import PaymentCardList from './widgets/my-cards/PaymentCardList.vue'
import BillingAddressList from './widgets/billing-address/BillingAddressList.vue'
</script>
