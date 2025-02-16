<template>
	<UContainer>
		<div v-for="file in vaultFiles" :key="file.name">
			<UCard
				class="mb-4 border-2 border-transparent hover:border-green-500 transition-all duration-300 ease-in-out cursor-pointer shadow-md hover:shadow-lg"
				@click="handleClick(file)">
				<template #header>
					<div class="flex items-center space-x-2">
						<UIcon name="i-heroicons-shield-exclamation" class="w-5 h-5" />
						<h3 class="text-lg font-semibold">
							{{ file.name }}
						</h3>
					</div>
				</template>
				<template #footer>
					<div class="footer-container">
						<UButton size="2xs" variant="link" label="Use" icon="i-heroicons-wrench" />
						<UButton size="2xs" variant="link" label="Security Check" icon="i-heroicons-shield-check" />
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
import { appDataDir } from "@tauri-apps/api/path";
import { readDir } from "@tauri-apps/api/fs";

const vaultFiles = ref<{ name: string; size: number; created: string }[]>([]);

const handleClick = (file: { name: string }) => {
	alert(`Clicked on: ${file.name}`);
};

onMounted(async () => {
	try {
		const dirPath = await appDataDir();
		const files = await readDir(dirPath);

		const holdFiles = await Promise.all(
			files
				.filter(file => file.name?.endsWith('.hold'))
				.map(async file => {
					if (!file.name) return null;
					const filePath = `${dirPath}/${file.name}`;
					return {
						name: file.name.replace('.hold', ''),
					};
				})
		);

		vaultFiles.value = holdFiles.filter(file => file !== null) as any;
	} catch (error) {
		console.error("Error reading vault files:", error);
	}
});
</script>