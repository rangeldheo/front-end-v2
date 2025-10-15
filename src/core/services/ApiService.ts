import { App } from "vue";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/JwtService";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL = process.env.VUE_APP_API_URL;

    // Ativa envio de cookies (necessário para Sanctum)
    ApiService.vueInstance.axios.defaults.withCredentials = true;
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(): void {
    const token = JwtService.getToken();
    if (token) {
      ApiService.vueInstance.axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`; // usar Bearer para Sanctum token
    }
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
  }

  public static clearHeader(): void {
    delete ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ];
  }

  public static query(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params);
  }

  public static get(resource: string, slug = ""): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(
      `${resource}${slug ? `/${slug}` : ""}`
    );
  }

  public static post(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.post(resource, params);
  }

  public static put(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(resource, params);
  }

  public static update(
    resource: string,
    slug: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  public static delete(resource: string): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(resource);
  }
}

export default ApiService;
