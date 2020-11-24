<template>
    <q-dialog
        v-model="showDialog"
        :maximized="$q.screen.lt.sm"
    >
        <q-card
            :class="{
                'details-dialog': $q.screen.gt.sm,
            }"
        >
            <q-toolbar class="q-py-md">
                <q-toolbar-title
                    class="text-weight-bold text-h5 text-grey-10 text-center"
                >
                    {{ data.name }}
                </q-toolbar-title>
            </q-toolbar>

            <q-separator inset/>

            <q-card-section>
                <div class="row">
                    <div
                        class="col-xs-12 col-sm-auto relative-position
                        q-pl-md q-pr-lg row justify-center"
                    >
                        <q-avatar
                            size="100px"
                            class="q-mb-md"
                        >
                            <img
                                :src="data.image || defaultImage"
                                class="object-fit"
                            >
                        </q-avatar>
                    </div>

                    <div class="col-xs-12 col-sm text-justify q-pr-md">
                        <p class="op-50">
                            {{ data.description || 'Sem descrição.' }}
                        </p>

                        <div class="column q-col-gutter-md">
                            <div>
                                <div class="q-mb-sm text-weight-bold">
                                    Token da API
                                </div>

                                <q-input
                                    v-model="data.api_token"
                                    dense
                                    outlined
                                    readonly
                                >
                                    <template v-slot:append>
                                        <q-btn
                                            dense
                                            flat
                                            icon="file_copy"
                                            class="reset-btn"
                                            @click="copyVariable(data.api_token)"
                                        />
                                    </template>
                                </q-input>
                            </div>

                            <div v-if="data.telegram_token">
                                <div class="q-mb-sm text-weight-bold">
                                    Token do Telegram
                                </div>

                                <q-input
                                    v-model="data.telegram_token"
                                    dense
                                    outlined
                                    readonly
                                >
                                    <template v-slot:append>
                                        <q-btn
                                            dense
                                            flat
                                            icon="file_copy"
                                            class="reset-btn"
                                            @click="copyVariable(data.telegram_token)"
                                        />
                                    </template>
                                </q-input>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row justify-end q-px-md q-pt-lg">
                    <q-btn
                        label="OK"
                        color="primary"
                        v-close-popup
                    />
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import { copyToClipboard } from 'quasar';

export default {
    name: 'DetailsDialog',
    props: {
        value: {
            type: Boolean,
            required: true,
        },

        data: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            apiKey: 'f3a55274-a4e9-4599-9a5d-4e069165fc85',
            telegramKey: '3e27c1a0-d099-4348-b27e-40caf8102dcd',
            showDialog: false,
            defaultImage: 'https://proddigital.com.br/wp-content/uploads/o-que-e-bot-696x358.png',
        };
    },

    watch: {
        value: {
            handler(newValue) {
                this.showDialog = newValue;
            },

            immediate: true,
        },

        showDialog(newValue) {
            this.$emit('input', newValue);
        },
    },

    methods: {
        copyVariable(variable) {
            copyToClipboard(variable)
                .then(() => {
                    this.$q.notify({
                        message: 'Conteúdo copiado para a área de transferência',
                        type: 'positive',
                        position: 'top',
                        timeout: 1000,
                    });
                })
                .catch(() => {
                    this.$q.notify({
                        message: 'Houve um problema ao copiar para a área de transferência',
                        negative: 'negative',
                        position: 'top',
                        timeout: 1000,
                    });
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.details-dialog {
    width: calc(100% - 32px);
    max-width: 700px;
}
</style>
