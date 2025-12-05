<script setup lang="ts">
const router = useRouter()

const form = ref({ name: '', short: '' })

async function submit() {
  const created = await $fetch('/api/projects', { method: 'POST', body: form })
  router.push(`/projects/${created.id}`)
}
</script>

<template>
  <UDashboardPanel id="projects-new">
    <template #header>
      <UDashboardNavbar title="New Project">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-2xl">
        <UInput v-model="form.name" placeholder="Project name" class="mb-2" />
        <UInput v-model="form.short" placeholder="Short id" class="mb-2" />
        <div class="flex gap-2">
          <UButton label="Cancel" variant="ghost" @click="$router.back()" />
          <UButton label="Create" color="primary" @click="submit" />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
