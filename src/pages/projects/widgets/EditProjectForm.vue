<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { EmptyProject, Project } from '../types'
import { SelectOption } from 'vuestic-ui'
import ProjectStatusBadge from '../components/ProjectStatusBadge.vue'
import UserAvatar from '../../users/widgets/UserAvatar.vue'
import { useUsersStore } from '../../../stores/users'

const props = defineProps<{
  project: Project | null
  saveButtonLabel: string
  availableDIDs: string[] // 可选接收 DID 列表
}>()

defineEmits<{
  (event: 'save', project: Project): void
  (event: 'close'): void
}>()

const defaultNewProject: EmptyProject = {
  project_name: '',
  project_owner: undefined,
  team: [],
  status: undefined,
  expiration_date: '',
  did: '',
}

const newProject = ref({ ...defaultNewProject })

const localDIDs = props.availableDIDs || ['Core Identity DID', 'Asset Related DID', 'Regional Compliance DID']

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newProject.value).some((key) => {
    if (key === 'team') {
      return false
    }

    return (
      newProject.value[key as keyof EmptyProject] !== (props.project ?? defaultNewProject)?.[key as keyof EmptyProject]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

const usersStore = useUsersStore()

// watch(
//   () => props.project,
//   () => {
//     if (!props.project) {
//       return
//     }
//
//     newProject.value = {
//       ...props.project,
//       project_owner: props.project.project_owner,
//     }
//   },
//   { immediate: true },
// )
watch(
  () => props.project,
  (newVal) => {
    if (!newVal) {
      newProject.value = { ...defaultNewProject }
      return
    }
    // 使用 JSON.stringify 比较，避免深层对象比较问题
    if (JSON.stringify(newProject.value) !== JSON.stringify(newVal)) {
      newProject.value = { ...newVal }
      newVal?.did // 直接传递 DID 字符串
    }
  },
  { immediate: true },
)
const required = (v: string | SelectOption) => !!v || 'This field is required'

const ownerFiltersSearch = ref('')
const teamFiltersSearch = ref('')

// const validateExpiration = (date: string) => {
//   return new Date(date) > new Date() || 'Expiration date must be in the future'
// }
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput v-model="newProject.project_name" label="Project name" :rules="[required]" />
    <VaSelect
      v-model="newProject.project_owner"
      v-model:search="ownerFiltersSearch"
      searchable
      label="Contact Person"
      text-by="fullname"
      track-by="id"
      value-by="id"
      :rules="[required]"
      :options="usersStore.items"
    >
      <template #content="{ value: user }">
        <div v-if="user" :key="user.id" class="flex items-center gap-1 mr-4">
          <UserAvatar v-if="false" :user="user" size="18px" />
          {{ user.fullname }}
        </div>
      </template>
    </VaSelect>
    <VaSelect v-model="newProject.did" label="DID" :options="localDIDs" clearable />
    <VaSelect
      v-model="newProject.team"
      v-model:search="teamFiltersSearch"
      label="Team"
      text-by="fullname"
      track-by="id"
      value-by="id"
      multiple
      :rules="[(v: any) => ('length' in v && v.length > 0) || 'This field is required']"
      :options="usersStore.items"
      :max-visible-options="$vaBreakpoint.mdUp ? 3 : 1"
    >
      <template #content="{ valueArray }">
        <template v-if="valueArray?.length">
          <div v-for="(user, index) in valueArray" :key="user.id" class="flex items-center gap-1 mr-2">
            <UserAvatar v-if="user" :user="user" size="18px" />
            {{ user.fullname }}{{ index < valueArray.length - 1 ? ',' : '' }}
          </div>
        </template>
      </template>
    </VaSelect>
    <VaSelect
      v-model="newProject.status"
      label="Status"
      :rules="[required]"
      track-by="value"
      value-by="value"
      :options="[
        { text: 'In progress', value: 'in progress' },
        // { text: 'Archived', value: 'archived' },
        // { text: 'Completed', value: 'completed' },
        { text: 'Important', value: 'important' },
      ]"
    >
      <template #content="{ value }">
        <ProjectStatusBadge v-if="value" :status="value.value" />
      </template>
    </VaSelect>
    <VaDateInput v-model="newProject.expiration_date" label="Expiration Date" :rules="[required]" clearable />
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newProject as Project)">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
