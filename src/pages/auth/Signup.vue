<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Sign up</h1>
    <p class="text-base mb-4 leading-5">
      Have an account?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">Login</RouterLink>
    </p>

    <!-- 新增的字段 -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <VaInput v-model="formData.firstName" :rules="[(v) => !!v || 'First name is required']" label="First Name" />
      <VaInput v-model="formData.lastName" :rules="[(v) => !!v || 'Last name is required']" label="Last Name" />
    </div>

    <VaSelect
      v-model="formData.gender"
      :options="genderOptions"
      :rules="[(v) => !!v || 'Gender is required']"
      class="mb-4"
      label="Gender"
    />

    <VaDateInput
      v-model="formData.birthDate"
      :rules="[(v) => !!v || 'Birth date is required']"
      class="mb-4"
      label="Birth Date"
      :input-props="{ clearable: true }"
    />

    <!-- 原有字段 -->
    <VaInput
      v-model="formData.email"
      :rules="[(v) => !!v || 'Email field is required', (v) => /.+@.+\..+/.test(v) || 'Email should be valid']"
      class="mb-4"
      label="Email"
      type="email"
    />

    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        ref="password1"
        v-model="formData.password"
        :rules="passwordRules"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        messages="Password should be 8+ characters: letters, numbers, and special characters."
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
      <VaInput
        ref="password2"
        v-model="formData.repeatPassword"
        :rules="[
          (v) => !!v || 'Repeat Password field is required',
          (v) => v === formData.password || 'Passwords don\'t match',
        ]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Repeat Password"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> Create account</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()

const formData = reactive({
  firstName: '',
  lastName: '',
  gender: '',
  birthDate: null,
  email: '',
  password: '',
  repeatPassword: '',
})

const genderOptions = [
  { text: 'Male', value: 'male' },
  { text: 'Female', value: 'female' },
  { text: 'Other', value: 'other' },
  { text: 'Prefer not to say', value: 'prefer-not-to-say' },
]

// const validateBirthDate = (value: string) => {
//   if (!value) return true
//   const birthDate = new Date(value)
//   const today = new Date()
//   const minDate = new Date()
//   minDate.setFullYear(today.getFullYear() - 120) // 最大年龄120岁
//   const maxDate = new Date()
//   maxDate.setFullYear(today.getFullYear() - 13) // 最小年龄13岁
//   if (birthDate < minDate) return 'Please enter a valid birth date'
//   if (birthDate > maxDate) return 'You must be at least 13 years old'
//   return true
// }

const submit = () => {
  if (validate()) {
    init({
      message: "You've successfully signed up",
      color: 'success',
    })
    push({ name: 'dashboard' })
  }
}

const passwordRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Password field is required',
  (v) => (v && v.length >= 8) || 'Password must be at least 8 characters long',
  (v) => (v && /[A-Za-z]/.test(v)) || 'Password must contain at least one letter',
  (v) => (v && /\d/.test(v)) || 'Password must contain at least one number',
  (v) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || 'Password must contain at least one special character',
]
</script>
