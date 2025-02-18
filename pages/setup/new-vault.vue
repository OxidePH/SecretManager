<template>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800 w-full' }">
        <template #header>
            Oxide Secret Manager Setup
        </template>

        <UFormGroup label="Vault Name" class="mb-2" :error="vaultError">
            <UInput placeholder="OxideVault" icon="i-heroicons-pencil" v-model="vault" />
        </UFormGroup>

        <template #footer>
            <div class="footer-container">
                <UButton class="right-button" :label="button.label" :icon="button.icon" :trailing="button.trailing"
                    :loading="button.loading" @click="handleSubmit" />
            </div>
        </template>
    </UCard>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: "setup",
    middleware: "setup-middleware",
});
import { getName, getVersion } from '@tauri-apps/api/app';
import { v4 as uuidv4 } from 'uuid';
import sign from 'jwt-encode';
import { Stronghold, Client } from "tauri-plugin-stronghold-api";
import { appDataDir } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/api/fs";
import { useKeyStore } from '@/stores/key';
import { useRouter } from 'vue-router';
import { useWorkspace } from '@/composables/useWorkspace';

const toast = useToast();
const router = useRouter();
const keyStore = useKeyStore();
const { isVaultExists } = useWorkspace()

const vault = ref('OxideVault');
const vaultError = ref('');

const button = ref({
    label: 'Complete Setup',
    icon: 'i-heroicons-pencil-square',
    trailing: false,
    loading: false
});

onMounted(async () => {
    const vaultExists = await isVaultExists();
    console.log(vaultExists)
    if (vaultExists) {
        return navigateTo("/");
    }

    await validateVaultName(vault.value);
});

watch(vault, async (newVal) => {
    validateVaultName(newVal);
});

const validateVaultName = async (name: string) => {
    if (!name) {
        vaultError.value = 'Vault name is required.';
        return;
    }

    const vaultPath = `${await appDataDir()}/${name}.hold`;
    const vaultExists = await exists(vaultPath);

    if (vaultExists) {
        vaultError.value = 'A vault with this name already exists.';
    } else {
        vaultError.value = '';
    }
}

const handleSubmit = async () => {
    vaultError.value = !vault.value ? 'Vault name is required.' : '';

    if (!vault.value || vaultError.value) {
        toast.add({
            id: 'setup_error',
            title: 'Setup Failed',
            description: 'Please fill in all required fields.',
            icon: 'i-heroicons-exclamation-circle',
            timeout: 5000,
        });
        return;
    }

    button.value.loading = true;
    button.value.label = 'Setting up...';

    try {
        const vaultPath = `${await appDataDir()}/${vault.value}.hold`;
        console.log(`Vault path: ${vaultPath}`);
        const stronghold = await Stronghold.load(vaultPath, keyStore.dataKey); // Use keyStore.dataKey directly

        let client: Client;
        try {
            client = await stronghold.loadClient(vault.value);
        } catch {
            client = await stronghold.createClient(vault.value);
        }

        const store = client.getStore();
        const jsonString = JSON.stringify({
            name: vault.value,
            createdAt: new Date().toISOString()
        });
        const encodedData = new TextEncoder().encode(jsonString);
        await store.insert("vault_metadata", Array.from(encodedData));
        await stronghold.save();

        toast.add({
            id: 'setup_completed',
            title: 'Setup Completed',
            description: `Your Oxide Secret Manager vault "${vault.value}" is now ready.`,
            icon: 'i-heroicons-key',
            timeout: 5000,
        });

        button.value.loading = false;
        button.value.label = 'Setup Complete';
        router.push('/');
    } catch (error) {
        console.error('Error creating vault:', error);
        toast.add({
            id: 'setup_error',
            title: 'Setup Failed',
            description: 'Could not create the vault. Check permissions.',
            icon: 'i-heroicons-exclamation-circle',
            timeout: 5000,
        });
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
