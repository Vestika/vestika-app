<template>
  <v-container fill-height fluid>
    <v-row justify="center" align="center">
      <div class="relative inline-block overflow-hidden vue-grid-item">
        <v-card class="elevation-2" width="600px" height="500px">
          <div align="center">
            <AvatarInput
              style="height: 100px; width: 100px; border-radius: 9999px; top: 20px"
              v-model="form.avatar"
              :default-src="this.avatarImageSrc"
              @input="updateAvatarImage"
              @error-loading-image="DownloadAvatarImage"
            ></AvatarInput>
          </div>
          <v-card-text>
            <v-text-field
              label="Full Name"
              v-model="filledData.filledName"
            ></v-text-field>
            <v-select
              :items="['Male', 'Female', 'Other']"
              label="Gender"
              v-model="filledData.filledGender"
            ></v-select>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
              style="background-color: blue !important;"
            >
              <template
                v-slot:activator="{ on, attrs }"
                style="background-color: blue !important;"
              >
                <v-text-field
                  v-model="filledData.filledDate"
                  label="Birth Date"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                :max="new Date().toISOString().split('T')[0]"
                v-model="filledData.filledDate"
                @input="menu = false"
              >
              </v-date-picker>
            </v-menu>
            <v-autocomplete
              v-model="filledData.filledCountry"
              :items="countries"
              label="Country"
              placeholder="Select..."
            ></v-autocomplete>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :loading="loading"
              :disabled="loading"
              color="var(--v-mainTheme-base)"
              text
              @click="Save"
            >
              {{ saveText }}
              <v-icon dark color="var(--v-success-base)" v-show="saved">
                mdi-checkbox-marked-circle
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import AvatarInput from "@/components/avatar/AvatarInput";
import { COUNTRIES, AVATAR_DEFAULT_IMAGE } from "@/utils/constants";
import { FireGetUser } from "@/utils/firebase";

import api from "@/utils/api";

const localStorageManager = require("../utils/localStorage");

export default {
  async created() {
    try {
      var user_info_obj = localStorageManager.get("user_info");
      if (!user_info_obj) {
        try {
          user_info_obj = await api.get("users");
        } catch (error) {
          console.log("No user data");
          if (error.response.status === 404) {
            this.filledData.filledName = await this.GetDefaultName();
            this.filledData.filledCountry = null;
            this.filledData.filledGender = null;
            this.filledData.filledDate = null;
          }
          return;
        }
      }
      this.filledData.filledName = user_info_obj.name;
      this.filledData.filledDate = user_info_obj.birth_date;
      this.filledData.filledGender = user_info_obj.gender;
      this.filledData.filledCountry = user_info_obj.country;
      if (user_info_obj.profile_picture_url) {
        this.avatarImageSrc = user_info_obj.profile_picture_url;
      } else {
        this.avatarImageSrc = AVATAR_DEFAULT_IMAGE;
        this.user_info.profile_picture_url = this.avatarImageSrc;
      }
      localStorageManager.set("user_info", user_info_obj);
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  components: {
    AvatarInput,
  },
  data() {
    return {
      form: {
        avatar: null,
      },
      loading: false,
      saved: false,
      saveText: "Save",
      selection: 1,
      menu: false,
      countries: COUNTRIES,
      filledData: {
        filledCountry: null,
        filledName: null,
        filledGender: null,
        filledDate: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000,
        )
          .toISOString()
          .substr(0, 10),
      },
      avatarImageFile: null,
      avatarImageSrc: "",
      user_info: {
        country: null,
        name: null,
        gender: null,
        birth_date: null,
        profile_picture_url: null,
      },
    };
  },
  methods: {
    async GetDefaultName() {
      try {
        console.log("getting default user name");
        const user = await FireGetUser();
        return user.email.split("@")[0];
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    delay(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    },

    updateAvatarImage(input) {
      this.avatarImageFile = input;
    },

    async DownloadAvatarImage() {
      var profilePictureUrl = await api.get(
        "/users/download_profile_picture_signed_url",
      );
      this.$emit("on-profile-image-change", profilePictureUrl);
      this.avatarImageSrc = profilePictureUrl;
      this.user_info.profile_picture_url = profilePictureUrl;
      localStorageManager.set("user_info", this.user_info);
      return profilePictureUrl;
    },

    async getUserProfilePictureUrl() {
      let signed_url_for_upload;
      try {
        console.log("getting signed url for upload");
        signed_url_for_upload = await api.get(
          "/users/profile_picture_signed_url",
        );
        console.log("uploading profile picture to url");
        await axios.put(signed_url_for_upload, this.avatarImageFile, {
          headers: { "Content-Type": this.avatarImageFile.type },
        });
        console.log("getting profile picture from bucket");
        return this.DownloadAvatarImage();
      } catch (error) {
        console.log(error);
        return this.avatarImageSrc;
      }
    },

    async saveUserInfo() {
      this.user_info.name = this.filledData.filledName;
      this.user_info.birth_date = this.filledData.filledDate;
      this.user_info.country = this.filledData.filledCountry;
      this.user_info.gender = this.filledData.filledGender;
      if (this.avatarImageFile) {
        this.user_info.profile_picture_url = await this.getUserProfilePictureUrl();
      } else {
        this.user_info.profile_picture_url = this.avatarImageSrc;
      }

      try {
        var user_info_obj = await api.get("users");
        var user_info_id = user_info_obj.uid;
        if (user_info_id) {
          console.log("updating user info data");
          await api.put(`/users/}`, this.user_info, {
            params: {
              entity_id: user_info_id,
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log("user info data was updated");
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 404) {
          console.log("failed getting user info data, creating user info data");
          try {
            await api.post("/users", this.user_info);
          } catch (e) {
            console.log(error);
            return false;
          }
        } else {
          return false;
        }
      }
      this.$emit("on-profile-image-change", this.user_info.profile_picture_url);
      localStorageManager.set("user_info", this.user_info);
    },

    async Save() {
      this.loading = true;
      await this.saveUserInfo();
      this.loading = false;
      this.saved = true;
      this.saveText = "";
      await this.delay(1000);
      this.saved = false;
      this.saveText = "Save";
    },
  },
};
</script>

<style scoped>
.theme--dark.v-application {
  background-color: var(--v-background-base);
}

.theme--dark.v-list {
  background: var(--v-background-base);
}

.theme--dark.v-list-item:hover:before {
  opacity: 0.14;
}
/deep/ .v-avatar {
  height: 100px !important;
  min-width: 100px !important;
  width: 100px !important;
}

/deep/ .theme--dark.v-picker__body {
  background-color: var(--v-background-base) !important;
}

/deep/ .v-picker__title {
  background-color: var(--v-background-base) !important;
}
</style>
