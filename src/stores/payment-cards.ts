// src/stores/cards.ts

import { defineStore } from 'pinia'
import { sleep } from '../services/utils'
import { PaymentSystemType, PaymentCard } from '../pages/payments/types' // adjust the import path accordingly

// Simulated fetch function
const fetchPaymentCards = async () => {
  await sleep(1000)
  return [
    {
      id: '1',
      name: 'Core Identity DID',
      isPrimary: true,
      paymentSystem: PaymentSystemType.Visa,
      cardNumberMasked: 'did:ethr:0x12345****34567',
      expirationDate: '20072035',
    },
    {
      id: '2',
      name: 'Asset Related DID',
      isPrimary: false,
      paymentSystem: PaymentSystemType.MasterCard,
      cardNumberMasked: 'did:ethr:0x3a7d8****D4E5F',
      expirationDate: '17112035',
    },
    {
      id: '3',
      name: 'Regional Compliance DID',
      isPrimary: false,
      paymentSystem: PaymentSystemType.MasterCard,
      cardNumberMasked: 'did:ethr:0x5B38D****eddC4',
      expirationDate: '07112035',
    },
  ]
}

export const usePaymentCardsStore = defineStore({
  id: 'paymentCards',
  state: () => ({
    paymentCards: [] as PaymentCard[],
    loading: false,
  }),
  getters: {
    currentPaymentCard: (state): PaymentCard | undefined => state.paymentCards.find((card) => card.isPrimary),
    allPaymentCards: (state) => state.paymentCards,
  },
  actions: {
    async load() {
      this.loading = true
      this.paymentCards = await fetchPaymentCards()
      this.loading = false
    },
    create(card: PaymentCard) {
      this.paymentCards.push(card)
    },
    update(card: PaymentCard) {
      const index = this.paymentCards.findIndex((existingCard) => existingCard.id === card.id)
      if (index !== -1) {
        this.paymentCards.splice(index, 1, card)
      }
    },
    remove(cardId: string) {
      this.paymentCards = this.paymentCards.filter((card) => card.id !== cardId)
    },
  },
})
