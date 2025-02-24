<template>
	<UContainer>
		<h1 class="text-2xl text-gray-900 dark:text-gray-100 mb-4 tracking-wider">Projects</h1>
		<NewProjectButton @projectCreated="refreshProjects" />

		<div v-if="projectList.length === 0">
			<USkeleton class="h-[150px] w-full mb-4" :ui="{ background: 'bg-gray-500 dark:bg-gray-800' }" />
			<USkeleton class="h-[150px] w-full mb-4" :ui="{ background: 'bg-gray-500 dark:bg-gray-800' }" />
			<USkeleton class="h-[150px] w-full mb-4" :ui="{ background: 'bg-gray-500 dark:bg-gray-800' }" />
		</div>

		<div v-for="(file) in projectList" :key="file.name">
			<UCard
				class="mb-4 border-2 border-transparent hover:border-green-500 transition-all duration-300 ease-in-out cursor-pointer shadow-md hover:shadow-lg">
				<template #header>
					<div class="flex items-center space-x-2">
						<div class="flex flex-col">
							<h3 class="text-md font-semibold leading-tight truncate w-25 flex items-center space-x-2">
								<span>{{ file.author }}/{{ file.name }}</span>
								<UBadge variant="subtle" color="gray">
									v{{ file.version }}
								</UBadge>
							</h3>
						</div>
					</div>
				</template>

				<template #footer>
					<div class="footer-container flex space-x-2">
						<!-- First Dropdown: Standard Menu -->
						<UDropdown :items="menuItems(file)" :popper="{ placement: 'bottom-start' }">
							<UButton size="2xs" variant="link" label="Menu" icon="i-heroicons-chevron-down-20-solid" />
						</UDropdown>

						<!-- Second Dropdown: Custom Scripts -->
						<UDropdown :items="scriptItems(file)" :popper="{ placement: 'bottom-start' }">
							<UButton size="2xs" variant="link" label="Scripts"
								icon="i-heroicons-chevron-down-20-solid" />
						</UDropdown>
					</div>
				</template>
			</UCard>
		</div>
	</UContainer>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: "setup-middleware",
});
import { onMounted } from 'vue';
import NewProjectButton from "@/components/new-project-button";
import { useVault } from "@/composables/useVault";

const toast = useToast();
const { fetchProjects, deleteProject, projects } = useProject();
const projectList = projects;

const handleDelete = (projectName: string) => {
	deleteProject(projectName);
	toast.add({
		id: 'project_deleted',
		title: `Project Deleted`,
		description: `${projectName} has been deleted.`,
		icon: 'i-heroicons-exclamation-circle',
		timeout: 5000,
	});
};

const menuItems = (file: any) => {
	return [
		[
			{
				label: 'Open Code',
				avatar: {
					src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/512px-Visual_Studio_Code_1.35_icon.svg.png?20210804221519'
				}
			}
		],
		[
			{
				label: 'Edit', icon: 'i-heroicons-pencil-square-20-solid', shortcuts: ['E'],
				click: () => console.log('Edit', file.name)
			},
			{
				label: 'Duplicate', icon: 'i-heroicons-document-duplicate-20-solid', shortcuts: ['D'], disabled: true
			}
		],
		[
			{
				label: 'Archive', icon: 'i-heroicons-archive-box-20-solid'
			},
			{
				label: 'Move', icon: 'i-heroicons-arrow-right-circle-20-solid'
			}
		],
		[
			{
				label: 'Delete', icon: 'i-heroicons-trash-20-solid', click: () => handleDelete(file.name)
			}
		]
	];
};

const scriptItems = (file: any) => {
	if (file.scripts && typeof file.scripts === 'object') {
		const items = Object.entries(file.scripts).map(([scriptName, command]) => ({
			label: scriptName,
			click: () => console.log(`Running script: ${scriptName} => ${command}`)
		}));
		console.log('Script Items:', items);
		return items.length ? [items] : [[{ label: 'No scripts defined', disabled: true }]];
	}
	return [[{ label: 'No scripts defined', disabled: true }]];
};


const refreshProjects = async () => {
	try {
		await fetchProjects();
	} catch (error) {
		console.error("Error reading project files:", error);
	}
};

onMounted(refreshProjects);
</script>
