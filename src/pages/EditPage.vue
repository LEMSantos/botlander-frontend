<template>
    <q-page
        class="relative-position"
    >
        <flow-canvas
            :data="flowData"
        />

        <q-page-sticky
            position="top-left"
            :offset="this.$q.screen.lt.sm ? [16, 25] : [50, 25]"
        >
            <q-btn
                flat
                no-caps
                label="Voltar"
                icon="arrow_back"
                class="reset-btn"
                color="primary"
                :padding="this.$q.screen.lt.sm ? 'none' : 'xs'"
                @click="$router.back()"
            />
        </q-page-sticky>

        <q-page-sticky
            position="bottom-right"
            :offset="this.$q.screen.lt.sm ? [16, 24] : [50, 40]"
        >
            <q-btn
                fab
                icon="add"
                color="primary"
                class="reset-btn"
            />
        </q-page-sticky>

        <q-page-sticky
            position="top-right"
            :offset="this.$q.screen.lt.sm ? [16, 25] : [50, 25]"
        >
            <q-btn
                v-morph:btn:mygroup:300.resize="morphGroupModel"
                color="primary"
                label="Editar informações"
                no-caps
                outline
                size="md"
                @click="nextMorph"
            />
        </q-page-sticky>

        <q-page-sticky
            position="top-right"
            :offset="this.$q.screen.lt.sm ? [16, 25] : [50, 25]"
        >
            <q-card
                v-morph:card:mygroup:500.resize="morphGroupModel"
                class="card-size absolute-top-right card-border"
                bordered
            >
                <q-card-section class="row justify-end">
                    <q-btn
                        flat
                        round
                        dense
                        icon="close"
                        class="reset-button text-weight-bold text-grey-10"
                        :disable="loadingSubmit"
                        @click="nextMorph"
                    />
                </q-card-section>

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
                                    :src="imageOrPreview ? imageOrPreview : defaultImage"
                                    class="object-fit"
                                >

                                <q-btn
                                    round
                                    color="green-10"
                                    icon="camera_alt"
                                    class="absolute-bottom-right reset-btn"
                                    :disable="loadingSubmit"
                                    @click="getFiles"
                                />
                            </q-avatar>
                        </div>

                        <q-form
                            class="col-xs-12 col-sm text-justify q-pr-md"
                            @submit="onSubmitEdit"
                        >
                            <div>
                                <div class="q-mb-sm">
                                    Nome
                                </div>

                                <q-input
                                    v-model="editForm.name"
                                    outlined
                                    dense
                                    placeholder="Nome do bot"
                                    :disable="loadingSubmit"
                                    :error="$v.editForm.name.$error"
                                    error-message="O nome é obrigatório"
                                />
                            </div>

                            <div>
                                <div class="q-mb-sm">
                                    Token do telegram
                                </div>

                                <q-input
                                    v-model="editForm.telegram_token"
                                    outlined
                                    dense
                                    placeholder="Token do telegram"
                                    class="q-mb-md"
                                    :disable="loadingSubmit"
                                />
                            </div>

                            <div>
                                <div class="q-mb-sm q-mt-xs">
                                    Descrição
                                </div>

                                <q-input
                                    v-model="editForm.description"
                                    outlined
                                    dense
                                    type="textarea"
                                    counter
                                    maxlength="300"
                                    input-class="resize-none-textarea"
                                    placeholder="Insira uma breve descrição sobre o seu bot..."
                                    :disable="loadingSubmit"
                                />
                            </div>

                            <q-file
                                v-model="editForm.image"
                                ref="filePicker"
                                class="hidden"
                            />

                            <div class="q-pt-md row justify-end">
                                <q-btn
                                    no-caps
                                    label="Salvar"
                                    type="submit"
                                    color="primary"
                                    class="q-mb-md"
                                    :loading="loadingSubmit"
                                    :disable="loadingSubmit"
                                />
                            </div>
                        </q-form>
                    </div>
                </q-card-section>
            </q-card>
        </q-page-sticky>

        <q-inner-loading
            :showing="loadingBot"
        >
            <q-spinner-gears
                size="70px"
                color="primary"
            />
        </q-inner-loading>
    </q-page>
</template>

<script>
import botServices from 'src/services/bot';
import {
    required,
    minLength,
} from 'vuelidate/lib/validators';
import FlowCanvas from 'src/components/FlowCanvas';

export default {
    components: {
        FlowCanvas,
    },

    data() {
        return {
            botId: null,
            editForm: {},
            loadingBot: false,
            loadingSubmit: false,
            defaultImage: 'https://proddigital.com.br/wp-content/uploads/o-que-e-bot-696x358.png',
            previewImgURI: null,
            image: null,
            nextMorphStep: {
                btn: 'card',
                card: 'btn',
            },
            morphGroupModel: 'btn',
            flowData: {
                node_1: {
                    parent: null,
                    message: 'Olá',
                },
                node_2: {
                    parent: 'node_1',
                    message: 'Meu nome é Jarvis o que você gostaria de fazer?',
                },
                node_3: {
                    parent: 'node_2',
                    message: 'Tudo bem então',
                },
                node_4: {
                    parent: 'node_2',
                    message: 'E como você pretende fazer isso?',
                },
                node_5: {
                    parent: 'node_4',
                    message: '...',
                },
                node_6: {
                    parent: 'node_4',
                    message: '...',
                },
                node_7: {
                    parent: 'node_4',
                    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget sem at diam lacinia auctor eget a arcu. In tristique odio non nunc viverra interdum. Morbi malesuada dapibus nulla at posuere. ',
                },
                node_8: {
                    parent: 'node_4',
                    message: '...',
                },
                node_9: {
                    parent: 'node_3',
                    message: '...',
                },
                node_10: {
                    parent: 'node_3',
                    message: '...',
                },
            },
        };
    },

    validations: {
        editForm: {
            name: {
                required,
                minLength: minLength(3),
            },
        },
    },

    watch: {
        // eslint-disable-next-line
        'editForm.image': function(newValue) {
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

    computed: {
        imageOrPreview() {
            return this.previewImgURI ? this.previewImgURI : this.image;
        },
    },

    mounted() {
        this.loadingBot = true;

        this.getBot(this.$route.params.id)
            .then(({ data }) => {
                this.editForm.name = data.bot.name;
                this.image = data.bot.image;
                this.editForm.description = data.bot.description;
                this.editForm.telegram_token = data.bot.telegram_token;

                this.botId = data.bot.id;
            })
            .catch(() => {})
            .finally(() => {
                this.loadingBot = false;
            });
    },

    methods: {
        ...botServices,

        onSubmitEdit() {
            this.$v.$touch();

            if (!this.$v.$error) {
                const payload = new FormData();

                Object.keys(this.editForm).forEach((key) => {
                    payload.append(key, this.editForm[key]);
                });

                this.loadingSubmit = true;

                this.putBot(this.botId, payload)
                    .then(({ data }) => {
                        this.editForm.name = data.new_bot.name;
                        this.editForm.image = data.new_bot.image;
                        this.editForm.description = data.new_bot.description;
                        this.editForm.telegram_token = data.new_bot.telegram_token;

                        this.botId = data.new_bot.id;

                        this.$q.notify({
                            message: 'Informações atualizadas com sucesso',
                            type: 'positive',
                            position: 'top',
                            timeout: 1000,
                        });
                    })
                    .catch((error) => {
                        let message = 'Houve um problema ao atualizar as informações';

                        if (error.response.status === 401) {
                            message = 'A senha informada não corresponde aos registros';
                        }

                        this.$q.notify({
                            message,
                            type: 'negative',
                            position: 'top',
                            timeout: 1000,
                        });
                    })
                    .finally(() => {
                        this.loadingSubmit = false;
                        this.nextMorph();
                    });
            }
        },

        getFiles() {
            this.$refs.filePicker.pickFiles();
        },

        nextMorph() {
            this.morphGroupModel = this.nextMorphStep[this.morphGroupModel];
        },
    },
};
</script>

<style lang="scss" scoped>
.card-size {
    width: 700px;
}

.image-size {
    height: 150px;
    object-fit: cover;
}

.card-border {
    border-color: $primary;
}
</style>
