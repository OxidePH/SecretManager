import { ref } from "vue";
import { invoke } from "@tauri-apps/api/tauri"; // Tauri's API to call Rust commands

const pin = ref<string | null>(null);

export function usePin() {
	const setPin = async (newPin: string) => {
		try {
			if (typeof window.__TAURI_IPC__ !== "undefined") {
				// We're inside the Tauri environment
				const response = await invoke("save_pin", { pin: newPin });
				console.log(response); // This should log success from the Rust command
			} else {
				console.error("Tauri environment is not available.");
			}
		} catch (error) {
			console.error("Error saving PIN:", error);
		}
	};

	const getPin = async () => {
		try {
			const savedPin = await invoke("get_pin");
			return savedPin; // This will return the saved PIN
		} catch (error) {
			console.error("Error fetching PIN:", error);
			return null;
		}
	};

	return { pin, setPin, getPin };
}
