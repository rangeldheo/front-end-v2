import { createStore } from "vuex";
import { config } from "vuex-module-decorators";

import BodyModule from "@/store/modules/BodyModule";
import BreadcrumbsModule from "@/store/modules/BreadcrumbsModule";
import ConfigModule from "@/store/modules/ConfigModule";
import AuthModule from "./modules/AuthModule";

config.rawError = true;

const store = createStore({
  modules: {
    BodyModule,
    BreadcrumbsModule,
    ConfigModule,
    AuthModule,
  },
});

export default store;
