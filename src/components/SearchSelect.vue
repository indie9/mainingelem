<template>
    <div class="custom-select" @click="toggleDropdown" v-click-outside="onClickOutside">
        <div class="selected-item">
            {{ selectedItem }}
        </div>
        <svg class="arrow" :class="{ '-rotate': dropdownVisible }" width="16" height="16" viewBox="0 0 16 16" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M13 6L8 11L3 6" stroke="#464646" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <div v-show="dropdownVisible" class="drop-menu">
            <input ref="input" class="search" type="text" v-model="searchText" @click.stop @input="filterItems"
                placeholder="Search..." />
            <div class="items-list">
                <div class="item" v-for="(item, index) in filteredItems" :key="index" @click.stop="selectItem(item)">
                    {{ props.itemLabel(item) }}
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";

const emit = defineEmits(["change", "update:modelValue"]);
const input = ref(null);
const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    itemLabel: {
        type: Function,
        default: (x) => x,
    },
    modelValue: String,
});

const searchText = ref("");
// const selectedItem = ref("");
const selectedItem = computed({
    get: () => props.itemLabel(props.modelValue),
    set: (value) => emit("update:modelValue", value),
});
const dropdownVisible = ref(false);

const filteredItems = computed(() => {
    if (searchText.value) {
        return props.items.filter((item) => {
            return (
                item?.toLowerCase()?.includes(searchText.value?.toLowerCase()) ||
                props
                    .itemLabel(item)
                    ?.toLowerCase()
                    ?.includes(searchText.value?.toLowerCase())
            );
        });
    } else {
        return props.items;
    }
});

const toggleDropdown = () => {
    dropdownVisible.value = !dropdownVisible.value;
    if (dropdownVisible.value) {
        setTimeout(() => input.value.focus());
    }
};

const selectItem = (item) => {
    searchText.value = null;
    selectedItem.value = item;
    dropdownVisible.value = false;
    emit("change");
};

const onClickOutside = () => {
    if (dropdownVisible.value) dropdownVisible.value = false;
};
</script>

<style lang="scss" scoped>
.custom-select {
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    width: fit-content;
    height: 36px;
    padding: 0px 16px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px 0px #46464626;

    & .selected-item {
        white-space: nowrap;
        overflow: hidden;
        margin-right: 8px;
    }

    & .drop-menu {
        background: white;
        z-index: 5;
        position: absolute;
        top: 38px;
        right: 0px;
        width: 160px;
        border-radius: 8px;
        padding: 5px;

        border: 1px solid gray;

        & .items-list {
            max-height: 300px;
            overflow-y: auto;

            & .item {
                cursor: pointer;
                width: 100%;
            }

            & .item:hover {
                background-color: #e2e2e2;
            }
        }

        & .search {
            width: 150px;
            height: 36px;
            border-radius: 8px;
            margin-bottom: 5px;
            padding-left: 6px;
            box-shadow: 0px 0px 10px 0px #46464626;
        }
    }

    & .arrow {
        margin-left: auto;

        &.-rotate {
            transform: rotate(180deg);
        }
    }

}
</style>
