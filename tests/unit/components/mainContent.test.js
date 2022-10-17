import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import mainContent from "@/views/mainContent.vue";

Vue.use(Vuetify);

describe("mainContent.vue", () => {
  it("renders props.projectName when passed", () => {
    const msg = "test-finance";
    const wrapper = shallowMount(mainContent, {
      propsData: { projectName: msg },
    });
    expect(wrapper.text()).toMatch(`Welcome to ${msg}`);
  });
});
