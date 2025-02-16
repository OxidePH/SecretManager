<template>
	<div class="mt-7">
		<UContainer class="p-6 h-screen">
			<slot />
		</UContainer>
	</div>
	<Dial />
	<Navbar />
</template>

<script setup lang="ts">
import Navbar from "~/components/navbar.vue";
</script>

<style scoped>
div {
	background: #2c2d44;
	background-image: -moz-linear-gradient(45deg, #4b5132 2%, #002025 100%);
	background-image: -webkit-linear-gradient(45deg, #3f3251 2%, #002025 100%);
	background-image: linear-gradient(45deg, #3f3251 2%, #002025 100%);
}
</style>