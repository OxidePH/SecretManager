import { appDataDir } from '@tauri-apps/api/path';
import { readDir } from '@tauri-apps/api/fs';
import { Stronghold, Client } from 'tauri-plugin-stronghold-api';
import { useKeyStore } from '@/stores/key';
import { getSHA256Hash as sha256 } from "boring-webcrypto-sha256";

export function useWorkspace() {
	const keyStore = useKeyStore();

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
						createdAt: result.createdAt
					};
				})
		);
		return vaults;
	};

	async function getVaultMetadata(client: Client) {
		const store = client.getStore();
		const data = await store.get('vault_metadata');
		const metadata = new TextDecoder().decode(new Uint8Array(data));
		return JSON.parse(metadata);
	}

	const checkVaultIntegrity = async (filePath: string): Promise<{ integrity: 'valid' | 'corrupted', name: string, createdAt: string | null }> => {
		try {
			const stronghold = await Stronghold.load(filePath, keyStore.dataKey);
			const client = await stronghold.loadClient(filePath.split('/').pop()?.replace('.hold', '') || 'Unknown');
			const meta = await getVaultMetadata(client);
			console.log(meta)

			return {
				integrity: 'valid',
				name: meta.name,
				createdAt: meta.createdAt
			};
		} catch (error) {
			console.error(`Error opening vault at ${filePath}:`, error);
			return {
				integrity: 'corrupted',
				name: 'VAULT_CORRUPTED_ERROR',
				createdAt: null
			};
		}
	};

	return {
		isVaultExists,
		getAllVaults,
	};
}
