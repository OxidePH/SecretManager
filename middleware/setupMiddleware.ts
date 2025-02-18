import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { readDir } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { useKey } from '@/composables/useKey';

export default defineNuxtRouteMiddleware(async (to, from) => {
	const toast = useToast();
	const { checkDataKeyExists } = useKey();

	try {
		// Check vault files in the app directory
		const appDir = await appDataDir();
		const files = await readDir(appDir);
		const vaultExists = files.some((file) => file.name?.endsWith(".hold"));

		// If no vault exists, navigate to the new-vault setup page
		if (!vaultExists && to.path !== "/setup/new-vault") {
			return navigateTo("/setup/new-vault");
		}

		// Check if the data key exists in the store, otherwise check on disk
		const keyExists = await checkDataKeyExists();
		if (!keyExists && to.path !== "/setup/config") {
			console.log('Data key not found in store, checking disk...');
			return navigateTo("/setup/config");
		} else {
			console.log('Data key found');
		}

		// Allow navigation if both vault and key are valid
		return;

	} catch (error) {
		console.error("Error checking vault files or data key:", error);

		// Handle errors, show toast and redirect if necessary
		if (to.path !== "/setup/welcome") {
			toast.add({
				id: "workspace_error",
				title: "Vaults Not Found",
				description: "Please set up at least one vault first.",
				icon: "i-heroicons-exclamation-circle",
				timeout: 5000,
			});
			return navigateTo("/setup/welcome");
		}
	}
});
