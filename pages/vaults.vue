<template>
	<UContainer>
		<h1 class="text-2xl text-gray-900 dark:text-gray-100 mb-4 tracking-wider">Vaults</h1>
		<newVaultButton @vaultCreated="refreshVaults" />

		<div v-if="vaultFiles.length === 0">
			<USkeleton class="h-[150px] w-full mb-4" :ui="{ background: 'bg-gray-500 dark:bg-gray-800' }" />
			<USkeleton class="h-[150px] w-full mb-4" :ui="{ background: 'bg-gray-500 dark:bg-gray-800' }" />
			<USkeleton class="h-[150px] w-full mb-4" :ui="{ background: 'bg-gray-500 dark:bg-gray-800' }" />
		</div>

		<div v-else class="pb-12">
			<div v-for="(file, index) in vaultFiles" :key="file.name">
				<UCard
					class="mb-4 border-2 border-transparent hover:border-green-500 transition-all duration-300 ease-in-out cursor-pointer shadow-md hover:shadow-lg">
					<template #header>
						<div class="flex items-center space-x-2">
							<div class="flex flex-col">
								<h3 class="text-lg font-semibold leading-tight truncate w-60"
									:class="{ 'text-red-500': file.integrity === 'corrupted' }">
									{{ file.name }}
								</h3>
								<UBadge class="text-gray-500 truncate w-32 block">
									UID: {{ file.sha256 }}
								</UBadge>
							</div>
						</div>
					</template>

					<template #footer>
						<div class="footer-container">
							<SelectVault :vault="file" @vaultUpdated="refreshVaults" />
							<UButton size="2xs" variant="link" label="Security Check"
								:icon="index % 2 === 0 ? 'i-heroicons-shield-exclamation' : 'i-heroicons-check-badge'" />
							<UButton size="2xs" variant="link" label="Link Project" icon="i-heroicons-link" />
						</div>
					</template>
				</UCard>
			</div>
		</div>
	</UContainer>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: "setup-middleware",
});
import SelectVault from "~/components/select-vault-button.vue";
import newVaultButton from "~/components/new-vault-button.vue";
import { useVault } from "~/composables/useVault"

const vaultFiles = ref<any>([]);
const { getAllVaults } = useVault();

const refreshVaults = async () => {
	try {
		vaultFiles.value = await getAllVaults();
	} catch (error) {
		console.error("Error reading vault files:", error);
	}
};

onMounted(refreshVaults); 
</script>
