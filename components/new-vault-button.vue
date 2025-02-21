<template>
    <div>
        <UCard
            class="mb-4 border-2 border-transparent hover:border-green-500 transition-all duration-300 ease-in-out cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center"
            @click="handleNewVault()">
            <UIcon name="i-heroicons-plus" class="w-10 h-10" />
        </UCard>
        <UModal v-model="newVaultModal" :ui="{ container: 'flex items-center justify-center min-h-screen' }">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    Add New Vault
                </template>

                <UFormGroup label="Vault Name" class="mb-2" :error="vaultError">
                    <UInput placeholder="OxideVault" icon="i-heroicons-pencil" v-model="vault" />
                </UFormGroup>

                <template #footer>
                    <div class="footer-container">
                        <UButton class="right-button" :label="button.label" :icon="button.icon"
                            :trailing="button.trailing" :loading="button.loading" @click="handleSubmit" />
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>

<script lang="ts" setup>
import { appDataDir } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/api/fs";
import { Stronghold, Client } from "tauri-plugin-stronghold-api";
import { getVersion } from "@tauri-apps/api/app";

const emit = defineEmits(["vaultCreated"]);
const toast = useToast();
const keyStore = useKeyStore();

const vault = ref('OxideVault');
const vaultError = ref('');
const newVaultModal = ref(false);

const button = ref({
    label: 'Complete Setup',
    icon: 'i-heroicons-pencil-square',
    trailing: false,
    loading: false
});

onMounted(async () => {
    await validateVaultName(vault.value);
});

watch(vault, async (newVal) => {
    validateVaultName(newVal);
});

const handleNewVault = () => {
    newVaultModal.value = !newVaultModal.value
}

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

    const vaultPath = `${await appDataDir()}/${vault.value}.hold`;
    const vaultExists = await exists(vaultPath);

    if (!vaultExists) {
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
            const metaData = JSON.stringify({
                name: vault.value,
                createdAt: new Date().toISOString(),
                version: await getVersion(),
                description: '',
            });
            const encodedMetadata = new TextEncoder().encode(metaData);
            const protectedData = JSON.stringify([{
                entity: "Sample",
                value: "Value for Sample",
                createdAt: new Date().toISOString(),
            }]);
            const encodedprotectedData = new TextEncoder().encode(protectedData);
            await store.insert("metadata", Array.from(encodedMetadata));
            await store.insert("data", Array.from(encodedprotectedData));
            await stronghold.save();

            toast.add({
                id: 'setup_completed',
                title: 'Setup Completed',
                description: `Your Oxide Secret Manager vault "${vault.value}" is now ready.`,
                icon: 'i-heroicons-key',
                timeout: 5000,
            });

            vault.value = "";
            button.value.loading = false;
            button.value.label = 'Setup Complete';
            newVaultModal.value = false;

            emit("vaultCreated");
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
    } else {
        toast.add({
            id: 'setup_error',
            title: 'Setup Failed',
            description: 'Could not create the vault. This already exists.',
            icon: 'i-heroicons-exclamation-circle',
            timeout: 5000,
        });
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