<template>
    <div>
        <UCard
            class="mb-4 border-2 border-transparent hover:border-green-500 transition-all duration-300 ease-in-out cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center"
            @click="handleNewProject()">
            <UIcon name="i-heroicons-plus" class="w-10 h-10" />
        </UCard>
        <UModal v-model="newProjectModal" :ui="{ container: 'flex items-center justify-center min-h-screen' }">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    Add New Project
                </template>

                <UFormGroup label="Project Name" class="mb-2" :error="projectError">
                    <UInput placeholder="MyProject" icon="i-heroicons-pencil" v-model="project" />
                </UFormGroup>

                <template #footer>
                    <div class="footer-container">
                        <UButton class="right-button" :label="button.label" :icon="button.icon"
                            :trailing="button.trailing" :loading="isCreating" @click="handleSubmit" />
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>

<script lang="ts" setup>
import { useProject } from '@/composables/useProject';
import { ref, watch } from 'vue';
import { appDataDir } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/api/fs";

const { createProject, isCreating } = useProject();
const emit = defineEmits(["projectCreated"]);
const toast = useToast();

const project = ref('');
const projectError = ref('');
const newProjectModal = ref(false);

const button = ref({
    label: 'Create Project',
    icon: 'i-heroicons-pencil-square',
    trailing: false,
});

watch(project, async (newVal) => {
    validateProjectName(newVal);
});

const handleNewProject = () => {
    newProjectModal.value = true;
}

const validateProjectName = async (name: string) => {
    if (!name) {
        projectError.value = 'Project name is required.';
        return;
    }

    const projectPath = `${await appDataDir()}/LegionJS/${name}`;
    const projectExists = await exists(projectPath);

    projectError.value = projectExists ? 'A project with this name already exists.' : '';
}

const handleSubmit = async () => {
    if (!project.value || projectError.value) {
        toast.add({
            id: 'setup_error',
            title: 'Setup Failed',
            description: 'Please fill in all required fields.',
            icon: 'i-heroicons-exclamation-circle',
            timeout: 5000,
        });
        return;
    }

    try {
        await createProject(project.value);
        toast.add({
            id: 'setup_completed',
            title: 'Project Created',
            description: `Your project "${project.value}" has been created successfully.`,
            icon: 'i-heroicons-check-circle',
            timeout: 5000,
        });
        project.value = "";
        newProjectModal.value = false;
        emit("projectCreated");
    } catch (error) {
        console.error('Error creating project:', error);
        toast.add({
            id: 'setup_error',
            title: 'Setup Failed',
            description: 'Could not create the project. Check permissions.',
            icon: 'i-heroicons-exclamation-circle',
            timeout: 5000,
        });
    }
};
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