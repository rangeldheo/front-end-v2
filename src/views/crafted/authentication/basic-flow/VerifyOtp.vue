<template>
  <div class="w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto">
    <!--begin::Form-->
    <Form
      class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      @submit="onSubmitVerifyOtp"
      :validation-schema="verifyOtpSchema"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <h1 class="text-dark mb-3">Validar codigo</h1>
        <div class="text-gray-400 fw-bold fs-4">
          Enviamos um código para o seu e-mail cadastro.
        </div>
      </div>
      <!--end::Heading-->
      <div class="fv-row mb-7">
        <label class="form-label fw-bolder text-gray-900 fs-6">Email</label>
        <Field
          name="email"
          type="email"
          class="form-control form-control-solid"
          placeholder="Enter your email"
          autocomplete="off"
        />
        <ErrorMessage name="email" class="text-danger mt-1" />
      </div>

      <div class="fv-row mb-10">
        <label class="form-label fw-bolder text-gray-900 fs-6"
          >Validar código</label
        >
        <Field
          name="otp"
          type="text"
          class="form-control form-control-solid"
          placeholder="Digite seu código"
          maxlength="6"
          autocomplete="off"
        />
        <ErrorMessage name="otp" class="text-danger mt-1" />
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="d-flex flex-wrap justify-content-center pb-lg-0">
        <button
          type="submit"
          ref="submitButton"
          class="btn btn-lg btn-primary fw-bolder me-4"
        >
          <span class="indicator-label">Validar</span>
          <span class="indicator-progress">
            Por favor aguarde...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>

        <router-link
          to="/forgot-password"
          class="btn btn-lg btn-light-primary fw-bolder"
          >Voltar</router-link
        >
      </div>
      <!--end::Actions-->
    </Form>
    <!--end::Form-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import { useStore } from "vuex";
import { Actions } from "@/store/enums/StoreEnums";
import Swal from "sweetalert2/dist/sweetalert2.min.js";

export default defineComponent({
  name: "verify-otp",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const store = useStore();
    const submitButton = ref<HTMLButtonElement | null>(null);

    const verifyOtpSchema = Yup.object().shape({
      email: Yup.string().email().required().label("Email"),
      otp: Yup.string()
        .required("Code is required")
        .min(4)
        .max(10)
        .label("OTP"),
    });

    const onSubmitVerifyOtp = async (values) => {
      submitButton.value!.disabled = true;
      submitButton.value?.setAttribute("data-kt-indicator", "on");

      // Chama a action para validar o OTP
      await store.dispatch(Actions.VERIFY_OTP, values);

      const [errorName] = Object.keys(store.getters.getErrors);
      const error = store.getters.getErrors[errorName];

      if (!error) {
        Swal.fire({
          text: "Code verified successfully!",
          icon: "success",
          confirmButtonText: "Continue",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn fw-bold btn-light-primary",
          },
        }).then(() => {
          // Redireciona para redefinir senha
          // (ajuste a rota conforme seu sistema)
        });
      } else {
        Swal.fire({
          text: error[0],
          icon: "error",
          confirmButtonText: "Try again",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn fw-bold btn-light-danger",
          },
        });
      }

      submitButton.value?.removeAttribute("data-kt-indicator");
      submitButton.value!.disabled = false;
    };

    return {
      verifyOtpSchema,
      onSubmitVerifyOtp,
      submitButton,
    };
  },
});
</script>
