<template>
  <!--begin::Wrapper-->
  <div class="bg-white rounded shadow-sm p-10 p-lg-15 mx-auto">
    <!--begin::Form-->
    <Form
      class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      novalidate="novalidate"
      @submit="onSubmitNewPassword"
      id="kt_new_password_form"
      :validation-schema="newPasswordSchema"
    >
      <!--begin::Heading-->
      <div class="mb-10 text-center">
        <h1 class="text-dark mb-3">Definir Nova Senha</h1>
        <div class="text-gray-400 fw-bold fs-4">
          Envie sua nova senha para <strong>{{ email }}</strong>
        </div>
      </div>
      <!--end::Heading-->

      <!--begin::Hidden Fields-->
      <Field type="hidden" name="email" :value="email" />
      <Field type="hidden" name="otp" :value="otp" />
      <!--end::Hidden Fields-->

      <!--begin::Input group-->
      <div class="mb-10 fv-row" data-kt-password-meter="true">
        <div class="mb-1">
          <label class="form-label fw-bolder text-dark fs-6">Nova Senha</label>
          <div class="position-relative mb-3">
            <Field
              class="form-control form-control-lg form-control-solid"
              type="password"
              placeholder="Nova senha"
              name="password"
              autocomplete="off"
            />
            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                <ErrorMessage name="password" />
              </div>
            </div>
          </div>

          <!-- Password strength meter -->
          <div
            class="d-flex align-items-center mb-3"
            data-kt-password-meter-control="highlight"
          >
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
            ></div>
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
            ></div>
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
            ></div>
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px"
            ></div>
          </div>
        </div>

        <div class="text-muted">
          Use 8 ou mais caracteres com letras, números e símbolos.
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-7">
        <label class="form-label fw-bolder text-dark fs-6">
          Confirmar Nova Senha
        </label>
        <Field
          class="form-control form-control-lg form-control-solid"
          type="password"
          placeholder="Confirme sua nova senha"
          name="password_confirmation"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password_confirmation" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="text-center">
        <button
          id="kt_new_password_submit"
          ref="submitButton"
          type="submit"
          class="btn btn-lg btn-primary w-100"
        >
          <span class="indicator-label">Salvar Nova Senha</span>
          <span class="indicator-progress">
            Por favor, aguarde...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
      <!--end::Actions-->
    </Form>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.min.js";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { Actions } from "@/store/enums/StoreEnums";
import { PasswordMeterComponent } from "@/assets/ts/components";
import ApiService from "@/core/services/ApiService";

export default defineComponent({
  name: "new-password",
  components: {
    Field,
    Form,
    ErrorMessage,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const submitButton = ref<HTMLButtonElement | null>(null);

    // Dados recebidos via rota (ex: /new-password?email=teste@email.com&otp=123456)
    const email = ref(route.query.email || "");
    const otp = ref(route.query.otp || "");

    const newPasswordSchema = Yup.object().shape({
      password: Yup.string()
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .required("Senha é obrigatória"),
      password_confirmation: Yup.string()
        .required("Confirmação de senha é obrigatória")
        .oneOf([Yup.ref("password"), null], "As senhas devem corresponder"),
    });

    onMounted(() => {
      nextTick(() => {
        PasswordMeterComponent.bootstrap();
      });
    });

    const onSubmitNewPassword = async (values) => {
      submitButton.value!.disabled = true;
      submitButton.value?.setAttribute("data-kt-indicator", "on");

      // Inclui email e OTP junto aos valores enviados
      const payload = {
        ...values,
        email: email.value,
        otp: otp.value,
      };

      try {
        // Chamada ao backend usando async/await
        const { data } = await ApiService.post("/password/reset", payload);

        // Se o backend retornar sucesso
        if (data.status === "success") {
          Swal.fire({
            text: data.message,
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ir para o login",
            customClass: {
              confirmButton: "btn fw-bold btn-light-primary",
            },
          }).then(() => {
            router.push({ name: "sign-in" });
          });
        } else {
          // Se o backend retornar erro
          Swal.fire({
            text: data.message || "Erro ao redefinir senha",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Tente novamente",
            customClass: {
              confirmButton: "btn fw-bold btn-light-danger",
            },
          });
        }
      } catch (error: any) {
        // Caso falha de rede ou outro erro
        Swal.fire({
          text: error.response?.data?.message || "Erro inesperado",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Tente novamente",
          customClass: {
            confirmButton: "btn fw-bold btn-light-danger",
          },
        });
      } finally {
        // Remove o indicador de carregamento
        if (submitButton.value) {
          submitButton.value.disabled = false;
          submitButton.value.removeAttribute("data-kt-indicator");
        }
      }
    };

    return {
      email,
      otp,
      newPasswordSchema,
      onSubmitNewPassword,
      submitButton,
    };
  },
});
</script>
