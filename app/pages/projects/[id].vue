<script setup lang="ts">
import type { Requirement } from '@@/server/utils/projects-data'
import type { TableColumn } from '@nuxt/ui'

const route = useRoute()
const id = Number(route.params.id)
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const { data: project, refresh } = await useFetch(`/api/projects/${id}`)

const columns: TableColumn<Requirement>[] = [
  { accessorKey: 'shortName', header: 'Name' },
  { accessorKey: 'number', header: 'Number' },
  {
    accessorKey: 'weight',
    header: 'Weight',
    cell: ({ row }: { row: { original: { weight: string } } }) => {
      const w = row.original.weight
      const color = w === 'mandatory' ? 'error' : w === 'important' ? 'warning' : 'neutral'
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => w)
    },
  },
  { accessorKey: 'description', header: 'Description' },
  { id: 'actions', cell: ({ row }) => {
    return h(
      'div',
      { class: 'text-right' },
      [
        h(UButton, {
          size: 'md',
          variant: 'ghost',
          icon: 'i-lucide-edit-2',
          onClick() {
            deleteReq(row.getValue('id'))
          },
        }),
        h(UButton, {
          size: 'md',
          variant: 'ghost',
          color: 'error',
          icon: 'i-lucide-trash',
          onClick() {
            deleteReq(row.getValue('id'))
          },
        }),
      ],
    )
  },
  },
]

const openCategories = ref<Record<string, boolean>>({})

const showEdit = ref(false)
const editingReq = ref<Requirement | null>(null)

const form = ref({
  categoryId: '',
  shortName: '',
  number: '',
  weight: 'important',
  description: '',
})

const allowedWeights = ['mandatory', 'important', 'nice-to-have']
const errors = reactive({ shortName: '', number: '', weight: '' })

watch(() => form.value.shortName, () => {
  errors.shortName = ''
})
watch(() => form.value.number, () => {
  errors.number = ''
})
watch(() => form.value.weight, () => {
  errors.weight = ''
})

function validateForm() {
  errors.shortName = ''
  errors.number = ''
  errors.weight = ''

  if (!form.value.shortName || !form.value.shortName.trim()) {
    errors.shortName = 'Short name is required'
  }
  if (!form.value.number || !form.value.number.trim()) {
    errors.number = 'Number/identifier is required'
  }
  if (!allowedWeights.includes(form.value.weight)) {
    errors.weight = 'Invalid weight selected'
  }

  return !errors.shortName && !errors.number && !errors.weight
}

const formInvalid = computed(() => {
  return !form.value.shortName || !form.value.number || !allowedWeights.includes(form.value.weight)
})

async function submitCreate() {
  if (!validateForm()) {
    return
  }

  const body = { ...form.value }
  if (!body.categoryId) body.categoryId = 'default'
  await $fetch(`/api/projects/${id}/requirements`, { method: 'POST', body })
  await refresh()
}

async function submitEdit() {
  if (!editingReq.value) return
  if (!validateForm()) return

  const rid = editingReq.value.id
  const body = { ...form.value }
  await $fetch(`/api/projects/${id}/requirements/${rid}`, { method: 'PUT', body })
  showEdit.value = false
  editingReq.value = null
  await refresh()
}

async function deleteReq(rid: number) {
  if (!confirm('Delete this requirement?')) return
  await $fetch(`/api/projects/${id}/requirements/${rid}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <UModal title="Edit Requirement">
    <template #body>
      <div class="bg-surface p-4 rounded shadow-lg w-full max-w-2xl">
        <h4 class="font-semibold mb-2">
          Edit Requirement
        </h4>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <UInput v-model="form.categoryId" placeholder="Category id" />
          </div>
          <div>
            <USelect v-model="form.weight" :items="[{ label: 'Mandatory', value: 'mandatory' }, { label: 'Important', value: 'important' }, { label: 'Nice to have', value: 'nice-to-have' }]" />
            <p v-if="errors.weight" class="text-sm text-error mt-1">
              {{ errors.weight }}
            </p>
          </div>

          <div>
            <UInput v-model="form.shortName" placeholder="Short name" />
            <p v-if="errors.shortName" class="text-sm text-error mt-1">
              {{ errors.shortName }}
            </p>
          </div>
          <div>
            <UInput v-model="form.number" placeholder="Number/identifier" />
            <p v-if="errors.number" class="text-sm text-error mt-1">
              {{ errors.number }}
            </p>
          </div>

          <div class="col-span-2">
            <UInput v-model="form.description" placeholder="Description" />
          </div>
        </div>
        <div class="mt-3 flex justify-end gap-2">
          <UButton label="Cancel" variant="ghost" @click="showEdit = false" />
          <UButton
            label="Save"
            color="primary"
            :disabled="formInvalid"
            @click="submitEdit"
          />
        </div>
      </div>
    </template>
  </UModal>

  <UDashboardPanel :id="`project-${id}`">
    <template #header>
      <UDashboardNavbar title="Projects">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #trailing>
          {{ project?.name }} <span class="text-sm text-muted">({{ project?.short }})</span>
        </template>

        <template #right>
          <!-- Create Dialog -->
          <UModal title="New Requirement" description="Create a new requirement and assign it to a new or already existing category" :ui="{ footer: 'justify-end', content: 'max-w-2xl' }">
            <UButton label="New Requirement" color="primary" />

            <template #body>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <UFormField label="Category id (or existing)" required>
                    <UInput v-model="form.categoryId" class="w-full" placeholder="Category id (or existing)" />
                  </UFormField>
                </div>

                <div>
                  <UFormField label="Weight" required>
                    <USelect
                      v-model="form.weight"
                      class="w-full"
                      :items="[
                        { label: 'Mandatory', value: 'mandatory' },
                        { label: 'Important', value: 'important' },
                        { label: 'Nice to have', value: 'nice-to-have' },
                      ]"
                    />
                    <p v-if="errors.weight" class="text-sm text-error mt-1">
                      {{ errors.weight }}
                    </p>
                  </UFormField>
                </div>

                <div>
                  <UFormField label="Short name" required>
                    <UInput v-model="form.shortName" class="w-full" placeholder="Short name" />
                    <p v-if="errors.shortName" class="text-sm text-error mt-1">
                      {{ errors.shortName }}
                    </p>
                  </UFormField>
                </div>

                <div>
                  <UFormField label="Number/identifier" required>
                    <UInput v-model="form.number" class="w-full" placeholder="Number/identifier" />
                    <p v-if="errors.number" class="text-sm text-error mt-1">
                      {{ errors.number }}
                    </p>
                  </UFormField>
                </div>

                <div class="col-span-2">
                  <UFormField label="Description" hint="Optional">
                    <UInput v-model="form.description" class="w-full" placeholder="Description" />
                  </UFormField>
                </div>
              </div>
            </template>

            <template #footer="{ close }">
              <UButton
                label="Cancel"
                color="neutral"
                variant="outline"
                @click="close"
              />
              <UButton
                label="Create"
                color="neutral"
                :disabled="formInvalid"
                @click="submitCreate"
              />
            </template>
          </UModal>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="!project">
        Project not found
      </div>
      <div v-else>
        <div class="flex flex-col gap-3">
          <div v-for="cat in project?.categories || []" :key="cat.id" class="flex flex-col border rounded-lg">
            <button class="flex items-center justify-between px-4 py-3 bg-elevated/50 cursor-pointer" @click="openCategories[cat.id] = !openCategories[cat.id]">
              <div>
                <div class="font-semibold text-start">
                  {{ cat.name }}
                </div>
                <div class="text-sm text-muted">
                  {{ cat.requirements.length }} requirement(s)
                </div>
              </div>
              <div class="text-muted">
                {{ openCategories[cat.id] ? 'Collapse' : 'Expand' }}
              </div>
            </button>

            <div v-show="openCategories[cat.id]" class="p-4">
              <UTable :data="cat.requirements" :columns="columns" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
