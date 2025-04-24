<script setup lang="ts">
import VaTimelineItem from '../../../../components/va-timeline-item.vue'
</script>

<template>
  <VaCard>
    <VaCardTitle class="flex justify-between">
      <h1 class="card-title text-secondary font-bold uppercase">Timeline</h1>
    </VaCardTitle>
    <VaCardContent>
      <table class="mt-4">
        <tbody>
          <VaTimelineItem date="25m ago">
            <RouterLink class="va-link font-semibold" to="/users">Donald</RouterLink> has sent a new verification
            request
            <RouterLink class="va-link font-semibold" to="/users">#1234</RouterLink>
          </VaTimelineItem>
          <VaTimelineItem date="1h ago">
            <RouterLink class="va-link font-semibold" to="/users">Lycy Peterson</RouterLink> was added to the group,
            group name is Overtake
          </VaTimelineItem>
          <VaTimelineItem date="2h ago">
            <RouterLink class="va-link font-semibold" to="/users">Joseph Rust</RouterLink> has sent a new verification
            request
            <RouterLink class="va-link font-semibold" to="/users">Mannat #112233</RouterLink>
          </VaTimelineItem>
          <VaTimelineItem date="3d ago">
            <RouterLink class="va-link font-semibold" to="/users">Donald</RouterLink> has applied for a new DID
          </VaTimelineItem>
          <VaTimelineItem date="Nov 14, 2023">
            <RouterLink class="va-link font-semibold" to="/users">Lycy Peterson</RouterLink> was added to the group
          </VaTimelineItem>
          <VaTimelineItem date="Nov 14, 2023">
            <RouterLink class="va-link font-semibold" to="/users">Dan Rya</RouterLink> was added to the group
          </VaTimelineItem>
          <VaTimelineItem date="Nov 15, 2023">
            a new verification request
            <RouterLink class="va-link font-semibold" to="/projects">Vuestic 2025</RouterLink> has been approved
          </VaTimelineItem>
        </tbody>
      </table>
    </VaCardContent>
  </VaCard>
</template>
