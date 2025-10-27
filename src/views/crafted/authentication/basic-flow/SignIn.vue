<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto">
    <!--begin::Form-->
    <Form
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmitLogin"
      :validation-schema="login"
    >
      <div class="text-center mb-10">
        <h1 class="text-dark mb-3">Bem vindo à Fretou</h1>
        <div class="text-gray-400 fw-bold fs-4">
          É novo aqui?
          <router-link to="/sign-up" class="link-primary fw-bolder">
            Crie sua conta
          </router-link>
        </div>
      </div>

      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bolder text-dark">Email</label>
        <Field
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="email"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="email" />
          </div>
        </div>
      </div>

      <div class="fv-row mb-10">
        <div class="d-flex flex-stack mb-2">
          <label class="form-label fw-bolder text-dark fs-6 mb-0">Senha</label>
          <router-link to="/password-reset" class="link-primary fs-6 fw-bolder">
            Esqueceu sua senha?
          </router-link>
        </div>
        <Field
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="password"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>

      <div class="text-center">
        <button
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">Entrar</span>
          <span class="indicator-progress">
            Aguarde...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </Form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form } from "vee-validate";
import { Actions } from "@/store/enums/StoreEnums";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import * as Yup from "yup";

export default defineComponent({
  name: "sign-in",
  components: { Field, Form, ErrorMessage },
  setup() {
    const store = useStore();
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);

    const login = Yup.object().shape({
      email: Yup.string()
        .email("Formato de e-mail inválido")
        .required("Email é obrigatório"),
      password: Yup.string()
        .min(4, "A senha deve ter pelo menos 4 caracteres")
        .required("Senha é obrigatória"),
    });

    const onSubmitLogin = async (values: {
      email: string;
      password: string;
    }) => {
      try {
        await store.dispatch(Actions.LOGIN, values);
        // Se chegou aqui, login foi realmente bem-sucedido
        await Swal.fire({
          text: "Você fez login com sucesso!",
          icon: "success",
          confirmButtonText: "Ok, entendi!",
        });
        await router.push({ name: "dashboard" });
      } catch (errors) {
        console.log("Erros é:" + errors);
        const message = Array.isArray(errors)
          ? errors[0]
          : typeof errors === "string"
          ? errors
          : "Email ou senha incorreto.";

        Swal.fire({
          text: message,
          icon: "error",
          confirmButtonText: "Tentar novamente!",
        });
      } finally {
        // Remove o indicador de carregamento
        if (submitButton.value) {
          submitButton.value.disabled = false;
          submitButton.value.removeAttribute("data-kt-indicator");
        }
      }
    };

    return { onSubmitLogin, login, submitButton };
  },
});
</script>
