import { appDataDir } from '@tauri-apps/api/path';
import { readDir } from '@tauri-apps/api/fs';
import { Stronghold, Client } from 'tauri-plugin-stronghold-api';
import { useKeyStore } from '@/stores/key';
import { getSHA256Hash as sha256 } from "boring-webcrypto-sha256";

export function useVault() {
	const keyStore = useKeyStore();
	const toast = useToast();

	const isVaultExists = async () => {
		const appDir = await appDataDir();
		const files = await readDir(appDir);
		return files.some((file) => file.name?.endsWith(".hold"));
	};

	const getAllVaults = async () => {
		const appDir = await appDataDir();
		const files = await readDir(appDir);
		const vaults = await Promise.all(
			files
				.filter((file) => file.name?.endsWith(".hold"))
				.map(async (file) => {
					const filePath = `${appDir}/${file.name}`;
					const result = await checkVaultIntegrity(filePath);
					return {
						name: (file.name || '').replace('.hold', ''),
						file: file.name,
						integrity: result.integrity,
						sha256: await sha256((file.name || '').replace('.hold', '')),
						createdAt: result.createdAt,
						version: result.version,
						description: result.description,
						data: result.data
					};
				})
		);
		return vaults;
	};

	async function getVaultData(client: Client, target: string) {
		const store = client.getStore();
		const data = await store.get(target);
		const decodedData = new TextDecoder().decode(new Uint8Array(data));
		return JSON.parse(decodedData);
	}

	async function saveVaultData(vault: string, target: string, newData: any) {
		try {
			const appDir = await appDataDir();
			const filePath = `${appDir}/${vault}.hold`;

			const stronghold = await Stronghold.load(filePath, keyStore.dataKey);
			const clientName = filePath.split('/').pop()?.replace('.hold', '') || 'Unknown';
			const client = await stronghold.loadClient(clientName);

			const store = client.getStore();
			const encodedData = new TextEncoder().encode(JSON.stringify(newData));

			await store.insert(target, Array.from(encodedData));
			await stronghold.save();

			toast.add({
				id: 'vault_save_data_success',
				title: 'Vault Updated Successfully',
				description: `Data for "${target}" has been saved successfully.`,
				icon: 'i-heroicons-check-circle',
				timeout: 5000,
			});
		} catch (error) {
			console.error('Error saving vault data:', error);
			toast.add({
				id: 'vault_save_data_error',
				title: 'Vault Update Failed',
				description: `An error occurred while saving data for "${target}". Please try again.`,
				icon: 'i-heroicons-x-circle',
				timeout: 5000,
			});
		}
	}

	const checkVaultIntegrity = async (filePath: string): Promise<{
		integrity: 'valid' | 'corrupted', name: string, createdAt: string | null, version: string | null, description: string | null, data: [{ entity: string, value: string, createdAt: string | null }] | null
	}> => {
		try {
			const stronghold = await Stronghold.load(filePath, keyStore.dataKey);
			const client = await stronghold.loadClient(filePath.split('/').pop()?.replace('.hold', '') || 'Unknown');
			const metadata = await getVaultData(client, 'metadata');
			const data = await getVaultData(client, 'data');
			console.log(metadata)
			console.log(data)

			return {
				integrity: 'valid',
				name: metadata.name,
				createdAt: metadata.createdAt,
				version: metadata.version,
				description: metadata.descrption,
				data: data
			};
		} catch (error) {
			console.error(`Error opening vault at ${filePath}:`, error);
			return {
				integrity: 'corrupted',
				name: 'VAULT_CORRUPTED_ERROR',
				createdAt: null,
				version: null,
				description: null,
				data: null
			};
		}
	};

	return {
		isVaultExists,
		getAllVaults,
		saveVaultData
	};
}
