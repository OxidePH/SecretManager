<template>
	<div class="flex flex-col justify-center items-center min-h-screen">
		<div class="mb-6">
			<img src="/assets/image/logo.png" alt="Logo" class="mx-auto" />
			<p
				id="helper-text-explanation"
				class="mt-2 text-center text-md text-gray-500 dark:text-gray-400"
			>
				Oxide Secret Manager
			</p>
		</div>
		<form class="max-w-sm mx-auto">
			<div class="flex justify-center mb-4 space-x-3">
				<div v-for="n in 6" :key="n">
					<label :for="`code-${n}`" class="sr-only">Code {{ n }}</label>
					<input
						type="text"
						maxlength="1"
						:id="`code-${n}`"
						:ref="(el) => (inputs[n - 1] = el)"
						@input="handleInput(n - 1)"
						@keydown="handleKeydown($event, n - 1)"
						@paste="handlePaste"
						class="outline-0 block w-12 h-12 text-xl font-bold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						required
					/>
				</div>
			</div>
			<p
				id="helper-text-explanation"
				class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400"
			>
				Create a 6-digit PIN to secure your account.
			</p>
		</form>
	</div>
</template>

<script lang="ts" setup>
import { usePin } from "@/composables/usePin";
definePageMeta({
	layout: "auth",
});

const { setPin, getPin } = usePin();

const savePin = async () => {
	const enteredPin = inputs.value.map((input) => input?.value).join("");
	if (enteredPin.length === 6) {
		await setPin(enteredPin);
		const savedPin = await getPin(); // Retrieve the saved PIN
		console.log("Saved PIN:", savedPin);
	}
};

const inputs = ref<(HTMLInputElement | null)[]>([]);

const handleInput = (index: number) => {
	const currentInput = inputs.value[index];
	if (!currentInput) return;

	if (currentInput.value.length === 1 && index < inputs.value.length - 1) {
		inputs.value[index + 1]?.focus();
	}

	// Trigger savePin once all inputs are filled
	const allFilled = inputs.value.every((input) => input?.value.length === 1);
	if (allFilled) {
		savePin();
	}
};

const handleKeydown = (event: KeyboardEvent, index: number) => {
	const currentInput = inputs.value[index];
	if (!currentInput) return;

	// Handle backspace
	if (event.key === "Backspace" && !currentInput.value && index > 0) {
		inputs.value[index - 1]?.focus();
	}
};

const handlePaste = (event: ClipboardEvent) => {
	event.preventDefault();
	const pasteData =
		(event.clipboardData || window.clipboardData)?.getData("text") || "";
	const digits = pasteData.replace(/\D/g, "").split("");

	inputs.value.forEach((input, index) => {
		if (input && digits[index]) {
			input.value = digits[index];
		}
	});

	// Focus the last filled input
	const lastFilledIndex = Math.min(digits.length, inputs.value.length) - 1;
	if (lastFilledIndex >= 0) {
		inputs.value[lastFilledIndex]?.focus();
	}

	// Trigger savePin once all inputs are filled
	const allFilled = inputs.value.every((input) => input?.value.length === 1);
	if (allFilled) {
		savePin();
	}
};
</script>
