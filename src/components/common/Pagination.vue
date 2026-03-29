<template>
  <div v-if="totalPages > 1" class="pagination-container">
    <div class="pagination">
      <!-- Previous Button -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="page-btn prev-btn"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Previous
      </button>

      <!-- Page Numbers -->
      <div class="page-numbers">
        <!-- First Page -->
        <button
          v-if="showFirstPage"
          @click="goToPage(1)"
          class="page-num-btn"
          :class="{ active: currentPage === 1 }"
        >
          1
        </button>
        <span v-if="showFirstDots" class="page-dots">...</span>

        <!-- Visible Pages -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          class="page-num-btn"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>

        <!-- Last Page -->
        <span v-if="showLastDots" class="page-dots">...</span>
        <button
          v-if="showLastPage"
          @click="goToPage(totalPages)"
          class="page-num-btn"
          :class="{ active: currentPage === totalPages }"
        >
          {{ totalPages }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="page-btn next-btn"
      >
        Next
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>

    <!-- Info Text -->
    <div class="pagination-info">
      Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} items
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1,
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1,
  },
  totalItems: {
    type: Number,
    required: true,
    default: 0,
  },
  pageSize: {
    type: Number,
    required: true,
    default: 15,
  },
  maxVisiblePages: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(["update:currentPage", "page-change"]);

// Computed values
const startItem = computed(() => {
  return (props.currentPage - 1) * props.pageSize + 1;
});

const endItem = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalItems);
});

// Show/hide first page and dots
const showFirstPage = computed(() => {
  return props.currentPage - Math.floor(props.maxVisiblePages / 2) > 2;
});

const showFirstDots = computed(() => {
  return props.currentPage - Math.floor(props.maxVisiblePages / 2) > 3;
});

const showLastPage = computed(() => {
  return (
    props.currentPage + Math.floor(props.maxVisiblePages / 2) <
    props.totalPages - 1
  );
});

const showLastDots = computed(() => {
  return (
    props.currentPage + Math.floor(props.maxVisiblePages / 2) <
    props.totalPages - 2
  );
});

// Visible page numbers
const visiblePages = computed(() => {
  const pages = [];
  let start = Math.max(
    1,
    props.currentPage - Math.floor(props.maxVisiblePages / 2),
  );
  let end = Math.min(props.totalPages, start + props.maxVisiblePages - 1);

  if (end - start + 1 < props.maxVisiblePages) {
    start = Math.max(1, end - props.maxVisiblePages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Methods
function goToPage(page) {
  if (page < 1 || page > props.totalPages) return;
  emit("update:currentPage", page);
  emit("page-change", page);
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding: 20px 0;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  background: white;
  border: 1px solid rgba(30, 42, 74, 0.15);
  color: #5a6282;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: rgba(238, 136, 117, 0.05);
  border-color: #ee8875;
  color: #ee8875;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.prev-btn svg,
.next-btn svg {
  width: 14px;
  height: 14px;
}

.page-numbers {
  display: flex;
  gap: 6px;
  align-items: center;
}

.page-num-btn {
  min-width: 36px;
  height: 36px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  background: white;
  border: 1px solid rgba(30, 42, 74, 0.15);
  color: #5a6282;
  cursor: pointer;
  transition: all 0.2s;
}

.page-num-btn:hover {
  background: rgba(238, 136, 117, 0.05);
  border-color: #ee8875;
  color: #ee8875;
}

.page-num-btn.active {
  background: #ee8875;
  border-color: #ee8875;
  color: white;
}

.page-dots {
  padding: 0 4px;
  color: #9aa0b8;
}

.pagination-info {
  font-size: 12px;
  color: #9aa0b8;
}

/* Responsive */
@media (max-width: 640px) {
  .page-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  .page-num-btn {
    min-width: 32px;
    height: 32px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .pagination {
    flex-direction: column;
  }
  .page-numbers {
    order: 1;
  }
  .prev-btn,
  .next-btn {
    order: 2;
  }
}
</style>
