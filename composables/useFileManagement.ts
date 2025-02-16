import {
	createDir,
	writeTextFile,
	readTextFile,
	BaseDirectory,
	exists,
} from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";

export function useFileManagement() {
	const saveDirectoryPath = async (path: string) => {
		try {
			await writeTextFile("oxidesm.json", JSON.stringify({ directory: path }), {
				directory: BaseDirectory.AppData,
			});
		} catch (error) {
			console.error("Error saving directory path:", error);
		}
	};

	const loadDirectoryPath = async () => {
		try {
			const data = await readTextFile("oxidesm.json", {
				directory: BaseDirectory.AppData,
			});
			const parsed = JSON.parse(data);
			return parsed.directory || "";
		} catch (error) {
			console.warn(
				"No existing directory path found, or error reading file:",
				error
			);
			return "";
		}
	};

	const validateVault = async (directory: string, name: string) => {
		if (!directory) return false;
		const vaultPath = `${directory}/OxideSM/workspace/${name}`;
		return await exists(vaultPath);
	};

	const selectDirectory = async () => {
		const selected = await open({
			directory: true,
			multiple: false,
			title: "Select Directory",
		});
		return selected || null;
	};

	const createVaultDirectories = async (directory: string, vault: string) => {
		try {
			const oxidePath = `${directory}/OxideSM`;
			const workspacePath = `${oxidePath}/workspace`;
			const vaultPath = `${workspacePath}/${vault}`;

			await createDir(oxidePath, { recursive: true });
			await createDir(workspacePath, { recursive: true });
			await createDir(vaultPath, { recursive: true });

			return true;
		} catch (error) {
			console.error("Error creating directories:", error);
			return false;
		}
	};

	return {
		saveDirectoryPath,
		loadDirectoryPath,
		validateVault,
		selectDirectory,
		createVaultDirectories,
	};
}
