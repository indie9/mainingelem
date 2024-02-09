<template>
    <div>
        <header class="header-wrapper">
            <input class="search" type="text" v-model="search" placeholder="Поиск по валюте" @input="filterCurrencies" />
            <div class="select">
                <span class="select-title">Currency</span>
                <SearchSelect :items="currencies" v-model="selectedCurrency" @change="fetchCurrencyRates"
                    :itemLabel="(x) => currenciesName[x] || x" />
            </div>
        </header>

        <div v-if="Object.keys(filteredRates).length" class="rate-wrapper">
            <div class="rate" v-for="(rate, currency) in filteredRates" :key="currency">
                <div class="rate-name">

                    {{ (currenciesName[currency] || currency).toUpperCase() }}
                </div>
                <div class="rate-value">

                    {{ rate.toFixed(2) + " " + selectedCurrency }}
                </div>
            </div>
        </div>
        <div v-else class="banner">
            Not found
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import SearchSelect from "../components/SearchSelect.vue";
export default {
    components: {
        SearchSelect,
    },
    setup() {
        const selectedCurrency = ref("eur");
        const search = ref("");
        const currenciesName = ref({});
        const currencies = ref([]);
        const rates = ref({});

        const fetchCurrencyName = async () => {
            const response = await axios.get(
                `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json`
            );
            currenciesName.value = response.data;
            currencies.value = Object.keys(response.data);
        };
        const fetchCurrencyRates = async () => {
            const response = await axios.get(
                `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${selectedCurrency.value}.json`
            );

            rates.value = response.data[Object.keys(response.data)[1]];
        };

        const filteredRates = computed(() => {
            const filtered = {};
            for (const currency in rates.value) {
                if (
                    currency.toLowerCase().includes(search.value.toLowerCase()) ||
                    (currenciesName[currency] || "")
                        .toLowerCase()
                        .includes(search.value.toLowerCase())
                ) {
                    filtered[currency] = rates.value[currency];
                }
            }
            return filtered;
        });

        const filterCurrencies = () => {
            // Если требуется фильтрация по вводу
        };

        onMounted(fetchCurrencyRates);
        onMounted(fetchCurrencyName);

        return {
            selectedCurrency,
            search,
            currencies,
            currenciesName,
            rates,
            filteredRates,
            fetchCurrencyRates,
            filterCurrencies,
        };
    },
};
</script>

<style scoped lang="scss">
.banner {
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
}

.header-wrapper {
    width: 100%;
    height: 56px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 32px;

    & .search {
        width: 180px;
        height: 36px;
        border-radius: 8px;
        padding-left: 12px;
        box-shadow: 0px 0px 10px 0px #46464626;

    }

    & .select {
        display: flex;
        flex-direction: column;

        &-title {
            color: #838383;
            font-size: 12px;
            margin-bottom: 5px;
            font-weight: 500;
        }
    }
}

.rate-wrapper {
    max-height: calc(100vh - 240px);
    overflow-y: auto;
}

.rate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    border-bottom: 1px solid #46464640;
    font-weight: 600;
    padding: 0 12px;
    &-name,&-value {
        font-size: 16px;
        
    }
}

@media (max-width: 705px) {
    .rate-wrapper {
        max-height: calc(100vh - 220px);
    }
}
</style>
