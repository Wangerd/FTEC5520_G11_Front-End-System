<template>
  <VaForm ref="form" @submit.prevent="submit">
    <!--    <VaInput-->
    <!--      v-model="paymentCardLocal.name"-->
    <!--      :rules="[(v) => !!v || 'DID Name field is required']"-->
    <!--      class="mb-4"-->
    <!--      label="Card Name"-->
    <!--    />-->
    <!--    <VaCheckbox v-model="paymentCardLocal.isPrimary" class="mb-4" label="Primary Card" />-->
    <!--    <VaSelect-->
    <!--      v-model="paymentCardLocal.paymentSystem"-->
    <!--      :options="paymentSystemTypeOptions"-->
    <!--      :rules="[(v) => !!v || 'Payment System field is required']"-->
    <!--      class="mb-4"-->
    <!--      label="Payment System"-->
    <!--    />-->
    <!--    <VaInput-->
    <!--      v-model="paymentCardLocal.cardNumberMasked"-->
    <!--      :rules="[(v) => !!v || 'Card Number field is required']"-->
    <!--      class="mb-4"-->
    <!--      label="Card Number"-->
    <!--      mask="creditCard"-->
    <!--      placeholder="#### #### #### ####"-->
    <!--    />-->
    <!--    <VaInput-->
    <!--      v-model="paymentCardLocal.expirationDate"-->
    <!--      :mask="{-->
    <!--        date: true,-->
    <!--        datePattern: ['m', 'y'],-->
    <!--      }"-->
    <!--      :rules="[-->
    <!--        (v) => !!v || 'Expiration Date field is required',-->
    <!--        (v) => /^\d{4}$/.test(v) || 'Expiration Date must be in MM/YY format',-->
    <!--      ]"-->
    <!--      class="mb-4"-->
    <!--      label="Expiration Date"-->
    <!--    />-->
    <div class="flex flex-col items-center justify-center gap-2">
      <div class="text-secondary">did:ethr:0x12345das315g52sdg8421hf01234567</div>
      <img alt="Visa Logo" src="../../payment-system/sample.png" />
      <div class="text-secondary">DID expires at {{ expirationDateString }}</div>

      <div class="flex justify-end gap-3">
        <VaButton color="secondary" @click="emits('cancel')">Cancel</VaButton>
        <!--      <VaButton @click="submit">{{ submitText }}</VaButton>-->
      </div>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { useForm, VaForm } from 'vuestic-ui'
import { PaymentCard } from '../../types'
import { watch, ref, computed } from 'vue'

const { validate } = useForm('form')
const emits = defineEmits(['save', 'cancel'])

const props = defineProps<{
  paymentCard: PaymentCard
  submitText: string
}>()

// const paymentSystemTypeOptions = Object.values(PaymentSystemType)
const paymentCardLocal = ref({ ...props.paymentCard })

const expirationDateString = computed(() => {
  const e = props.paymentCard.expirationDate
  return `${e[0]}${e[1]}/${e[2]}${e[3]}/${e[4]}${e[5]}${e[6]}${e[7]}`
})

watch(
  () => props.paymentCard,
  (value) => {
    paymentCardLocal.value = { ...value }
  },
  { deep: true },
)

const submit = () => {
  if (validate()) {
    emits('save', {
      ...paymentCardLocal.value,
      cardNumberMasked: paymentCardLocal.value.cardNumberMasked.replace(/\d{12}(.*)/g, '****$1'),
    })
  }
}
</script>
