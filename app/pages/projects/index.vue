<script setup lang="ts">
const { data: projects } = await useFetch('/api/projects')
</script>

<template>
  <UDashboardPanel id="projects">
    <template #header>
      <UDashboardNavbar title="Projects">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton to="/projects/new" color="primary">
            New Project
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <NuxtLink
          v-for="p in projects"
          :key="p.id"
          :to="`/projects/${p.id}`"
          class="block hover:bg-elevated/5"
        >
          <UCard class="hover:shadow-lg transition-shadow">
            <div class="font-medium text-highlighted">{{ p.name }}</div>
            <div class="text-sm text-muted">{{ p.short }}</div>
          </UCard>
        </NuxtLink>
      </div>
    </template>
  </UDashboardPanel>
</template>
