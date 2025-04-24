<template>
  <VaCard>
    <VaCardTitle class="flex justify-between">
      <h1 class="card-title text-secondary font-bold uppercase">Authentication Passed by Top Regions</h1>
    </VaCardTitle>
    <VaCardContent class="flex flex-col gap-1">
      <div class="flex justify-between">
        <VaButtonToggle v-model="selectedPeriod" :options="periods" color="background-element" size="small" />

        <VaButton preset="primary" size="small" @click="exportAsCSV"> Export </VaButton>
      </div>

      <VaDataTable
        class="region-revenue-table"
        :columns="[
          { key: 'name', label: 'Top Region' },
          { key: 'revenue', label: 'Passing times', align: 'right' },
        ]"
        :items="data"
      >
        <template #cell(revenue)="{ rowData }"> {{ rowData[`revenue${selectedPeriod}`] }} </template>
      </VaDataTable>
    </VaCardContent>
  </VaCard>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { downloadAsCSV } from '../../../../services/toCSV'

const selectedPeriod = ref('Today') as Ref<'Today' | 'Week' | 'Month'>
const periods = ['Today', 'Week', 'Month'].map((period) => ({ label: period, value: period }))

const data = [
  {
    name: 'Japan',
    revenueToday: '54',
    revenueWeek: '352',
    revenueMonth: '1,203',
  },
  {
    name: 'United Kingdom',
    revenueToday: '50',
    revenueWeek: '360',
    revenueMonth: '1,158',
  },
  {
    name: 'United States',
    revenueToday: '45',
    revenueWeek: '352',
    revenueMonth: '1.106',
  },
  {
    name: 'China',
    revenueToday: '42',
    revenueWeek: '348',
    revenueMonth: '1,022',
  },
  {
    name: 'Canada',
    revenueToday: '35',
    revenueWeek: '302',
    revenueMonth: '956',
  },
  {
    name: 'Australia',
    revenueToday: '32',
    revenueWeek: '289',
    revenueMonth: '933',
  },
  {
    name: 'India',
    revenueToday: '30',
    revenueWeek: '258',
    revenueMonth: '896',
  },
]

const exportAsCSV = () => {
  downloadAsCSV(data, 'region-revenue')
}
</script>

<style lang="scss" scoped>
.region-revenue-table {
  ::v-deep(tbody) {
    tr {
      border-top: 1px solid var(--va-background-border);
    }
  }
}
</style>
