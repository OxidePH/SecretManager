import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { readDir } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const toast = useToast();
	try {
		const appDir = await appDataDir();

		// Read all files in the app data directory
		const files = await readDir(appDir);

		// Check if any .hold files exist
		const vaultExists = files.some((file) => file.name?.endsWith(".hold"));

		if (!vaultExists) {
			throw new Error("No vault files found");
		}

		// Allow navigation if at least one .hold file exists
		return;
	} catch (error) {
		console.error("Error checking vault files:", error);

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
