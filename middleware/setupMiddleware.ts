import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { BaseDirectory, readDir, readTextFile } from "@tauri-apps/api/fs";

export default defineNuxtRouteMiddleware(async (to, from) => {
	try {
		const data = await readTextFile("oxidesm.json", {
			directory: BaseDirectory.AppData,
		});

		const parsed = JSON.parse(data);
		console.log(parsed);

		if (!parsed.directory || typeof parsed.directory !== "string") {
			throw new Error("Invalid directory path in oxidesm.json");
		}

		const workspacePath = `${parsed.directory}/OxideSM/workspace`;

		const files = await readDir(workspacePath);

		console.log(files.length);

		// Redirect to setup if workspace is empty and NOT already there
		if (!files.length && to.path !== "/setup/welcome") {
			return navigateTo("/setup/welcome");
		}

		// If workspace exists, ALLOW navigation (do nothing)
		return;
	} catch (error) {
		console.error("Error reading workspace:", error);
		// Redirect only if not already on setup page
		if (to.path !== "/setup/welcome") {
			return navigateTo("/setup/welcome");
		}
	}

	// If everything is fine, do nothing and allow the user to navigate freely.
});
