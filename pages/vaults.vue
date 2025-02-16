<template>
	<UContainer>
		<div v-for="file in vaultFiles" :key="file.name">
			<UCard
				class="mb-4 border-2 border-transparent hover:border-green-500 transition-all duration-300 ease-in-out cursor-pointer shadow-md hover:shadow-lg"
				@click="handleClick(file)">
				<template #header>
					<h3 class="text-lg font-semibold">{{ file.name }}</h3>
				</template>
				<p><strong>Size:</strong> {{ file.size }} KB</p>
				<p><strong>Created:</strong> {{ file.created }}</p>
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
