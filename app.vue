<template>
	<Titlebar />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>

	<UNotifications />
	<DeveloperSettings />
</template>

<script setup>
import Titlebar from '~/components/titlebar.vue'
import DeveloperSettings from '~/components/dev-settings.vue'
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