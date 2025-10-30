<script setup lang="ts">
import { useGameStore } from "~/store/gameStore";

interface RegistrationFormData {
  name?: string;
  email: string;
  phone?: string;
  password: string;
  password_confirm?: string;
}

interface ConfirmationCode {
  activationCode: string;
}

const isLogin = ref(true);
const registerRes = ref();
const registrationComplete = ref(false);
const regEmail = ref("");
const email = ref("");
const router = useRouter();

const gameStore = useGameStore();

const moveToRegister = () => {
  isLogin.value = false;
};

const submitRegistration = async (details: RegistrationFormData) => {
  registerRes.value = await $fetch("/register", { query: { details } });
  registrationComplete.value = true;
  regEmail.value = registerRes.value["CodeDeliveryDetails"]?.Destination;
};

const submitConfirmationCode = async (details: ConfirmationCode) => {
  const confirmCode = await $fetch("/confirmCode", {
    query: { code: details.activationCode, email: email.value },
  });
  if (
    "$metadata" in confirmCode &&
    confirmCode.$metadata.httpStatusCode === 200
  ) {
    isLogin.value = true;
    registrationComplete.value = false;
  }
};

const submitLogin = async (details: RegistrationFormData) => {
  const userLogin = await $fetch("/login", {
    query: { password: details.password, email: details.email },
  });
  if (userLogin?.success === true) {
    gameStore.loginUser(true);
    gameStore.storeAccessToken({
      accessToken: userLogin?.tokens.accessToken ?? "",
      idToken: userLogin?.tokens.idToken ?? "",
      refreshToken: userLogin?.tokens.refreshToken ?? "",
      expiresIn: userLogin?.tokens.expiresIn ?? 0,
    });
    gameStore.storeUserDetails(userLogin?.tokens.idToken ?? "");
    router.push("/home");
  }
};
</script>

<template>
  <div
    class="w-screen h-screen flex items-center bg-black bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url('https://images.unsplash.com/photo-1521364577880-a15e92cbff6f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170')] bg-cover"
  >
    <div class="flex w-full justify-around">
      <div class="flex flex-col">
        <div>
          <img src="/logo.png" class="h-24 w-24" />
        </div>
        <p class="text-5xl font-serif font-bold text-sky-500">Game Arcade</p>
        <p class="text-lg text-sky-300 font-serif">
          🚀 Jump in. Level up. Rule the leaderboard.
        </p>
      </div>
      <div
        class="bg-rose-50 w-[500px] min-h-[500px] p-8 border-2 border-rose-200 rounded-md font-serif mt-10 shadow-md"
        v-if="isLogin"
      >
        <FormKit
          type="form"
          id="login-form"
          submit-label="Login"
          @submit="submitLogin"
          :actions="false"
          #default="{ value }"
        >
          <div class="flex flex-col items-center text-center gap-6 w-full">
            <!-- Title -->
            <h1 class="text-2xl font-bold">
              Login to your Game Arcade Account
            </h1>

            <!-- Email -->
            <div class="w-4/5">
              <FormKit
                type="text"
                name="email"
                label="Your email"
                placeholder="jane@example.com"
                validation="required|email"
                input-class="w-full"
              />
            </div>

            <!-- Password -->
            <div class="w-4/5">
              <FormKit
                type="password"
                name="password"
                label="Password"
                validation="required|length:6|matches:/[^a-zA-Z]/"
                :validation-messages="{
                  matches: 'Please include at least one symbol',
                }"
                placeholder="Your password"
                input-class="w-full"
              />
            </div>

            <!-- Login button -->
            <div class="w-4/5">
              <FormKit type="submit" label="Login" outer-class="w-full" />
            </div>

            <!-- Register section -->
            <div
              class="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2"
            >
              <p>Don't have an account?</p>
              <button
                class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md border-2 border-green-500 transition cursor-pointer"
                @click="moveToRegister()"
              >
                Register Now!
              </button>
            </div>
          </div>
        </FormKit>
      </div>

      <div
        class="bg-rose-50 w-[500px] min-h-[500px] p-8 border-2 border-rose-200 rounded-md font-serif mt-10 shadow-md"
        v-if="!isLogin && !registrationComplete"
      >
        <FormKit
          type="form"
          id="registration-example"
          submit-label="Register"
          @submit="submitRegistration"
          :actions="false"
        >
          <div class="flex flex-col items-center text-center gap-6 w-full">
            <h1 class="text-2xl font-bold mb-2">Register your account!</h1>
            <div class="w-4/5">
              <FormKit
                type="text"
                name="name"
                label="Your name"
                placeholder="Jane Doe"
                validation="required"
              />
            </div>

            <div class="w-4/5">
              <FormKit
                type="text"
                name="email"
                label="Your email"
                placeholder="jane@example.com"
                validation="required|email"
                v-model="email"
              />
            </div>

            <div class="w-4/5">
              <FormKit
                type="tel"
                label="Phone number"
                name="phone"
                placeholder="xxx-xxx-xxxx"
                validation="matches:/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/"
                :validation-messages="{
                  matches: 'Phone number must be in the format xxx-xxx-xxxx',
                }"
                validation-visibility="dirty"
              />
            </div>

            <div class="double w-4/5 flex flex-col gap-6">
              <FormKit
                type="password"
                name="password"
                label="Password"
                validation="required|length:6|matches:/[^a-zA-Z]/"
                :validation-messages="{
                  matches: 'Please include at least one symbol',
                }"
                placeholder="Your password"
              />
              <FormKit
                type="password"
                name="password_confirm"
                label="Confirm password"
                placeholder="Confirm password"
                validation="required|confirm"
              />
            </div>

            <FormKit type="submit" label="Register" />
          </div>
        </FormKit>
      </div>

      <div
        class="bg-rose-50 w-[500px] min-h-[500px] p-8 border-2 border-rose-200 rounded-md font-serif mt-10 shadow-md flex justify-center items-center"
        v-if="!isLogin && registrationComplete"
      >
        <FormKit
          type="form"
          id="confirm-example"
          submit-label="Confirm"
          @submit="submitConfirmationCode"
          :actions="false"
        >
          <div class="flex flex-col gap-8 justify-center items-center w-full">
            <p class="font-bold text-xl">Confirm Registration</p>
            <p>
              An activation code has been sent to your email address - (). Enter
              the code below to complete your registration
            </p>
            <div class="w-4/5">
              <FormKit
                type="text"
                name="activationCode"
                placeholder="Enter Activation Code"
                validation="required"
              />
            </div>
            <FormKit type="submit" label="Confirm" />
          </div>
        </FormKit>
      </div>
    </div>
  </div>
</template>
