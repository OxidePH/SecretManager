<template>
	<UContainer>
		<UCard
			class="mb-4 border-2 border-transparent hover:border-green-500 transition-all duration-300 ease-in-out cursor-pointer shadow-md hover:shadow-lg">
			<UCommandPalette ref="commandPaletteRef" :groups="groups" :autoselect="false"
				@update:model-value="onSelect" />
		</UCard>


		<div v-for="(file, index) in vaultFiles" :key="file.name">
			<UCard
				class="mb-4 border-2 border-transparent hover:border-green-500 transition-all duration-300 ease-in-out cursor-pointer shadow-md hover:shadow-lg"
				@click="handleClick(file)">
				<template #header>
					<div class="flex items-center space-x-2">
						<div class="flex flex-col">
							<h3 class="text-lg font-semibold leading-tight"
								:class="{ 'text-red-500': file.integrity === 'corrupted' }">
								{{ file.name }}
							</h3>
							<small class="text-gray-500 truncate w-32 block">
								{{ file.sha256 }}
							</small>
						</div>
					</div>
				</template>

				<template #footer>
					<div class="footer-container">
						<UButton size="2xs" variant="link" label="Use" icon="i-heroicons-wrench" />
						<UButton size="2xs" variant="link" label="Security Check"
							:icon="index % 2 === 0 ? 'i-heroicons-shield-exclamation' : 'i-heroicons-check-badge'" />
						<UButton size="2xs" variant="link" label="Link Project" icon="i-heroicons-link" />
					</div>
				</template>
			</UCard>
		</div>
	</UContainer>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: "setup-middleware",
});
import { useWorkspace } from "@/composables/useWorkspace";

const vaultFiles = ref<any>([]);
const router = useRouter()
const toast = useToast()
const commandPaletteRef = ref()
const { getAllVaults } = useWorkspace()

const handleClick = (file: { name: string }) => {
	alert(`Clicked on: ${file.name}`);
};

onMounted(async () => {
	try {
		vaultFiles.value = await getAllVaults();
	} catch (error) {
		console.error("Error reading vault files:", error);
	}
});

const actions = [
	{ id: 'new-file', label: 'Add new file', icon: 'i-heroicons-document-plus', click: () => toast.add({ title: 'New file added!' }), shortcuts: ['⌘', 'N'] },
	{ id: 'new-folder', label: 'Add new folder', icon: 'i-heroicons-folder-plus', click: () => toast.add({ title: 'New folder added!' }), shortcuts: ['⌘', 'F'] },
	{ id: 'hashtag', label: 'Add hashtag', icon: 'i-heroicons-hashtag', click: () => toast.add({ title: 'Hashtag added!' }), shortcuts: ['⌘', 'H'] },
	{ id: 'label', label: 'Add label', icon: 'i-heroicons-tag', click: () => toast.add({ title: 'Label added!' }), shortcuts: ['⌘', 'L'] }
]

const groups = computed(() =>
	[commandPaletteRef.value?.query
		? {
			key: 'actions',
			commands: actions
		}
		: {
			key: 'actions',
			label: 'Actions',
			commands: actions.slice(0, 1)
		}].filter(Boolean))

const onSelect = (option) => {
	if (option.click) {
		option.click()
	} else if (option.to) {
		router.push(option.to)
	} else if (option.href) {
		window.open(option.href, '_blank')
	}
}
</script>