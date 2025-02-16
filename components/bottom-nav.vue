<template>
	<UContainer>
		<div class="fixed bottom-0 left-0 w-full shadow-lg rounded-t-2xl">
			<div class="w-full max-w-md mx-auto">
				<div class="bg-standard px-7 shadow-lg rounded-t-2xl">
					<div class="flex">
						<div class="flex-1 group">
							<NuxtLink href="/news"
								class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-green-500">
								<span class="block px-1 pt-1 pb-1">
									<i class="far fa-newspaper text-2xl pt-1 mb-1 block"></i>
									<span class="block text-xs pb-2">News</span>
									<span class="block w-5 mx-auto h-1 group-hover:bg-green-500 rounded-full"></span>
								</span>
							</NuxtLink>
						</div>
						<div class="flex-1 group">
							<NuxtLink href="/vaults"
								class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-green-500">
								<span class="block px-1 pt-1 pb-1">
									<i class="far fa-lock text-2xl pt-1 mb-1 block"></i>
									<span class="block text-xs pb-2">Vaults</span>
									<span class="block w-5 mx-auto h-1 group-hover:bg-green-500 rounded-full"></span>
								</span>
							</NuxtLink>
						</div>
						<div class="flex-1 group">
							<NuxtLink href="/"
								class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-green-500">
								<span class="block px-1 pt-1 pb-1">
									<i class="far fa-home text-2xl pt-1 mb-1 block"></i>
									<span class="block text-xs pb-2">Home</span>
									<span class="block w-5 mx-auto h-1 group-hover:bg-green-500 rounded-full"></span>
								</span>
							</NuxtLink>
						</div>
						<div class="flex-1 group">
							<NuxtLink href="/settings"
								class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-green-500">
								<span class="block px-1 pt-1 pb-1">
									<i class="far fa-cog text-2xl pt-1 mb-1 block"></i>
									<span class="block text-xs pb-2">Settings</span>
									<span class="block w-5 mx-auto h-1 group-hover:bg-green-500 rounded-full"></span>
								</span>
							</NuxtLink>
						</div>
						<div class="flex-1 group">
							<NuxtLink href="/profile"
								class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-green-500">
								<span class="block px-1 pt-1 pb-1">
									<i class="far fa-user-circle text-2xl pt-1 mb-1 block"></i>
									<span class="block text-xs pb-2">Profile</span>
									<span class="block w-5 mx-auto h-1 group-hover:bg-green-500 rounded-full"></span>
								</span>
							</NuxtLink>
						</div>
					</div>
				</div>
			</div>
		</div>
	</UContainer>
</template>

<script lang="ts" setup>
import { NuxtLink } from "#components";
</script>

<style scoped>
@import url(https://pro.fontawesome.com/releases/v5.10.0/css/all.css);
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;800&display=swap");

body {
	font-family: "Poppins", sans-serif;
}

.bg-standard {
	background-color: #111827;
}
</style>
