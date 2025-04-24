<script setup lang="ts">
import { ref } from 'vue'
import { defineVaStepperSteps, VaFileUpload, VaFile, VaSelect, VaInput, VaIcon } from 'vuestic-ui'
import router from '../../router'

interface EnterpriseFiles {
  businessLicense?: VaFile | VaFile[] // 使用VaFile类型
  legalPersonID?: VaFile | VaFile[]
  digitalCertificate?: VaFile | VaFile[]
}
interface OperationalFiles {
  businessLicense: VaFile | VaFile[]
  authorizationLetter: VaFile | VaFile[]
}
const currentStep = ref(0)
const model = ref({
  projectName: '',
  didType: {
    text: '',
    value: '',
  },
  enterpriseFiles: {} as EnterpriseFiles,
  // enterpriseFiles: {
  //   businessLicense: null as File | null,
  //   legalPersonID: null as File | null,
  //   digitalCertificate: null as File | null
  // },
  operationalFiles: {} as OperationalFiles,
  // operationalFiles: {
  //   businessLicense: null as File | null,
  //   authorizationLetter: null as File | null
  // },
  scenario: '',
  expiryDate: null as Date | null,
  deviceId: '',
  complianceProof: undefined as VaFile | VaFile[] | undefined,
  agreements: {
    techArchitecture: false,
    keyManagement: false,
    userAuthorization: false,
    antiFraud: false,
  },
})

// const { validate } = useForm('stepForm')

const steps = ref(
  defineVaStepperSteps([
    {
      label: 'basic',
      beforeLeave: (step) => {
        // 只有当前步骤激活且用户尝试离开时验证
        if (currentStep.value === 0) {
          step.hasError = !model.value.projectName || !model.value.didType
        }
      },
    },
    {
      label: 'verify',
      // beforeLeave: () => false // 始终允许离开
    },
    {
      label: 'details',
      beforeLeave: (step) => {
        if (currentStep.value === 2) {
          step.hasError = !model.value.scenario || !model.value.expiryDate
        }
      },
    },
    {
      label: 'agreement',
      beforeLeave: (step) => {
        if (currentStep.value === 3) {
          // 只在离开时验证当前步骤
          const allAgreed = Object.values(model.value.agreements).every((v) => v)
          step.hasError = !allAgreed
        }
      },
    },
    {
      label: 'confirm',
      beforeLeave: (step) => {
        // 最终验证逻辑
        const isValid =
          Object.values(model.value.agreements).every((v) => v) && model.value.scenario && model.value.expiryDate
        step.hasError = !isValid
        return isValid
      },
    },
  ]),
)

// const isEnterpriseDID = computed(() => model.value.didType === 'enterprise')
// const isOperationalDID = computed(() => model.value.didType === 'operational')

const showSuccessModal = ref(false)
const generatedDID = ref('')
//
// const generateDID = () => {
//   const randomHex = [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
//   generatedDID.value = 'did:ethr: ' + randomHex
//
//   showSuccessModal.value = true
// }

const generateDID = async () => {
  try {
    console.log('Sending POST request to generate DID')
    const response = await fetch('/api/dids', {
      // 代理会处理路径转发
      method: 'POST', // 明确指定 POST 方法
      headers: {
        'Content-Type': 'application/json', // 如果后端需要 JSON 数据
      },
      // body: JSON.stringify({ ... }), // 如果需要传递数据
    })

    if (!response.ok) {
      throw new Error(`Failed to generate DID: ${response.statusText}`)
    }

    const data = await response.json()
    generatedDID.value = data.DID // 假设返回的 DID 在 `did` 字段
    console.log('get DID from cloud! DID is: ', generatedDID.value)
    showSuccessModal.value = true
  } catch (error) {
    console.error('Error generating DID:', error)
  }
}

// 获取文件名称（处理单个文件和数组情况）
const getFileName = (file: VaFile | VaFile[] | undefined): string => {
  if (!file) return 'Not uploaded'
  if (Array.isArray(file)) {
    return file.length > 0 ? file.map((f) => f.name).join(', ') : 'Not uploaded'
  }
  return file.name || 'Not uploaded'
}
const saveAndNavigate = () => {
  localStorage.setItem(
    'paymentData',
    JSON.stringify({
      projectName: model.value.projectName,
      expiryDate: model.value.expiryDate,
      did: generatedDID.value,
    }),
  )
  router.push({ name: 'payment-methods' })
  showSuccessModal.value = false // 关闭弹窗
}
const agreementText = `
Technical Architecture Statement

1. This system adopts a distributed architecture design to ensure high availability and scalability.
2. All data exchange is conducted through encrypted channels to ensure transmission security.
3. The system adopts a microservice architecture, where each service module is deployed independently and does not affect each other.
4. The system design follows the principle of minimum permission and strictly controls the access permissions of each component.

Public Key Management Scheme

1. Adopt the national encryption SM2 algorithm for asymmetric encryption.
2. The public key is periodically rotated and has a maximum validity period of 365 days.
3. The private key is stored in the Hardware Security Module (HSM) to ensure it is not leaked.
4. Provide a public key revocation mechanism that can instantly revoke suspicious public keys.

Data Protection Protocol

1. All user data is encrypted and stored, with key grading management.
2. Implement a data classification and grading protection strategy.
3. Establish data access audit logs and retain them for at least 180 days.
4. Comply with data protection regulations such as GDPR.

User Authorization Management Agreement

1. Adopt OAuth 2.0 authorization framework.
2. Support fine-grained permission control, which can be authorized according to functional modules.
3. The default validity period for authorization tokens is 2 hours, which can be configured.
4. Provide an authorization revocation interface, allowing users to revoke application permissions at any time.

Anti Fraud Agreement

1. Real time monitoring of abnormal behavior patterns.
2. Establish a multi factor authentication mechanism.
3. Implement a trading risk scoring system.
4. Perform secondary verification on suspicious operations.
`.trim()
</script>

<template>
  <h1 class="page-title">DID Application</h1>
  <div class="flex flex-col p-4 bg-backgroundSecondary">
    <VaForm ref="stepForm">
      <VaStepper
        ref="linearStepper"
        v-model="currentStep"
        :steps="steps"
        linear
        class="custom-stepper"
        @finish="generateDID"
      >
        <!-- Step 1: Basic Info -->
        <template #step-content-0>
          <div class="form-container">
            <!-- 项目名称输入框 -->
            <div class="form-row">
              <VaInput
                v-model="model.projectName"
                label="DID Name"
                placeholder="Please enter the DID name"
                :rules="[(v) => !!v || 'The DID name cannot be empty']"
                required-mark
                class="form-input"
              />
            </div>

            <!-- DID类型选择框 -->
            <div class="form-row">
              <VaSelect
                v-model="model.didType"
                label="DID Type"
                placeholder="Please select DID type"
                :options="[
                  { text: 'Enterprise Identity DID', value: 'enterprise' },
                  { text: 'Operational DID', value: 'operational' },
                ]"
                :rules="[(v) => !!v || 'Please select DID type']"
                required-mark
                class="form-input"
                @update:modelValue="console.log('DID类型改变:', model.didType.value)"
              />
            </div>
          </div>
        </template>

        <!-- Step 2: Identity Verification -->
        <template #step-content-1>
          <div :key="'step2-' + model.didType.value" class="identity-verification-container">
            <!-- Enterprise DID Section -->
            <Transition name="fade">
              <div v-show="model.didType.value === 'enterprise'" class="file-upload-section enterprise-section">
                <div class="section-header">
                  <VaIcon name="business" size="24px" color="primary" />
                  <h4 class="va-h5">Enterprise Identification Documents</h4>
                </div>

                <div class="upload-cards">
                  <div class="upload-card">
                    <div class="text-secondary">Business License</div>
                    <VaFileUpload
                      v-model="model.enterpriseFiles.businessLicense"
                      dropzone
                      file-types="image/*,.pdf"
                      label="营业执照"
                      bordered
                      color="primary"
                    >
                      <template #file="{ file }">
                        <div class="file-preview">
                          <VaIcon name="description" size="36px" />
                          <span class="file-name">{{ file.name }}</span>
                        </div>
                      </template>
                      <template #empty>
                        <div class="upload-empty-state">
                          <VaIcon name="cloud_upload" size="48px" color="primary" />
                          <p>拖拽文件到此处或点击上传</p>
                          <p class="text-secondary">支持格式: JPG, PNG, PDF</p>
                        </div>
                      </template>
                    </VaFileUpload>
                  </div>

                  <div class="upload-card">
                    <div class="text-secondary">Certificate of Legal Representative</div>
                    <VaFileUpload
                      v-model="model.enterpriseFiles.legalPersonID"
                      dropzone
                      file-types="image/*,.pdf"
                      label="法定代表人身份证"
                      bordered
                      color="primary"
                    >
                      <!-- 同上传组件模板 -->
                    </VaFileUpload>
                  </div>

                  <div class="upload-card">
                    <div class="text-secondary">Digital Certificate</div>
                    <VaFileUpload
                      v-model="model.enterpriseFiles.digitalCertificate"
                      dropzone
                      file-types=".pem,.cer,.pfx"
                      label="数字证书"
                      bordered
                      color="primary"
                    >
                      <!-- 同上传组件模板 -->
                    </VaFileUpload>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Operational DID Section -->
            <Transition name="fade">
              <div v-show="model.didType.value === 'operational'" class="file-upload-section operational-section">
                <div class="section-header">
                  <VaIcon name="engineering" size="24px" color="success" />
                  <h4 class="va-h5">Operation certification documents</h4>
                </div>

                <div class="upload-cards">
                  <div class="upload-card">
                    <div class="text-secondary">Business License</div>
                    <VaFileUpload
                      v-model="model.operationalFiles.businessLicense"
                      dropzone
                      file-types="image/*,.pdf"
                      label="营业执照"
                      bordered
                      color="success"
                    >
                      <!-- 同上传组件模板 -->
                    </VaFileUpload>
                  </div>

                  <div class="upload-card">
                    <div class="text-secondary">Power of Attorney</div>
                    <VaFileUpload
                      v-model="model.operationalFiles.authorizationLetter"
                      dropzone
                      file-types="image/*,.pdf"
                      label="授权委托书"
                      bordered
                      color="success"
                    >
                      <!-- 同上传组件模板 -->
                    </VaFileUpload>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </template>

        <!-- Step 3: Application Details -->
        <template #step-content-2>
          <div class="form-container">
            <!-- 应用场景说明 -->
            <div class="form-row">
              <VaTextarea
                v-model="model.scenario"
                label="Application scenario description"
                placeholder="Please provide a detailed description of your application scenario and usage purpose"
                :rules="[(v) => !!v || 'Mandatory Field']"
                required-mark
                class="form-input"
                autosize
                min-rows="3"
                max-rows="6"
              />
            </div>

            <!-- 到期时间 -->
            <div class="form-row">
              <VaDateInput
                v-model="model.expiryDate"
                label="Authorization expiration date"
                placeholder="Please select the authorization expiration date"
                :rules="[(v) => !!v || 'Mandatory Field']"
                required-mark
                class="form-input"
                :input-props="{ clearable: true }"
              />
            </div>

            <!-- 设备唯一标识 -->
            <div class="form-row">
              <VaInput
                v-model="model.deviceId"
                label="Unique device identifier (optional)"
                placeholder="Please enter the device ID or serial number"
                class="form-input"
                :messages="['If you need to bind a specific device, please fill in this field']"
              />
            </div>

            <!-- 合规证明 -->
            <div class="form-row">
              <div class="text-secondary">Compliance Certification Document (optional)</div>
              <VaFileUpload
                v-model="model.complianceProof"
                file-types="image/*,.pdf"
                label="合规证明文件 (可选)"
                class="form-input"
                dropzone
              />
            </div>
          </div>
        </template>

        <!-- Step 4: Agreements -->
        <template #step-content-3>
          <div class="agreement-container">
            <!-- 协议文本区域 -->
            <VaCard class="agreement-card">
              <VaScrollContainer class="agreement-scroll-container" color="primary" vertical horizontal>
                <pre class="agreement-text">{{ agreementText }}</pre>
              </VaScrollContainer>
            </VaCard>

            <!-- 同意事项 -->
            <div class="agreement-options">
              <VaCheckbox
                v-model="model.agreements.techArchitecture"
                label="I have fully read, understood, and fully agree to all terms and conditions of the technical architecture statement. And voluntarily accept its constraints."
                :rules="[(v) => !!v || 'Must agree']"
                class="agreement-checkbox"
              />
              <VaCheckbox
                v-model="model.agreements.keyManagement"
                label="I have confirmed that the Public Key Management Scheme complies with the requirements of GM/T 0035-2014 Cryptography Industry Standard and Level Protection 2.0."
                :rules="[(v) => !!v || 'Must agree']"
                class="agreement-checkbox"
              />
              <VaCheckbox
                v-model="model.agreements.userAuthorization"
                label="I have read and fully understood all the terms of the User Authorization Management Agreement, and confirm that the agreement complies with the provisions of the Personal Information Protection Law. I voluntarily accept its constraints."
                :rules="[(v) => !!v || 'Must agree']"
                class="agreement-checkbox"
              />
              <VaCheckbox
                v-model="model.agreements.antiFraud"
                label="I have understood and agreed that the platform will analyze security factors such as trading equipment and network environment, and require secondary verification for abnormal login. The account risk level will be adjusted based on usage behavior."
                :rules="[(v) => !!v || 'Must agree']"
                class="agreement-checkbox"
              />
            </div>
          </div>
        </template>

        <!-- Step 5: Review and Submit -->
        <template #step-content-4>
          <VaCard class="summary-card">
            <VaCardContent>
              <div class="summary-header">
                <VaIcon name="check_circle" color="primary" size="24px" class="mr-2" />
                <h3 class="va-h4">Summary of Application Information</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 基础信息列 -->
                <div class="info-column">
                  <VaCard class="info-card" stripe stripe-color="primary">
                    <VaCardTitle class="info-title">
                      <VaIcon name="info" size="18px" class="mr-2" />
                      Basic Information
                    </VaCardTitle>
                    <VaCardContent>
                      <div class="info-item">
                        <span class="info-label">DID Name:</span>
                        <span class="info-value">{{ model.projectName }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">DID Type:</span>
                        <VaTag :color="model.didType.value === 'enterprise' ? 'primary' : 'success'">
                          {{ model.didType.value === 'enterprise' ? 'Enterprise Identity DID' : 'Operational DID' }}
                        </VaTag>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Application Scenarios:</span>
                        <span class="info-value">{{ model.scenario }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Expiration Date:</span>
                        <span class="info-value">{{ model.expiryDate }}</span>
                      </div>
                      <div v-if="model.deviceId" class="info-item">
                        <span class="info-label">Equipment Identification:</span>
                        <span class="info-value code-text">{{ model.deviceId }}</span>
                      </div>
                    </VaCardContent>
                  </VaCard>
                </div>

                <!-- 文件信息列 -->
                <div class="info-column">
                  <VaCard class="info-card" stripe stripe-color="secondary">
                    <VaCardTitle class="info-title">
                      <VaIcon name="folder" size="18px" class="mr-2" />
                      File Information
                    </VaCardTitle>
                    <VaCardContent>
                      <!-- 企业文件 -->
                      <div v-if="model.didType.value === 'enterprise'" class="file-section">
                        <div class="file-header">
                          <VaIcon name="business" color="primary" size="16px" />
                          <span class="file-title">Enterprise Files</span>
                        </div>
                        <ul class="file-list">
                          <li class="file-item">
                            <VaIcon name="description" size="14px" />
                            <span>Business License: {{ getFileName(model.enterpriseFiles.businessLicense) }}</span>
                          </li>
                          <li class="file-item">
                            <VaIcon name="badge" size="14px" />
                            <span>Corporate Identity: {{ getFileName(model.enterpriseFiles.legalPersonID) }}</span>
                          </li>
                          <li class="file-item">
                            <VaIcon name="lock" size="14px" />
                            <span
                              >Digital Certificate: {{ getFileName(model.enterpriseFiles.digitalCertificate) }}</span
                            >
                          </li>
                        </ul>
                      </div>

                      <!-- 运营文件 -->
                      <div v-else-if="model.didType.value === 'operational'" class="file-section">
                        <div class="file-header">
                          <VaIcon name="engineering" color="success" size="16px" />
                          <span class="file-title">Operational Documents</span>
                        </div>
                        <ul class="file-list">
                          <li class="file-item">
                            <VaIcon name="description" size="14px" />
                            <span>Business License: {{ getFileName(model.operationalFiles.businessLicense) }}</span>
                          </li>
                          <li class="file-item">
                            <VaIcon name="gavel" size="14px" />
                            <span
                              >Authorization Letter: {{ getFileName(model.operationalFiles.authorizationLetter) }}</span
                            >
                          </li>
                        </ul>
                      </div>

                      <!-- 合规证明 -->
                      <div v-if="model.complianceProof" class="file-section">
                        <div class="file-header">
                          <VaIcon name="verified" color="warning" size="16px" />
                          <span class="file-title">Compliance Certificate</span>
                        </div>
                        <div class="file-item">
                          <VaIcon name="attach_file" size="14px" />
                          <span>{{ getFileName(model.complianceProof) }}</span>
                        </div>
                      </div>
                    </VaCardContent>
                  </VaCard>
                </div>
              </div>
            </VaCardContent>
          </VaCard>
        </template>
      </VaStepper>
    </VaForm>
  </div>

  <!-- Success Modal -->
  <VaModal v-model="showSuccessModal" title="DID application successful!" hide-default-actions>
    <p class="mb-4">Your DID has been successfully generated：</p>
    <VaInput v-model="generatedDID" readonly class="mb-4" />
    <VaButton block @click="saveAndNavigate">Close</VaButton>
  </VaModal>
</template>

<style scoped lang="scss">
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.form-row {
  width: 100%;
  max-width: 400px;
  margin-bottom: 1rem;
}

.form-input {
  width: 100% !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .form-container {
    padding: 0 10px;
  }

  .form-row {
    max-width: 100%;
  }
}
.va-ul {
  padding-left: 1.5rem;
  list-style-type: disc;
}
.identity-verification-container {
  padding: 1.5rem;
  background: var(--va-background-primary);
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.file-upload-section {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--va-background-secondary);
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  &.enterprise-section {
    border-left: 4px solid var(--va-primary);
  }

  &.operational-section {
    border-left: 4px solid var(--va-success);
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  h4 {
    margin: 0;
    color: var(--va-text-primary);
  }
}

.upload-cards {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.upload-card {
  background: var(--va-background-element);
  border-radius: 0.5rem;
  padding: 1.25rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.upload-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: var(--va-text-secondary);

  p {
    margin: 0.5rem 0 0;
  }
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;

  .file-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.form-step-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px;
}
.custom-stepper {
  // 确保 stepper 容器宽度足够
  width: 100%;

  // 控制按钮容器样式
  :deep(.va-stepper__controls) {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;

    // 控制按钮样式
    .va-button {
      min-width: 120px;
    }
  }
}
/* 响应式调整 */
@media (max-width: 768px) {
  .form-step-content {
    padding: 0;
  }
}

//3
//.agreement-container {
//  display: flex;
//  flex-direction: column;
//  align-items: center;
//  max-width: 2000px;
//  margin: 0 auto;
//  padding: 0 20px;
//  gap: 2rem;
//}
//
.agreement-scroll-container {
  height: 300px;
  width: 100%;
  padding: 16px;
  width: 90%; /* 调整为90%宽度，留出两边空间 */
  margin: 0 auto; /* 水平居中 */
  background-color: #1a237e; /* 深蓝色背景 */
  margin: 0 auto 2rem auto; /* 增加下边距2rem */
}
.agreement-card {
  width: 100%;
  padding: 0;
  overflow: hidden;
  display: flex;
  justify-content: center; /* 卡片内容居中 */
}

.agreement-text {
  width: 100% !important;
  background-color: transparent; /* 移除原背景色 */
  border: none; /* 移除边框 */
  padding: 12px;
  font-family: 'Courier New', monospace; /* 增强等宽字体 */
  line-height: 1.6; /* 增加行高提升可读性 */
  margin: 0 auto;
  display: block;
  color: #ffffff; /* 白色文字 */
  font-size: 14px; /* 调整字体大小 */
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3); /* 文字阴影增强对比度 */
}

.agreement-options {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  align-items: center; /* 复选框内容居中 */
  margin: 0 auto; /* 水平居中 */
}

.agreement-checkbox {
  width: 100%;
  max-width: none;
  margin: 0 auto; /* 单个复选框居中 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .agreement-container {
    padding: 0 10px;
    gap: 1.5rem;
  }

  .agreement-scroll-container {
    width: 95%;
    height: 250px;
  }

  .agreement-options {
    grid-template-columns: 1fr; /* 单列布局 */
    max-width: 100%;
  }
}
//4
.summary-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.summary-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--va-background-border);
}

.info-column {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.info-card {
  height: 100%;
  border-radius: 8px;
  transition: transform 0.2s;
}

.info-card:hover {
  transform: translateY(-2px);
}

.info-title {
  font-weight: 600;
  color: var(--va-primary);
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--va-background-border);
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--va-background-secondary);
}

.info-label {
  font-weight: 500;
  color: var(--va-text-primary);
  min-width: 100px;
  margin-right: 12px;
}

.info-value {
  color: var(--va-text-secondary);
  word-break: break-word;
}

.code-text {
  font-family: 'Courier New', monospace;
  background: var(--va-background-element);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.file-section {
  margin-bottom: 16px;
}

.file-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: var(--va-text-primary);
}

.file-title {
  font-weight: 500;
  margin-left: 6px;
}

.file-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 6px 0;
  color: var(--va-text-secondary);
}

.file-item .va-icon {
  margin-right: 8px;
  color: var(--va-primary);
}

@media (max-width: 768px) {
  .summary-header {
    margin-bottom: 16px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-label {
    margin-bottom: 4px;
    margin-right: 0;
  }
}
</style>
