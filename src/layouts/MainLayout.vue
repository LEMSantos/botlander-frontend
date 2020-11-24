<template>
    <q-layout view="hHh lpr fFf">
        <q-header
            class="bg-transparent"
        >
            <q-toolbar
                class="bg-transparent q-px-sm-xl q-px-xs-md"
                :class="{
                    'q-py-md': !denseToolbar,
                }"
            >
                <q-toolbar-title
                    class="text-indigo-10"
                >
                    <q-btn
                        flat
                        no-caps
                        padding="none"
                        @click="$router.push('/', () => {})"
                        class="text-h4 text-weight-bold"
                    >
                        Botlander
                    </q-btn>
                </q-toolbar-title>

                <div
                    class="bg-transparent text-indigo-10 text-weight-bold q-mr-sm"
                >
                    <div
                        v-if="$q.screen.gt.xs"
                        class="display-inline q-mr-sm text-capitalize"
                    >
                        {{ fullName }}
                    </div>

                    <q-avatar
                        color="green-10"
                        text-color="white"
                        class="text-uppercase"
                    >
                        {{ nameAbreviation }}
                    </q-avatar>
                </div>

                <q-btn
                    round
                    flat
                    color="indigo-10"
                    icon="exit_to_app"
                    @click="logout"
                />
            </q-toolbar>
        </q-header>

        <q-page-container
            class="q-px-sm-xl q-px-xs-md"
            :class="{
                'bg-grey-2': greyBackground,
            }"
        >
            <router-view />
        </q-page-container>

        <q-footer v-if="!hideFooter">
            <q-toolbar
                class="bg-indigo-5 q-py-lg text-center"
            >
                <q-toolbar-title
                    class="text-body1"
                >
                    Made by Lucas Eliaquim
                </q-toolbar-title>
            </q-toolbar>
        </q-footer>
    </q-layout>
</template>

<script>
import authenticationServices from 'src/services/authentication';

export default {
    name: 'MainLayout',

    props: {
        hideFooter: {
            type: Boolean,
            default: false,
        },

        denseToolbar: {
            type: Boolean,
            default: false,
        },

        greyBackground: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            userInfo: {},
        };
    },

    computed: {
        fullName() {
            if (!this.userInfo.name || !this.userInfo.lastname) {
                return '';
            }

            const { name, lastname } = this.userInfo;

            return `${name} ${lastname}`;
        },

        nameAbreviation() {
            if (!this.userInfo.name || !this.userInfo.lastname) {
                return '';
            }

            const firstNameLetter = this.userInfo.name.charAt(0);
            const firstLastnameLetter = this.userInfo.lastname.charAt(0);

            return `${firstNameLetter}${firstLastnameLetter}`;
        },
    },

    methods: {
        ...authenticationServices,

        logout() {
            this.$q.localStorage.remove('secutityKeys');
            this.$router.push('/login');
        },
    },

    mounted() {
        this.userInfo = this.$q.localStorage.getItem('userInfo');
    },
};
</script>

<style lang="scss" scoped>
button {
    min-width: 0px;
}
</style>
