<template>
    <div class="wrapper">
        <div class="valute">
            <div class="input-wrapper">
                <div class="input-label">From</div>
                <input class="input" type="number" v-model="inputValue" @input="changeBaseValue('in')" />
            </div>

            <SearchSelect class="select" :items="currencies" v-model="fromCurrency" @change="convertCurrency(false, 'in')"
                :itemLabel="(x) => currenciesName[x] || x" />
        </div>

        <div class="valute">
            <div class="input-wrapper">
                <div class="input-label">To</div>
                <input class="input" type="number" v-model="toValue" @input="changeBaseValue('out')" />
            </div>
            <SearchSelect class="select" :items="currencies" v-model="toCurrency" @change="convertCurrency(false, 'out')"
                :itemLabel="(x) => currenciesName[x] || x" />
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import SearchSelect from "../components/SearchSelect.vue";
export default {
    components: {
        SearchSelect,
    },
    setup() {
        const fromCurrency = ref("eur");
        const toCurrency = ref("rub");
        const inputValue = ref(1);
        const toValue = ref(1);
        const currencies = ref([]);
        const currenciesName = ref({});
        const course = ref(1);
        const baseValue = ref({
            type: "in",
            value: 1,
        });
        const fetchCurrencyName = async () => {
            const response = await axios.get(
                `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json`
            );
            if (response?.data) {

                currenciesName.value = response.data;
                currencies.value = Object.keys(response.data);
            }
        };
        const changeBaseValue = (type) => {
            if (type == "in") {
                toValue.value = (inputValue.value * course.value).toFixed(2);
            } else {
                inputValue.value = (toValue.value / course.value).toFixed(2);
            }
            baseValue.value = {
                type,
                value: type == "in" ? inputValue.value : toValue.value,
            };
        };
        const convertCurrency = (isFirst, type) => {
            axios
                .get(
                    `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${fromCurrency.value}/${toCurrency.value}.json`
                )
                .then((response) => {
                    if (response?.data) {

                        course.value = response.data[Object.keys(response.data)[1]];
                        if (isFirst) {
                            changeBaseValue("in");
                        } else {
                            changeBaseValue(type);
                        }
                    }
                });
        };

        onMounted(fetchCurrencyName);
        onMounted(() => convertCurrency(true));

        return {
            fromCurrency,
            toCurrency,
            inputValue,
            currencies,
            currenciesName,
            toValue,
            course,
            convertCurrency,
            changeBaseValue,
        };
    },
};
</script>
<style scoped lang="scss">
.wrapper {
    display: flex;
    height: 55px;
    align-items: flex-end;

    & .valute {
        display: flex;
        align-items: flex-end;

        &:first-child {
            margin-right: 32px;
        }

        & .input-wrapper {
            display: flex;
            flex-direction: column;
            width: 120px;
            margin-right: 5px;

            & .input {
                width: 120px;
                height: 36px;
                border-radius: 8px;
                padding-left: 12px;
                box-shadow: 0px 0px 10px 0px #46464626;
            }

            & .input-label {
                margin-bottom: 5px;
                font-weight: 500;
                font-size: 12px;
            }
        }

        & .select {
            width: 170px;
        }
    }
}

@media (max-width: 705px) {
    .wrapper {
        flex-direction: column;
        height: fit-content;
        align-items: flex-start;

        & .valute {
            width: 100%;

            &:first-child {
                margin-bottom: 32px;
            }

            & .input-wrapper {
                width: 100%;

                & .input {
                    width: 100%;
                }
            }

            & .select {
                width: 100%;
                max-width: 170px;
            }
        }
    }
}</style>