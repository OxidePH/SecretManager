<template>
	<UContainer class="flex items-center justify-center min-h-screen bg-animated">
		<slot />
	</UContainer>
</template>

<script setup lang="ts">
</script>

<style scoped>
@keyframes moveBackground {
	from {
		background-position: 0 0;
	}

	to {
		background-position: 100% -100%;
	}
}

/* Background Animation */
.bg-animated::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: url('/assets/image/logo.png') repeat;
	background-size: 150px 150px;
	animation: moveBackground 10s linear infinite;
	z-index: -2;
}

/* Blur Effect */
.bg-animated::after {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	backdrop-filter: blur(5px);
	/* Adjust blur intensity */
	-webkit-backdrop-filter: blur(5px);
	/* For Safari */
	z-index: -1;
}
</style>
