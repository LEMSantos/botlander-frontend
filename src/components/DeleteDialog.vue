<template>
    <q-dialog
        v-model="showDialog"
        persistent
    >
        <q-card
            class="dialog-size"
        >
            <q-card-section>
                <div
                    class="text-h6"
                >
                    {{ title }}
                </div>
            </q-card-section>

            <q-card-section class="row items-center">
                <span
                    class="q-ml-sm"
                >
                    {{ message }}
                </span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn
                    flat
                    :label="cancelBtnText"
                    :disable="okLoading"
                    no-caps
                    color="primary"
                    :class="{
                        'reset-btn': $q.screen.lt.sm,
                    }"
                    v-close-popup
                />
                <q-btn
                    no-caps
                    :label="okBtnText"
                    :loading="okLoading"
                    :disable="okLoading"
                    color="primary"
                    :class="{
                        'reset-btn': $q.screen.lt.sm,
                    }"
                    @click="$emit('confirmed')"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            required: true,
        },

        title: {
            type: String,
            default: '',
        },

        message: {
            type: String,
            default: '',
        },

        okBtnText: {
            type: String,
            default: 'Ok',
        },

        cancelBtnText: {
            type: String,
            default: 'Cancelar',
        },

        okLoading: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            showDialog: false,
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
};
</script>

<style lang="scss" scoped>
.dialog-size {
    width: 500px;
}
</style>
