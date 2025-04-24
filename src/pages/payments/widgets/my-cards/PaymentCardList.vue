<template>
  <div class="grid md:grid-cols-2 grid-cols-1 gap-4">
    <template v-if="loading">
      <div
        v-for="i in 4"
        :key="i"
        class="min-h-[114px] p-4 rounded-lg border border-dashed border-backgroundBorder flex flex-row items-center gap-6"
      >
        <div class="flex flex-col gap-2 flex-grow">
          <VaSkeleton class height="1.5rem" variant="text" width="10rem" />
          <div class="flex gap-4">
            <VaSkeleton height="3rem" variant="rounded" width="5rem" />
            <VaSkeleton :lines="2" variant="text" />
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <CardListItem
        v-for="paymentCard in list"
        :key="paymentCard.id"
        :card="paymentCard"
        @edit="cardToEdit = paymentCard"
        @remove="remove(paymentCard)"
      />
      <div
        class="sm:h-[114px] p-4 rounded-lg border border-dashed border-primary flex flex-col sm:flex-row items-start sm:items-center gap-4"
        :style="{ backgroundColor: colorToRgba(getColor('primary'), 0.07) }"
      >
        <div class="flex flex-col gap-2 flex-grow">
          <div class="text-lg font-bold leading-relaxed">Important note</div>
          <div class="text-secondary text-sm leading-tight">Please carefully read DID Terms before adding new DID</div>
        </div>
        <!--        <VaButton class="flex-none w-full sm:w-auto" @click="showCreate = true">Add DID</VaButton>-->
        <VaButton class="flex-none w-full sm:w-auto" @click="$router.push('billing')">Add DID</VaButton>
      </div>
    </template>
  </div>
  <PaymentCardCreateModal v-if="showCreate" @close="showCreate = false" />
  <PaymentCardUpdateModal v-if="cardToEdit" :payment-card="cardToEdit" @close="cardToEdit = undefined" />
</template>

<script lang="ts" setup>
import CardListItem from './PaymentCardListItem.vue'
import { usePaymentCardsStore } from '../../../../stores/payment-cards'
import { computed, onMounted, ref } from 'vue'
import { useColors } from 'vuestic-ui'
import { PaymentCard, PaymentSystemType } from '../../types'
// import { useRouter } from 'vue-router'
import { useModal, useToast } from 'vuestic-ui'
import PaymentCardCreateModal from './PaymentCardCreateModal.vue'
import PaymentCardUpdateModal from './PaymentCardUpdateModal.vue'
// import { format } from 'date-fns'

// const router = useRouter()
const store = usePaymentCardsStore()

const list = computed(() => store.allPaymentCards)
const loading = computed(() => store.loading)
const { confirm } = useModal()

const showCreate = ref<boolean>(false)
const cardToEdit = ref<PaymentCard>()
const { init } = useToast()

store.load()
const remove = async (card: PaymentCard) => {
  confirm({
    message: 'Are you really sure you want to delete this DID?',
    size: 'small',
    maxWidth: '380px',
  }).then((ok) => {
    if (!ok) return
    store.remove(card.id)
    init({ message: 'DID has been deleted', color: 'success' })
  })
}

// 从localStorage获取存储的DID数据
const getStoredDIDData = () => {
  const storedData = localStorage.getItem('paymentData')
  return storedData ? JSON.parse(storedData) : null
}

// 创建基于DID的payment card
const createDIDPaymentCard = () => {
  const didData = getStoredDIDData()
  if (!didData) return

  // 强制转换为 Date 对象（兼容字符串/时间戳/Date）
  const expiryDate = didData.expiryDate ? new Date(didData.expiryDate) : null

  // 验证日期有效性
  if (!expiryDate || isNaN(expiryDate.getTime())) {
    console.error('Invalid expiryDate:', didData.expiryDate)
    return
  }

  const newCard = {
    id: `did-${Date.now()}`,
    name: didData.projectName || 'DID Card',
    isPrimary: false,
    paymentSystem: PaymentSystemType.Visa, // 使用Visa作为DID的图标类型
    cardNumberMasked: didData.did.slice(0, 17) + '****' + didData.did.slice(-10), // 显示DID后4位
    expirationDate: [
      String(expiryDate.getDate()).padStart(2, '0'),
      String(expiryDate.getMonth() + 1).padStart(2, '0'),
      expiryDate.getFullYear(),
    ].join(''), // "DDMMYYYY"
  }
  store.create(newCard)
  console.log(store.allPaymentCards)
  localStorage.removeItem('paymentData') // 清除存储的数据
}

onMounted(async () => {
  await store.load() // 先加载已有数据
  createDIDPaymentCard() // 再添加新卡片
})

const { getColor, colorToRgba } = useColors()
</script>
