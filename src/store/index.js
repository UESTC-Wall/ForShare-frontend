import { create } from "mobx-persist";
import LoginStateStore from "./LoginStateStore";

const persistStore = create();

export const LoginState = persistStore('login', new LoginStateStore());
