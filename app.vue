<template>
	<Titlebar />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>

	<UNotifications :ui="{ strategy: 'override', position: 'top-4' }" />
</template>

<script setup>
import Titlebar from '~/components/titlebar.vue'
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