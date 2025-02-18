import { appDataDir } from "@tauri-apps/api/path";
import { readDir } from "@tauri-apps/api/fs";

export function useWorkspace() {
	const isVaultExists = async () => {
		const appDir = await appDataDir();
		const files = await readDir(appDir);
		return files.some((file) => file.name?.endsWith(".hold"));
	};

	const getAllVaults = async () => {
		const appDir = await appDataDir();
		const files = await readDir(appDir);
		return files
			.filter((file) => file.name?.endsWith(".hold"))
			.map((file) => file.name);
	};

	return {
		isVaultExists,
		getAllVaults
	};
}
