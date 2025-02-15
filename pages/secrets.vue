<template>
	<UContainer>
		<NewSecret />
		<SecretTable />
	</UContainer>
</template>

<script setup lang="ts">
import SecretTable from "~/components/secret-table.vue";
import NewSecret from "~/components/new-secret.vue";
definePageMeta({
	middleware: "setup-middleware",
});
</script>
