import { defineStore } from 'pinia'
import { sleep } from '../services/utils'
import { BillingAddress } from '../pages/payments/types' // adjust the import path accordingly

// Simulated fetch function
const fetchBillingAddresses = async () => {
  await sleep(1000)
  return [
    {
      id: '1',
      name: 'Finance Department Identity DID',
      isPrimary: true,
      street: 'did:ethr:0x3Abc45d****6F78901',
      city: 'Finance Department',
      state: '',
      postalCode: '',
      country: 'JAPAN',
    },
    {
      id: '2',
      name: '女神異聞録ペルソナ Identity DID',
      isPrimary: false,
      street: 'did:ethr:0x1a2B3c4****2345678',
      city: 'Kabushiki Gaisha Atorasu',
      state: '',
      postalCode: '',
      country: 'US',
    },
    {
      id: '3',
      name: '「ドクターストーン(Dr. Stone)」Identity DID',
      isPrimary: false,
      street: 'did:ethr:0x9f8eD5a****3c2102F',
      city: '株式会社トムス・エンタテインメント',
      state: '',
      postalCode: '',
      country: 'JAPAN',
    },
  ] as BillingAddress[]
}

export const useBillingAddressesStore = defineStore({
  id: 'billingAddresses',
  state: () => ({
    billingAddresses: [] as BillingAddress[],
    loading: false,
  }),
  getters: {
    allBillingAddresses: (state) => state.billingAddresses,
  },
  actions: {
    async load() {
      this.loading = true
      this.billingAddresses = await fetchBillingAddresses()
      this.loading = false
    },
    create(address: BillingAddress) {
      this.billingAddresses.unshift(address)
    },
    update(address: BillingAddress) {
      const index = this.billingAddresses.findIndex((existingCard) => existingCard.id === address.id)
      if (index !== -1) {
        this.billingAddresses.splice(index, 1, address)
      }
    },
    remove(addressId: string) {
      this.billingAddresses = this.billingAddresses.filter((address) => address.id !== addressId)
    },
  },
})
