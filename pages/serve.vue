<template>
	<div>
		<UToggle size="2xl" on-icon="i-heroicons-check-20-solid" off-icon="i-heroicons-x-mark-20-solid"
			v-model="connect" :loading="loading" />
	</div>
</template>

<script lang="ts" setup>
definePageMeta({
	middleware: "setup-middleware",
});

const connect = ref(false);
const loading = ref(false);

watch(connect, async (newValue) => {
	loading.value = true;
	await simulateConnection(newValue);
	loading.value = false;
});

const simulateConnection = (connect: boolean) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			alert(connect ? "Connected" : "Disconnected");
			resolve(true);
		}, 2000); // Simulate a 2-second connection process
	});
};
</script>

<style scoped></style>