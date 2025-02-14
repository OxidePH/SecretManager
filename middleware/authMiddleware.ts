import { usePin } from "@/composables/usePin";

export default defineNuxtRouteMiddleware((to, from) => {
	const { getPin } = usePin();

	if (!getPin()) {
		return navigateTo("/auth/create-pin");
	}
});
