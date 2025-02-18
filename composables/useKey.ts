import { ref } from 'vue';
import { getName, getVersion } from '@tauri-apps/api/app';
import { v4 as uuidv4 } from 'uuid';
import sign from 'jwt-encode';
import { appDataDir } from '@tauri-apps/api/path';
import { createDir, writeTextFile, readTextFile, exists } from '@tauri-apps/api/fs';
import { useKeyStore } from '@/stores/key';

export function useKey() {
    const secretKey = ref('');
    const dataKey = ref('');
    const keyStore = useKeyStore(); // Use Pinia store

    const generateDataKey = async (key: string) => {
        const data = {
            platform: await getName(),
            version: await getVersion(),
            key: uuidv4(),
            generatedAt: new Date().toISOString()
        };
        dataKey.value = sign(data, key || 'default-secret');

        keyStore.setDataKey(dataKey.value);
        await saveDataKey();
    };

    const saveDataKey = async () => {
        try {
            const dirPath = `${await appDataDir()}datakey`;
            const filePath = `${dirPath}/datapass.key`;

            if (!(await exists(dirPath))) {
                await createDir(dirPath);
            }

            await writeTextFile(filePath, dataKey.value);
            console.log('Data key saved successfully');
        } catch (error) {
            console.error('Failed to save data key:', error);
        }
    };

    const checkDataKeyExists = async () => {
        const filePath = `${await appDataDir()}datakey/datapass.key`;
        return await exists(filePath);
    };

    const readDataKey = async () => {
        try {
            const filePath = `${await appDataDir()}datakey/datapass.key`;
            if (await exists(filePath)) {
                const storedKey = await readTextFile(filePath);
                dataKey.value = storedKey;
                console.log(storedKey)
                keyStore.setDataKey(storedKey);
            }
        } catch (error) {
            console.error('Failed to read data key:', error);
        }
    };

    return { secretKey, dataKey, generateDataKey, saveDataKey, checkDataKeyExists, readDataKey };
}
