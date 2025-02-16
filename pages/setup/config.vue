<template>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800 w-full' }">
        <template #header>
            Oxide Secret Manager Setup
        </template>

        <UFormGroup label="Vault Name" class="mb-2" :error="vaultError">
            <UInput placeholder="OxideVault" icon="i-heroicons-pencil" v-model="vault" />
        </UFormGroup>

        <UFormGroup label="Directory" class="mb-2" :error="directoryError"
            help="OxideSM operates independently of any server and stores data directly on your device.">
            <div class="input-with-button">
                <UInput placeholder="C:\Users\JohnDoe\Documents" icon="i-heroicons-folder" v-model="directory"
                    readonly />
                <UButton class="select-button" label="Select Directory" @click="selectDirectory" />
            </div>
        </UFormGroup>

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
    layout: "auth",
});
import { getName, getVersion } from '@tauri-apps/api/app';
import { createDir, writeTextFile, readTextFile, BaseDirectory, exists } from '@tauri-apps/api/fs';
import { open } from '@tauri-apps/api/dialog';
import { v4 as uuidv4 } from 'uuid';
import sign from 'jwt-encode';

const toast = useToast();
const router = useRouter();

const vault = ref('OxideVault');
const directory = ref(BaseDirectory.Document);
const secretKey = ref('');
const dataKey = ref('');

const vaultExists = ref(false);
const vaultError = ref('');
const directoryError = ref('');
const secretKeyError = ref('');

const button = ref({
    label: 'Complete Setup',
    icon: 'i-heroicons-pencil-square',
    trailing: false,
    loading: false
});

onMounted(async () => {
    await generateDataKey(secretKey.value);
    await loadDirectoryPath();
    await validateVault(vault.value);
});

watch(secretKey, async (newVal) => {
    await generateDataKey(newVal);
});

watch(vault, async (newVal) => {
    await validateVault(newVal);
});

const generateDataKey = async (secretKey: string) => {
    const data = {
        platform: await getName(),
        version: await getVersion(),
        key: uuidv4(),
        generatedAt: new Date().toISOString()
    };
    dataKey.value = sign(data, secretKey);
};

const validateVault = async (name: string) => {
    if (!directory.value) return;
    const vaultPath = `${directory.value}/OxideSM/workspace/${name}`;
    vaultExists.value = await exists(vaultPath);
    vaultError.value = vaultExists.value ? 'Vault name already exists. Choose a different name.' : '';
}

const saveDirectoryPath = async (path: string) => {
    try {
        await writeTextFile('oxidesm.json', JSON.stringify({ directory: path }), { directory: BaseDirectory.AppData });
    } catch (error) {
        console.error("Error saving directory path:", error);
    }
};

const loadDirectoryPath = async () => {
    try {
        const data = await readTextFile('oxidesm.json', { directory: BaseDirectory.AppData });
        const parsed = JSON.parse(data);
        if (parsed.directory) {
            directory.value = parsed.directory;
        }
    } catch (error) {
        console.warn("No existing directory path found, or error reading file:", error);
    }
};

const selectDirectory = async () => {
    const selected = await open({
        directory: true,
        multiple: false,
        title: "Select Directory",
    });
    if (selected) {
        directory.value = selected;
        await saveDirectoryPath(selected);
    }
};

const handleSubmit = async () => {
    vaultError.value = !vault.value ? 'Vault name is required.' : '';
    directoryError.value = !directory.value ? 'Directory is required.' : '';
    secretKeyError.value = !secretKey.value ? 'Secret key is required.' : '';

    if (!vault.value || !directory.value || !secretKey.value || vaultExists.value) {
        toast.add({
            id: 'setup_error',
            title: 'Setup Failed',
            description: 'Please fill in all required fields and ensure the vault name is unique.',
            icon: 'i-heroicons-exclamation-circle',
            timeout: 5000,
        });
        return;
    }

    button.value.loading = true;
    button.value.label = 'Setting up...';

    try {
        const oxidePath = `${directory.value}/OxideSM`;
        const workspacePath = `${oxidePath}/workspace`;
        const vaultPath = `${workspacePath}/${vault.value}`;

        await createDir(oxidePath, { recursive: true });
        await createDir(workspacePath, { recursive: true });
        await createDir(vaultPath, { recursive: true });

        toast.add({
            id: 'setup_completed',
            title: 'Setup Completed',
            description: `Your Oxide Secret Manager is now ready to use.`,
            icon: 'i-heroicons-key',
            timeout: 5000,
        });

        button.value.loading = false;
        button.value.label = 'Setup Complete';
        router.push('/');
    } catch (error) {
        console.error('Error creating directories:', error);
        toast.add({
            id: 'setup_error',
            title: 'Setup Failed',
            description: 'Could not create directories. Check permissions.',
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

.input-with-button {
    display: flex;
    align-items: center;
}

.select-button {
    margin-left: 8px;
}
</style>