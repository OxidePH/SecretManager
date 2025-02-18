<template>
	<Titlebar />
	<LoaderFull v-if="isLoading" :message="message" />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>

	<UNotifications :ui="{ strategy: 'override', position: 'top-4' }" />
</template>

<script setup>
import Titlebar from '~/components/titlebar.vue'
import LoaderFull from '~/components/loader-full.vue';

const isLoading = ref(true);
const message = ref('Initializing...');

onMounted(() => {
	setTimeout(() => {
		message.value = 'Preparing the Vaults...';
		setTimeout(() => {
			message.value = 'Retrieving the Vaults...';
			setTimeout(() => {
				message.value = 'Checking encryption keys...';
				setTimeout(() => {
					message.value = 'Starting...';
					setTimeout(() => {
						isLoading.value = false;
					}, 2000);
				}, 1000);
			}, 1000);
		}, 1000);
	}, 1000);
})
</script>

<style>
* {
	user-select: none;
}

html,
body {
	-ms-overflow-style: none;
}

html::-webkit-scrollbar {
	display: none;
}
</style>