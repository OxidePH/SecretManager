<template>
	<div class="wrapper mt-6">
		<UContainer class="p-6">
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
.wrapper {
	min-height: 100vh;
	width: 100%;
	background: #2c2d44;
	background-image: linear-gradient(45deg, #3f3251 2%, #002025 100%);
}
</style>
