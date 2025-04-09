<template>
  <!-- Bootstrap Modal -->
  <div
    class="modal modal-xl fade"
    :id="UNIQUE_ID"
    tabindex="-1"
    :aria-labelledby="`${UNIQUE_ID}-label`"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Modal Content -->
      <div class="modal-content">
        <!-- Close Button -->
        <button class="close-button" data-bs-dismiss="modal" aria-label="Close">
          <i class="fa fa-close"></i>
        </button>

        <!-- Body -->
        <div v-if="props.project" class="modal-body py-5 py-lg-4">
          <!-- Content Row -->
          <div class="row text-center text-lg-start p-2 p-md-4">
            <!-- Image Column -->
            <div class="col-12 col-lg-4 pe-0 pe-lg-4">
              <ImageView
                :src="props.project['logoUrl']"
                :alt="props.project['title']"
                :spinner-enabled="true"
                class="img-fluid logo my-auto my-lg-0 mb-3"
              />
            </div>

            <!-- Texts Column -->
            <div class="col-12 col-lg-8">
              <!-- Title -->
              <h1 class="fw-bold mb-3" v-html="props.project['title']" />

              <!-- Tags -->
              <div class="text-4">
                <i class="fa fa-tag me-1" />
                {{ data.getString("tags") }}:
                <Tags
                  :items="props.project['locales']['tags']"
                  :item-class="'bg-primary'"
                  class="d-inline ms-2"
                />
              </div>

              <!-- About SubSection -->
              <div class="modal-subsection">
                <!-- Title -->
                <h5 class="d-none d-lg-inline-block fw-bold">
                  <i class="fa fa-file me-2" />
                  <span class="ms-1">{{ data.getString("aboutProject") }}</span>
                </h5>

                <!-- Content -->
                <p
                  v-html="props.project['locales']['description']"
                  class="text-3 text-light-7"
                />
              </div>

              <!-- Links SubSection -->
              <div class="modal-subsection">
                <!-- Title -->
                <h5 class="d-inline-block fw-bold">
                  <i class="fa fa-external-link me-2" />
                  <span class="ms-1">{{ data.getString("whereToFind") }}</span>
                </h5>

                <!-- Content -->
                <p
                  v-html="
                    data
                      .getString('whereToFindDescription')
                      .replace(
                        '${project}',
                        `<strong>${props.project['title']}</strong>`
                      )
                  "
                  class="text-3 text-light-7"
                />

                <!-- Management Links -->

                <SocialLinks
                  v-if="props.project['links'].length > 0"
                  :items="props.project['links']"
                />
                <h5 class="d-inline-block fw-bold" v-else>
                  <span class="ms-1">Coming Soon ..</span>
                </h5>
              </div>
            </div>
            <!-- Images Section -->
            <!-- Image Preview Overlay -->
            <div
              v-if="previewImage"
              class="image-preview-overlay"
              @click="previewImage = null"
            >
              <img
                :src="previewImage.src"
                :alt="previewImage.alt"
                @click.stop
              />
              <button class="close-preview" @click="previewImage = null">
                <i class="fa fa-close"></i>
              </button>
            </div>

            <!-- Images Section -->
            <div class="modal-subsection">
              <h5 class="fw-bold">
                <i class="fa fa-images me-2" />
                <span class="ms-1">Quick Look</span>
              </h5>
              <div class="row mt-3">
                <div
                  v-for="(image, index) in props.project['images']"
                  :key="index"
                  class="col-6 col-lg-4 mb-3"
                >
                  <ImageView
                    :src="image.src"
                    :alt="image.alt"
                    :spinner-enabled="true"
                    class="img-fluid my-auto my-lg-0 mb-3"
                    style="cursor: pointer"
                    @click="previewImage = image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useData } from "../../../composables/data.js";
import Modal from "/node_modules/bootstrap/js/src/modal";
import ImageView from "../../widgets/ImageView.vue";
import Tags from "../../widgets/Tags.vue";
import SocialLinks from "../../widgets/SocialLinks.vue";

/**
 * @property {Object} project
 */
const props = defineProps({
  project: Object,
});

const data = useData();

/**
 * @const
 * @type {string}
 */
const UNIQUE_ID = "gallery-modal";

/**
 * @type {Modal|null}
 */
let bsModal = null;

/**
 * @public
 */
const display = () => {
  if (!bsModal) {
    return;
  }

  bsModal.show();
};

const previewImage = ref(null)

/**
 * @private
 */
onMounted(() => {
  const elModal = document.getElementById(UNIQUE_ID);
  if (elModal) {
    bsModal = new Modal(elModal, {});
  }
});

defineExpose({
  display,
});
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.modal-content {
  background-color: $light-1;
}

.image-preview-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;

    img {
        max-width: 90%;
        max-height: 80%;
        border-radius: 12px;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
    }

    .close-preview {
        position: absolute;
        top: 30px;
        right: 40px;
        font-size: 2rem;
        color: white;
        background: none;
        border: none;
        cursor: pointer;

        &:hover {
            color: $primary;
        }
    }
}


.close-button {
  position: absolute;
  right: 20px;
  top: 10px;

  z-index: 99;
  padding: 0;
  margin: 0;
  font-size: 1.7rem;

  background-color: transparent;
  border-color: transparent;
  color: $light-4;

  &:hover {
    color: $primary;
  }
}

.modal-subsection {
  @include generate-dynamic-styles-with-hash(
    (
      xxxl: (
        margin-top: 35px,
      ),
      lg: (
        margin-top: 30px,
      ),
      sm: (
        margin-top: 25px,
      ),
    )
  );
}

.logo {
  @include generate-dynamic-styles-with-hash(
    (
      xxxl: (
        max-width: 100%,
      ),
      lg: (
        max-width: max(150px, min(20vw, 100%)),
        margin-bottom: 80px,
      ),
      sm: (
        max-width: max(130px, 30vw),
      ),
    )
  );

  margin: auto;
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 27.5%;
}
</style>