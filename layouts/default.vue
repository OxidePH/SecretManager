<template>
	<div>
		<slot />
	</div>
	<bottomNavVue />
</template>

<script setup lang="ts">
import { WebviewWindow } from "@tauri-apps/api/window";
import bottomNavVue from "~/components/bottom-nav.vue";

let newWindow = () => {
	const webview = new WebviewWindow("About-tauri-project", {
		url: "/project/about",
		width: 300,
		height: 300,
		resizable: false,
		title: "About tauri project",
	});
	webview.once("tauri://created", function () {
		// webview window successfully created
	});
	webview.once("tauri://error", function (e: any) {
		// an error happened creating the webview window
		console.error(e);
	});
};
</script>
