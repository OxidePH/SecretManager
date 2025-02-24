<template>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800 w-full' }">
        <template #header>
            LegionJS Setup
        </template>

        <UFormGroup label="Secret Key" class="mb-2" :error="secretKeyError">
            <UInput icon="i-heroicons-key" v-model="secretKey" />
        </UFormGroup>

        <UFormGroup label="Data Key" help="This key will be used to encrypt your data.">
            <UInput icon="i-heroicons-key" v-model="dataKey" disabled />
        </UFormGroup>

        <template #footer>
            <div class="footer-container">
                <UButton class="left-button" label="Export Key" icon="i-heroicons-arrow-down-tray"
                    @click="handleExport" />
                <UButton class="right-button" :label="button.label" :icon="button.icon" :trailing="button.trailing"
                    :loading="button.loading" @click="handleSubmit" />
            </div>
        </template>
    </UCard>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: "setup"
});
import { useKey } from '@/composables/useKey';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const { secretKey, dataKey, generateDataKey, saveDataKey, checkDataKeyExists } = useKey();
const secretKeyError = ref('');

const button = ref({
    label: 'Complete Setup',
    icon: 'i-heroicons-pencil-square',
    trailing: false,
    loading: false
});

onMounted(async () => {
    const keyExists = await checkDataKeyExists();
    console.log(keyExists)
    if (keyExists) {
        return navigateTo("/setup/new-vault");
    }

    await generateDataKey(secretKey.value);
    await saveDataKey();
});

watch(secretKey, async (newVal) => {
    await generateDataKey(newVal);
});

const handleSubmit = async () => {
    if (!secretKey.value) {
        secretKeyError.value = 'Secret key is required.';
        return;
    }

    button.value.loading = true;
    button.value.label = 'Setting up...';

    try {
        await saveDataKey();
        toast.add({
            title: 'Setup Completed',
            description: 'Your data key is stored.',
            icon: 'i-heroicons-key',
            timeout: 5000,
        });
        router.push('/setup/new-vault');
    } catch (error) {
        console.error('Error creating vault:', error);
        toast.add({
            title: 'Setup Failed',
            description: 'Could not create the vault. Check permissions.',
            icon: 'i-heroicons-exclamation-circle',
            timeout: 5000,
        });
    } finally {
        button.value.loading = false;
        button.value.label = 'Complete Setup';
    }
};
</script>

<style scoped>
.footer-container {
    display: flex;
    justify-content: flex-end;
}

.left-button {
    margin-right: auto;
}

.right-button {
    margin-left: auto;
}
</style>
