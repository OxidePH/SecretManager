<template>
	<div data-tauri-drag-region class="titlebar">
		<div class="titlebar-buttons">
			<div class="titlebar-button close" @click="isOnExit = true">
				<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2"
					stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</div>
			<div class="titlebar-button minimize" @click="handleMinimize">
				<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2"
					stroke-linecap="round" stroke-linejoin="round">
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
			</div>
			<div class="titlebar-button developer" @click="handleDeveloper">
				<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2"
					stroke-linecap="round" stroke-linejoin="round">
					<path d="M16 18L22 12L16 6"></path>
					<path d="M8 6L2 12L8 18"></path>
					<path d="M14.5 4L9.5 20"></path>
				</svg>
			</div>
		</div>
		<div class="app-name">Oxide Secret Manager</div>

		<UModal v-model="isOnExit" :ui="{ container: 'flex items-center justify-center min-h-screen' }">
			<UCard :ui="{
				ring: '',
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
			}" class="w-full max-w-md">
				<template #header> Close Oxide Secret Manager? </template>

				<p> Are you sure you want to close Oxide Secret Manager? </p>

				<template #footer>
					<div class="flex justify-end space-x-2">
						<UButton @click="isOnExit = false" variant="ghost">Cancel</UButton>
						<UButton @click="handleClose" variant="solid" color="red">Close</UButton>
					</div>
				</template>
			</UCard>
		</UModal>

		<UModal v-model="isDeveloperOpen">
			<UCard :ui="{
				ring: '',
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
			}">
				<template #header> Developer Settings 🥷 </template>

				<UCommandPalette ref="commandPaletteRef" :groups="groups" :autoselect="false"
					@update:model-value="onSelect" />

				<template #footer> Surelle 2025 </template>
			</UCard>
		</UModal>
	</div>
</template>

<script lang="ts" setup>
import { appDataDir } from "@tauri-apps/api/path";
import { removeFile, readDir } from "@tauri-apps/api/fs";
import { appWindow } from "@tauri-apps/api/window";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const toast = useToast();
const router = useRouter();
const isOnExit = ref(false);
const isDeveloperOpen = ref(false);
const commandPaletteRef = ref();

const clearWorkspaces = async () => {
	try {
		const dir = await appDataDir();
		const files = await readDir(dir, { recursive: true });

		for (const file of files) {
			if (file.name?.endsWith(".hold")) {
				await removeFile(file.path);
			}
		}
		toast.add({
			id: 'developer_clearworkspace',
			title: 'Workspaces Cleared',
			description: 'All workspaces have been cleared successfully.',
			icon: 'i-heroicons-exclamation-circle',
			timeout: 5000,
		});
		router.push("/setup/welcome");
	} catch (error) {
		console.error("Failed to clear workspaces:", error);
	}
};

const handleMinimize = () => {
	appWindow.minimize();
};

const handleClose = () => {
	appWindow.close();
};

const handleDeveloper = () => {
	isDeveloperOpen.value = true;
};

const users = [
	{
		id: "surelle-ha",
		label: "surelle-ha",
		href: "https://github.com/surelle-ha",
		target: "_blank",
		avatar: { src: "https://github.com/surelle-ha.png", loading: "lazy" },
	},
	{
		id: "kthrndzmm",
		label: "kthrndzmm",
		href: "https://github.com/kthrndzmm",
		target: "_blank",
		avatar: { src: "https://github.com/kthrndzmm.png", loading: "lazy" },
	},
	{
		id: "base64-one",
		label: "base64-one",
		href: "https://github.com/base64-one",
		target: "_blank",
		avatar: { src: "https://github.com/base64-one.png", loading: "lazy" },
	},
	{
		id: "fdennis1290",
		label: "fdennis1290",
		href: "https://github.com/fdennis1290",
		target: "_blank",
		avatar: { src: "https://github.com/fdennis1290.png", loading: "lazy" },
	},
];

const actions = [
	{
		id: "hide-window",
		label: "Hide Window",
		icon: "i-heroicons-eye",
		click: async () => await appWindow.hide(),
		shortcuts: ["⌘", "H"],
	},
	{
		id: "clear-workspaces",
		label: "Clear Workspaces",
		icon: "i-heroicons-server-stack",
		click: async () => await clearWorkspaces(),
		shortcuts: ["⌘", "C"],
	},
	{
		id: "config-smtp",
		label: "Configure SMTP",
		icon: "i-heroicons-envelope",
		click: async () => await appWindow.hide(),
		shortcuts: ["⌘", "S"],
	},
];

const groups = computed(() =>
	[{
		key: "developers",
		label: "Developers",
		commands: users.slice(0, users.length),
	},
	{
		key: "actions",
		commands: actions,
	}].filter(Boolean)
);

const onSelect = (option: any) => {
	if (option.click) {
		option.click();
	} else if (option.to) {
		router.push(option.to);
	} else if (option.href) {
		window.open(option.href, "_blank");
	}
};
</script>

<style scoped>
.titlebar {
	z-index: 999999;
	height: 30px;
	background: #111827;
	user-select: none;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	padding: 0 10px;
}

.titlebar-buttons {
	display: flex;
	gap: 8px;
}

.titlebar-button {
	width: 14px;
	height: 14px;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #ff5f57;
	cursor: pointer;
}

.titlebar-button.minimize {
	background-color: #ffbd2e;
}

.titlebar-button.developer {
	background-color: #9a2eff;
}

.titlebar-button svg {
	width: 8px;
	height: 8px;
	stroke-width: 2;
}

.titlebar-button:hover {
	opacity: 0.8;
}

.app-name {
	margin-left: auto;
	padding-right: 3px;
	font-size: 14px;
	color: #f3f3f4;
}
</style>