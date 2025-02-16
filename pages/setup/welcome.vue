<template>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800 w-full' }">
        <template #header>
            Welcome to Oxide Secret Manager 🥷
        </template>

        <UTextarea color="gray" variant="outline" v-model="condition" :rows="20" disabled />

        <template #footer>
            <div class="footer-container">
                <UButton class="right-button" :label="button.label" :icon="button.icon" :trailing="button.trailing"
                    :loading="button.loading" @click="handleSubmit" />
            </div>
        </template>
    </UCard>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: "setup",
});
const router = useRouter();

const condition = ref(`By clicking "Agree and Continue", you agree to the Oxide Secret Manager Terms of Service and Privacy Policy. This includes the use of cookies to operate the site and provide you with the best services.

Oxide Secret Manager is designed to securely store and manage your secret keys and environment variables. With our platform, you can:

- **Secure Storage**: Store your secret keys and environment variables securely with advanced encryption.
- **Access Control**: Manage access to your secrets with fine-grained permissions.
- **Audit Logs**: Keep track of all access and changes to your secrets with detailed audit logs.
- **Environment Composition**: Future feature to compose environment files with variable mapping stored in the manager platform.
- **Integration**: Easily integrate with your existing CI/CD pipelines and development workflows.

Our goal is to provide you with a secure and efficient way to manage your secrets, ensuring that your sensitive information is protected at all times.

Thank you for choosing Oxide Secret Manager. We are committed to providing you with the best service and support.`)
const isOpen = ref(true)

const button = ref({
    label: 'Agree and Continue',
    icon: 'i-heroicons-check',
    trailing: false,
    loading: false
})

const handleSubmit = () => {
    button.value.loading = true;
    button.value.label = 'Setting up...';
    setTimeout(() => {
        router.push('/setup/config')
    }, 1000);
}
</script>

<style scoped>
.footer-container {
    display: flex;
    justify-content: flex-end;
}

.right-button {
    margin-left: auto;
}
</style>