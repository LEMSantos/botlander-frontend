<template>
    <q-page class="flex flex-center bg-indigo-5">
        <q-card class="login-card">
            <q-card-section class="bg-indigo-10">
                <div class="text-white text-h4 text-center text-weight-bold">
                    Botlander
                </div>
            </q-card-section>

            <q-card-section>
                <q-banner
                    v-if="showErrorBanner"
                    class="text-red bg-white text-center text-caption"
                >
                    O nome de usuário e a senha não correspondem a nenhuma conta
                    no nosso registro. Verifique-as e tente novamente.
                </q-banner>

                <q-form
                    @submit="onSubmitLogin"
                    class="q-gutter-xs"
                >
                    <div>
                        <div class="q-mb-sm">
                            Usuário
                        </div>

                        <q-input
                            outlined
                            dense
                            v-model="identity"
                            placeholder="nome de usuário ou e-mail"
                            :disable="loadingSubmitLogin"
                            :error="$v.identity.$error"
                            error-message="O usuário é obrigatório"
                        />
                    </div>

                    <div>
                        <div class="q-mb-sm">
                            Senha
                        </div>

                        <q-input
                            outlined
                            dense
                            :type="showPassword ? 'text' : 'password'"
                            v-model="password"
                            placeholder="senha"
                            :disable="loadingSubmitLogin"
                            :error="$v.password.$error"
                            error-message="A senha é obrigatória"
                        >
                            <template v-slot:append>
                                <q-icon
                                    :name="showPassword ? 'visibility_off' : 'visibility'"
                                    @click="togglePasswordVisibility"
                                    class="cursor-pointer"
                                />
                            </template>
                        </q-input>
                    </div>

                    <div class="row justify-end">
                        <router-link
                            to="/register"
                            class="text-primary text-caption"
                            :disable="loadingSubmitLogin"
                        >
                            Esqueceu a senha?
                        </router-link>
                    </div>

                    <div
                        class="row justify-between items-center q-pt-sm"
                    >
                        <q-btn
                            no-caps
                            label="Entrar"
                            type="submit"
                            color="primary"
                            class="full-width q-mb-md"
                            :loading="loadingSubmitLogin"
                            :disable="loadingSubmitLogin"
                        />

                        <q-btn
                            no-caps
                            label="Inscrever-se"
                            color="green-10"
                            class="full-width"
                            @click="showRegisterDialog = true"
                            :disable="loadingSubmitLogin"
                        />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>

        <register-dialog
            v-model="showRegisterDialog"
            :loading="loadingSubmitRegister"
            :errors="postUserErrors"
            @submmited="onSubmitRegister"
        />
    </q-page>
</template>

<script>
import authServices from 'src/services/authentication';
import userServices from 'src/services/user';
import { required } from 'vuelidate/lib/validators';
import RegisterDialog from 'src/components/RegisterDialog';
import utils from 'src/utils';

export default {
    name: 'PageLogin',

    components: {
        RegisterDialog,
    },

    data() {
        return {
            identity: '',
            password: '',
            showPassword: false,
            loadingSubmitLogin: false,
            loadingSubmitRegister: false,
            showErrorBanner: false,
            showRegisterDialog: false,
            postUserErrors: {
                email: false,
                username: false,
            },
        };
    },

    validations: {
        identity: { required },
        password: { required },
    },

    methods: {
        ...authServices,
        ...userServices,

        onSubmitLogin() {
            this.$v.$touch();

            if (!this.$v.$error) {
                const payload = {
                    identity: this.identity,
                    password: this.password,
                };

                this.loadingSubmitLogin = true;
                this.showErrorBanner = false;

                this.postCredentials(payload)
                    .then(({ data }) => {
                        utils.setSecurityData({
                            access_token: data.access_token,
                            refresh_token: data.refresh_token,
                        });

                        this.$q.localStorage.set('userInfo', data.user);

                        this.$router.push('/');
                    })
                    .catch(() => {
                        this.showErrorBanner = true;
                    })
                    .finally(() => {
                        this.loadingSubmitLogin = false;
                    });
            }
        },

        onSubmitRegister(payload) {
            this.loadingSubmitRegister = true;

            this.postUser(payload)
                .then(() => {
                    this.showRegisterDialog = false;
                    this.$q.notify({
                        message: 'Usuário criado com sucesso',
                        type: 'positive',
                        position: 'top',
                        timeout: 2000,
                    });
                })
                .catch(({ response }) => {
                    switch (response.status) {
                    case 409:
                        this.postUserErrors = {
                            ...response.data.errors,
                        };
                        break;
                    default:
                        //
                    }
                })
                .finally(() => {
                    this.loadingSubmitRegister = false;
                });
        },

        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
    },
};
</script>

<style lang="scss" scoped>
.login-card {
    max-width: 350px;
    width: calc(100% - 32px)
}

@media (max-width: 400px) {
    button {
        min-width: 100px;
    }
}
</style>
