<template>
    <q-page class="q-pt-xl q-pt-md q-pb-xl">
        <div class="row justify-end">
            <q-input
                v-model="search"
                rounded
                outlined
                dense
                placeholder="Faça a sua busca aqui..."
                class="col-xs-12 col-sm-6"
            >
                <template v-slot:append>
                    <q-icon
                        name="search"
                    />
                </template>
            </q-input>
        </div>

        <div
            class="row q-col-gutter-md q-mt-lg"
        >
            <div
                class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
            >
                <q-btn
                    flat
                    icon="add"
                    class="full-width dashed-border card-height
                    border-primary text-weight-bold h-100 reset-btn"
                    size="50px"
                    color="primary"
                    @click="showCreationDialog = true"
                />
            </div>

            <div
                v-for="bot in bots"
                :key="bot.id"
                class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
            >
                <q-card
                    bordered
                    class="card-height"
                >
                    <q-card-section horizontal>
                        <q-img
                            :src="bot.image || defaultImage"
                            class="object-fit card-height image-width cursor-pointer"
                            basic
                            @click="openDetails(bot)"
                        >
                            <div
                                class="absolute-bottom text-subtitle2"
                            >
                                {{ bot.name }}
                            </div>
                        </q-img>

                        <q-card-actions
                            vertical
                            class="bg-grey-1 justify-around card-action-border"
                        >
                            <q-btn
                                flat
                                round
                                color="primary"
                                icon="delete"
                                class="reset-btn"
                                @click="openDeleteDialog(bot.id)"
                            />

                            <q-btn
                                flat
                                round
                                color="primary"
                                icon="create"
                                class="reset-btn"
                                @click="$router.push(`/edit/${bot.id}`)"
                            />
                        </q-card-actions>
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <details-dialog
            v-model="showDetailsDialog"
            :data="currentUserDetails"
        />

        <creation-dialog
            v-model="showCreationDialog"
            :loading="loadingBotSubmmitCreation"
            @submmited="submmitBotCreation"
        />

        <delete-dialog
            v-model="showDeleteDialog"
            title="Deletar bot"
            message="Você está prestes a deletar um bot,
            essa ação não pode ser desfeita, deseja continuar?"
            ok-btn-text="Sim, deletar"
            :loading="loadingBotDelete"
            @confirmed="confirmDeleteBot"
        />

        <q-inner-loading
            :showing="loadingBots"
        >
            <q-spinner-gears
                size="70px"
                color="primary"
            />
        </q-inner-loading>
    </q-page>
</template>

<script>
import DetailsDialog from 'src/components/DetailsDialog';
import CreationDialog from 'src/components/CreationDialog';
import DeleteDialog from 'src/components/DeleteDialog';
import botServices from 'src/services/bot';

export default {
    name: 'PageHome',

    components: {
        DetailsDialog,
        CreationDialog,
        DeleteDialog,
    },

    data() {
        return {
            search: '',
            showDetailsDialog: false,
            showCreationDialog: false,
            showDeleteDialog: false,
            loadingBots: false,
            loadingBotSubmmitCreation: false,
            loadingBotDelete: false,
            bots: [],
            currentUserDetails: {},
            currentDeleteId: null,
            defaultImage: 'https://proddigital.com.br/wp-content/uploads/o-que-e-bot-696x358.png',
        };
    },

    mounted() {
        this.getAllBots();
    },

    methods: {
        ...botServices,

        openDetails(bot) {
            this.showDetailsDialog = true;
            this.currentUserDetails = bot;
        },

        openDeleteDialog(id) {
            this.showDeleteDialog = true;
            this.currentDeleteId = id;
        },

        submmitBotCreation(payload) {
            this.loadingBotSubmmitCreation = true;

            this.postBot(payload)
                .then(() => {
                    this.getAllBots();
                    // this.$router.push('/edit/id')
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
                    this.loadingBotSubmmitCreation = false;
                    this.showCreationDialog = false;
                });
        },

        confirmDeleteBot() {
            this.loadingBotDelete = true;

            this.deleteBot(this.currentDeleteId)
                .then(() => {
                    this.getAllBots();
                })
                .catch((error) => {
                    let message = 'Houve um problema ao tentar deletar o bot.';

                    if (error.response.status === 401) {
                        message = 'A senha informada não corresponde aos registros';
                    }

                    this.$q.notify({
                        type: 'negative',
                        message,
                    });
                })
                .finally(() => {
                    this.showDeleteDialog = false;
                    this.loadingBotDelete = false;
                });
        },

        getAllBots() {
            this.loadingBots = true;

            const userInfo = this.$q.localStorage.getItem('userInfo');

            this.getBots({ user_id: userInfo.id })
                .then(({ data }) => {
                    this.bots = data.bots;
                })
                .catch(() => {})
                .finally(() => {
                    this.loadingBots = false;
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.card-height {
    height: 200px;
}

.image-width {
    width: calc(100% - 58px);
}

.card-action-border {
    border-left: 1px solid rgba($color: #000000, $alpha: 0.4);
}
</style>
