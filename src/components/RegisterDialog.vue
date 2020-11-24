<template>
    <q-dialog
        v-model="showDialog"
    >
        <q-card
            :class="{
                'medium-dialog': !$q.platform.is.mobile,
            }"
        >
            <q-toolbar class="q-py-md">
                <q-toolbar-title
                    class="text-weight-bold text-h5 text-grey-10"
                >
                    Crie sua conta
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
                <q-form
                    class="q-gutter-y-md"
                    @submit="onSubmitRegister"
                >
                    <div class="row q-col-gutter-x-md">
                        <q-input
                            v-model="registerForm.name"
                            outlined
                            dense
                            placeholder="Nome"
                            :disable="loading"
                            class="col-6"
                            :error="$v.registerForm.name.$error"
                            error-message="O nome é obrigatório"
                        />

                        <q-input
                            v-model="registerForm.lastname"
                            outlined
                            dense
                            placeholder="Sobrenome"
                            :disable="loading"
                            class="col-6"
                            :error="$v.registerForm.lastname.$error"
                            error-message="O sobrenome é obrigatório"
                        />
                    </div>

                    <div class="row q-col-gutter-x-md">
                        <q-input
                            v-model="registerForm.email"
                            outlined
                            dense
                            type="email"
                            placeholder="E-mail"
                            :disable="loading"
                            class="col-7"
                            :error="$v.registerForm.email.$error || errors.email"
                            :error-message="errors.email
                                ? 'Já existe uma conta para esse email.'
                                : 'O email não está no formato correto'"
                        />

                        <q-input
                            v-model="registerForm.username"
                            outlined
                            dense
                            placeholder="Usuário"
                            :disable="loading"
                            class="col-5"
                            :error="$v.registerForm.username.$error || errors.username"
                            :error-message="errors.username
                                ? 'Já existe uma conta para esse usuário.'
                                : 'O usuário é obrigatório'"
                        />
                    </div>

                    <q-input
                        v-model="registerForm.password"
                        outlined
                        dense
                        type="password"
                        :disable="loading"
                        placeholder="Senha"
                        :error="$v.registerForm.password.$error"
                        error-message="A senha é obrigatória e deve ter no mínimo 8 caracteres"
                    />

                    <q-input
                        v-model="passwordValidation"
                        outlined
                        dense
                        type="password"
                        :disable="loading"
                        placeholder="Digite novamente a senha"
                        :error="$v.passwordValidation.$error"
                        error-message="As senhas devem ser iguais"
                    />

                    <div class="q-pt-md row justify-end">
                        <q-btn
                            no-caps
                            label="Inscrever-se"
                            type="submit"
                            color="green-10"
                            class="q-mb-md"
                            :loading="loading"
                            :disable="loading"
                        />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import {
    required,
    sameAs,
    minLength,
    email,
} from 'vuelidate/lib/validators';

export default {
    name: 'RegisterDialog',
    props: {
        value: {
            type: Boolean,
            required: true,
        },

        loading: {
            type: Boolean,
            default: false,
        },

        errors: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            registerForm: {
                name: '',
                lastname: '',
                email: '',
                username: '',
                password: '',
            },
            passwordValidation: '',
            showDialog: false,
        };
    },

    validations: {
        registerForm: {
            name: {
                required,
                minLength: minLength(3),
            },
            lastname: { required },
            email: {
                required,
                email,
            },
            username: { required },
            password: {
                required,
                minLength: minLength(8),
            },
        },
        passwordValidation: {
            required,
            sameAsPassword: sameAs((nested) => nested.registerForm.password),
        },
    },

    watch: {
        value: {
            handler(newValue) {
                this.showDialog = newValue;

                if (!newValue) {
                    this.registerForm = {
                        name: '',
                        lastname: '',
                        email: '',
                        username: '',
                        password: '',
                    };

                    this.passwordValidation = '';

                    this.$v.$reset();
                }
            },

            immediate: true,
        },

        showDialog(newValue) {
            this.$emit('input', newValue);
        },
    },

    methods: {
        onSubmitRegister() {
            this.$v.$touch();

            if (!this.$v.$error) {
                this.$emit('submmited', this.registerForm);
            }
        },
    },
};
</script>
