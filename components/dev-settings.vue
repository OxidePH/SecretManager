<template>
    <div>
        <div class="absolute bottom-5 right-5 z-10">
            <UButton icon="i-heroicons-cog" size="sm" color="primary" square variant="solid" @click="isOpen = true" />
        </div>

        <UModal v-model="isOpen">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    Developer Settings 🥷
                </template>

                <UCommandPalette ref="commandPaletteRef" :groups="groups" :autoselect="false"
                    @update:model-value="onSelect" />

                <template #footer>
                    Surelle 2025
                </template>
            </UCard>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
const router = useRouter()

const commandPaletteRef = ref()
const isOpen = ref(false);

const users = [
    { id: 'surelle-ha', label: 'surelle-ha', href: 'https://github.com/surelle-ha', target: '_blank', avatar: { src: 'https://github.com/surelle-ha.png', loading: 'lazy' } },
    { id: 'kthrndzmm', label: 'kthrndzmm', href: 'https://github.com/kthrndzmm', target: '_blank', avatar: { src: 'https://github.com/kthrndzmm.png', loading: 'lazy' } },
    { id: 'base64-one', label: 'base64-one', href: 'https://github.com/base64-one', target: '_blank', avatar: { src: 'https://github.com/base64-one.png', loading: 'lazy' } },
    { id: 'fdennis1290', label: 'fdennis1290', href: 'https://github.com/fdennis1290', target: '_blank', avatar: { src: 'https://github.com/fdennis1290.png', loading: 'lazy' } },
]

const actions = [
    { id: 'hide-window', label: 'Hide Window', icon: 'i-heroicons-eye', click: async () => await appWindow.hide(), shortcuts: ['⌘', 'H'] },
    { id: 'clear-workspaces', label: 'Clear Workspaces', icon: 'i-heroicons-server-stack', click: async () => await appWindow.hide(), shortcuts: ['⌘', 'C'] },
    { id: 'config-smtp', label: 'Configure SMTP', icon: 'i-heroicons-envelope', click: async () => await appWindow.hide(), shortcuts: ['⌘', 'S'] },
]

const groups = computed(() =>
    [commandPaletteRef.value?.query
        ? {
            key: 'users',
            commands: users
        }
        : {
            key: 'developers',
            label: 'Developers',
            commands: users.slice(0, users.length)
        }, {
        key: 'actions',
        commands: actions
    }].filter(Boolean))

const onSelect = (option: any) => {
    if (option.click) {
        option.click()
    } else if (option.to) {
        router.push(option.to)
    } else if (option.href) {
        window.open(option.href, '_blank')
    }
}
</script>