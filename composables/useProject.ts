import { appDataDir } from '@tauri-apps/api/path';
import { readDir, createDir, removeDir, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import { ref, onMounted } from 'vue';
import { Command } from '@tauri-apps/api/shell';

export function useProject() {
    const projects = ref([]);
    const isCreating = ref(false); // <-- Loader state
    let workspacePath = '';

    const initializeWorkspace = async () => {
        try {
            const basePath = await appDataDir();
            workspacePath = `${basePath}LegionJS`;
            await createDir(workspacePath, { recursive: true });
        } catch (error) {
            console.error('Error initializing workspace:', error);
        }
    };

    const createProject = async (projectName: string) => {
        if (isCreating.value) return;
        isCreating.value = true; // <-- Start loading

        try {
            const projectPath = `${workspacePath}/${projectName}`;
            await createDir(projectPath, { recursive: true });

            const packageJsonPath = `${projectPath}/package.json`;
            const packageJsonContent = JSON.stringify({
                name: projectName,
                version: '1.0.0',
                description: '',
                main: 'index.js',
                scripts: {
                    start: 'node index.js'
                },
                author: '',
                license: 'MIT'
            }, null, 2);

            await writeTextFile(packageJsonPath, packageJsonContent);

            const npmInit = new Command('npm', ['install'], { cwd: projectPath });
            await npmInit.execute();

            await fetchProjects();
        } catch (error) {
            console.error('Error creating project:', error);
        } finally {
            isCreating.value = false; // <-- Stop loading
        }
    };

    const fetchProjects = async () => {
        try {
            const entries = await readDir(workspacePath);
            const validProjects = [];

            for (const entry of entries) {
                if (!entry.children) continue;

                const packageJsonPath = `${entry.path}/package.json`;
                try {
                    const packageJsonContent = await readTextFile(packageJsonPath);
                    console.log(packageJsonContent)
                    const packageData = JSON.parse(packageJsonContent);
                    validProjects.push({
                        name: packageData.name || entry.name,
                        version: packageData.version || 'Unknown',
                        description: packageData.description || 'Unknown',
                        author: packageData.author || 'Unknown',
                        scripts: packageData.scripts || {},
                        path: entry.path
                    });
                } catch (error) {
                    console.warn(`Skipping non-Node.js project: ${entry.name}`);
                }
            }
            projects.value = validProjects;
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const deleteProject = async (projectName: string) => {
        try {
            const projectPath = `${workspacePath}/${projectName}`;
            await removeDir(projectPath, { recursive: true });
            await fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    onMounted(async () => {
        await initializeWorkspace();
        await fetchProjects();
    });

    return {
        projects,
        isCreating, // <-- Expose loader state
        createProject,
        fetchProjects,
        deleteProject
    };
}
