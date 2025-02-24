<template>
	<div>
		Builder
		<div v-if="vaultExists !== null">{{ vaultExists ? "Vaults found" : "No vaults" }}</div>
		{{ vaultExists }}
		{{ vaultList }}
	</div>
</template>

<script lang="ts" setup>
definePageMeta({
	middleware: "setup-middleware",
});

import { ref, onMounted } from 'vue';
import { useVault } from '~/composables/useVault'

const { isVaultExists, getAllVaults } = useVault();
const vaultExists = ref<boolean | null>(null);
const vaultList = ref<any>([]);

onMounted(async () => {
	vaultExists.value = await isVaultExists();
	vaultList.value = await getAllVaults();
});
</script>
