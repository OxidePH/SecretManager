<template>
    <UButton size="2xs" variant="link" label="Use" icon="i-heroicons-wrench" @click="isOpen = true" />

    <USlideover v-model="isOpen" class="mt-8 h-full max-h-screen flex flex-col">
        <UCard class="flex flex-col flex-1 h-full overflow-y-auto hide-scrollbar"
            :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <UTabs :items="tabIndex" @change="onChange" />
            <div v-if="activeTab === 0">
                <UCard>
                    <div class="bg-gray-900 overflow-hidden shadow">
                        <div class="px-4 py-5 sm:px-6">
                            <h3 class="text-lg leading-6 font-medium text-white">
                                Vault Profile
                            </h3>
                            <p class="mt-1 max-w-2xl text-sm text-gray-500">
                                This is some information about the {{ vault.name }}
                            </p>
                        </div>
                        <div class="border-t border-white-200 px-4 py-5 sm:p-0">
                            <dl class="sm:divide-y sm:divide-white-200">
                                <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <UFormGroup label="UID" name="uid">
                                        <UInput v-model="vault.sha256" icon="i-heroicons-identification" disabled />
                                    </UFormGroup>
                                </div>
                                <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <UFormGroup label="Vault Name" name="name">
                                        <UInput v-model="vault.name" icon="i-heroicons-lock-closed" disabled />
                                    </UFormGroup>
                                </div>
                                <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <UFormGroup label="Created Date" name="createdAt">
                                        <UInput v-model="vault.createdAt" icon="i-heroicons-calendar" disabled />
                                    </UFormGroup>
                                </div>
                                <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <UFormGroup label="Description" name="description">
                                        <UTextarea v-model="vault.description" row="10" disabled />
                                    </UFormGroup>
                                </div>
                                <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt class="text-sm font-medium text-white-500">
                                        Vault Version
                                    </dt>
                                    <dd class="mt-1 text-sm text-white-900 sm:mt-0 sm:col-span-2">
                                        {{ vault.version || 'Version not found in Vault Metadata' }}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </UCard>
            </div>
            <div v-if="activeTab === 1">
                <UCard>
                    <div class="px-4 py-5 sm:px-6">
                        <h3 class="text-lg leading-6 font-medium text-white">
                            Environment
                        </h3>
                        <p class="mt-1 max-w-2xl text-sm text-gray-500">
                            This is some information about the {{ vault.name }}
                        </p>
                    </div>
                    <div class="px-4 py-2 sm:p-0">
                        <div class="grid grid-cols-2 gap-4">
                            <span class="font-semibold">Name</span>
                            <span class="font-semibold">Value</span>
                            <template v-for="(item, index) in vaultData" :key="index">
                                <UInput v-model="item.entity" placeholder="Name" />
                                <UInput v-model="item.value" placeholder="Value" />
                            </template>
                        </div>
                        <div class="mt-4 flex justify-end">
                            <UButton variant="ghost" @click="handleAddVariable">Add New Variable</UButton>
                            <UButton variant="ghost" @click="handleSaveVariable">Save</UButton>
                        </div>
                    </div>
                </UCard>

            </div>
            <div v-if="activeTab === 2">
                <UCard>
                    Connection Settings
                </UCard>
            </div>

            <template #footer>
                <Placeholder class="h-8" />
            </template>
        </UCard>
    </USlideover>
</template>

<script setup lang="ts">
import { useWorkspace } from '~/composables/useWorkspace';

const emit = defineEmits(["vaultUpdated"]);
const props = defineProps<{
    vault: {
        name: string,
        file: string,
        integrity: "valid" | "corrupted",
        sha256: string,
        createdAt: string,
        version: string,
        description: string,
        data: Array<{
            entity: string,
            value: string,
            createdAt: string
        }>
    }
}>();


const { saveVaultData } = useWorkspace();
const isOpen = ref(false)
const activeTab = ref(0);
const vaultData = ref(props.vault.data)
const tabIndex = [{
    label: 'Information',
    icon: 'i-heroicons-information-circle',
}, {
    label: 'Variables',
    icon: 'i-heroicons-hashtag',
}, {
    label: 'Connection',
    icon: 'i-heroicons-globe-alt',
}]

function onChange(index: number) {
    activeTab.value = index;
}

function handleAddVariable() {
    vaultData.value.push({
        entity: '',
        value: '',
        createdAt: new Date().toISOString()
    })
}

function resetVariableView() {
    emit("vaultUpdated");
    vaultData.value = props.vault.data
}

async function handleSaveVariable() {
    const filteredData = vaultData.value.filter(item => item.entity.trim() && item.value.trim());
    await saveVaultData(props.vault.name, 'data', filteredData);
    vaultData.value = filteredData;
    resetVariableView()
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>