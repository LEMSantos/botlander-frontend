<template>
    <q-dialog
        v-model="showDialog"
        :maximized="$q.screen.lt.sm"
    >
        <q-card
            :class="{
                'large-dialog': $q.screen.gt.sm,
            }"
        >
            <q-toolbar class="q-py-md">
                <q-toolbar-title
                    class="text-weight-bold text-h5 text-grey-10"
                >
                    Crie o seu bot
                </q-toolbar-title>

                <q-btn
                    flat
                    round
                    dense
                    icon="close"
                    class="reset-button text-weight-bold text-grey-10"
                    :disable="loading"
                    v-close-popup
                />
            </q-toolbar>

            <q-separator inset/>

            <q-card-section>
                <div class="row">
                    <div
                        class="col-xs-12 col-sm-auto relative-position
                        q-pl-md q-pr-lg row justify-center"
                    >
                        <q-avatar
                            size="150px"
                            class="q-mb-md relative-position"
                        >
                            <img
                                ref="botImg"
                                :src="previewImgURI ? previewImgURI : defaultImage"
                                class="object-fit"
                            >

                            <q-btn
                                round
                                color="green-10"
                                icon="camera_alt"
                                class="absolute-bottom-right reset-btn"
                                @click="getFiles"
                            />
                        </q-avatar>
                    </div>

                    <q-form
                        class="col-xs-12 col-sm text-justify q-pr-md"
                        @submit="onSubmitCreation"
                    >
                        <div>
                            <div class="q-mb-sm">
                                Nome
                            </div>

                            <q-input
                                v-model="creationForm.name"
                                outlined
                                dense
                                placeholder="Nome do bot"
                                :disable="loading"
                                :error="$v.creationForm.name.$error"
                                error-message="O nome é obrigatório"
                            />
                        </div>

                        <div>
                            <div class="q-mb-sm">
                                Token do telegram
                            </div>

                            <q-input
                                v-model="creationForm.telegram_token"
                                outlined
                                dense
                                placeholder="Token do telegram"
                                :disable="loading"
                            />
                        </div>

                        <div>
                            <div class="q-mb-sm">
                                Descrição
                            </div>

                            <q-input
                                v-model="creationForm.description"
                                outlined
                                dense
                                type="textarea"
                                counter
                                maxlength="300"
                                input-class="resize-none-textarea"
                                placeholder="Insira uma breve descrição sobre o seu bot..."
                                :disable="loading"
                            />
                        </div>

                        <q-file
                            v-model="creationForm.image"
                            ref="filePicker"
                            class="hidden"
                        />

                        <div class="q-pt-md row justify-end">
                            <q-btn
                                no-caps
                                label="Avançar"
                                type="submit"
                                color="primary"
                                class="q-mb-md"
                                :loading="loading"
                                :disable="loading"
                            />
                        </div>
                    </q-form>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import {
    required,
    minLength,
} from 'vuelidate/lib/validators';

export default {
    name: 'CreationDialog',
    props: {
        value: {
            type: Boolean,
            required: true,
        },

        loading: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            creationForm: {},
            showDialog: false,
            defaultImage: 'https://proddigital.com.br/wp-content/uploads/o-que-e-bot-696x358.png',
            previewImgURI: null,
        };
    },

    validations: {
        creationForm: {
            name: {
                required,
                minLength: minLength(3),
            },
        },
    },

    watch: {
        value: {
            handler(newValue) {
                this.showDialog = newValue;

                if (!newValue) {
                    this.creationForm = {};

                    this.$v.$reset();
                }
            },

            immediate: true,
        },

        showDialog(newValue) {
            this.$emit('input', newValue);
        },

        // eslint-disable-next-line
        'creationForm.image': function(newValue) {
            if (newValue) {
                const reader = new FileReader();
                const preview = this.$refs.botImg;

                reader.onloadend = () => {
                    preview.src = reader.result;
                };

                reader.readAsDataURL(newValue);
            }
        },
    },

    methods: {
        onSubmitCreation() {
            this.$v.$touch();

            if (!this.$v.$error) {
                const payload = new FormData();

                Object.keys(this.creationForm).forEach((key) => {
                    payload.append(key, this.creationForm[key]);
                });

                this.$emit('submmited', payload);
            }
        },

        getFiles() {
            this.$refs.filePicker.pickFiles();
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
