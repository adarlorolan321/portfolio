<template>
    <SectionTemplate :section-data="props.sectionData">
        <!-- Title -->
        <h1 class="cover-title display-1" v-html="coverTitle"/>

        <!-- Divider -->
        <hr class="solid-divider ms-1 me-1">

        <!-- Info Items -->
        <InlineList class="info-list" :items="props.sectionData.content['items']['contactListItems']"/>

        <!-- Description -->
        <p class="cover-description lead text-normal mb-4 mb-md-5"
           v-html="props.sectionData.content['locales']['bio']"/>

        <!-- Management Links -->
        <SocialLinks :items="props.sectionData.content['items']['socialCircles']"/>
    </SectionTemplate>
</template>

<script setup>
import SectionTemplate from "../_templates/SectionTemplate.vue"
import {computed} from "vue"
import {useData} from "../../../composables/data.js"
import {useNavigation} from "../../../composables/navigation.js"
import InlineList from "../../widgets/InlineList.vue"
import SocialLinks from "../../widgets/SocialLinks.vue"

const data = useData()
const navigation = useNavigation()

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})

/**
 * @type {ComputedRef<String>}
 */
const coverTitle = computed(() => {
    if(navigation.isAllAtOnceMode()) {
        return props.sectionData.content['locales']['welcome']
    }
    else {
        return props.sectionData.content['locales']['welcomeShort']
    }
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.cover-title {
    margin-bottom: 1rem;
    text-transform: uppercase;
    font-weight: bold;
    background: linear-gradient(135deg, $primary 0%, $secondary 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fadeInUp 0.8s ease-out;
    letter-spacing: -0.02em;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.solid-divider {
    @include media-breakpoint-up($navigation-sidebar-breakpoint) {
        display: none;
    }
    animation: slideIn 0.6s ease-out 0.2s backwards;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.info-list {
    @include generate-dynamic-styles-with-hash((
        xxxl: (margin-bottom: 2.5rem),
        lg: (margin-bottom: 2rem),
        md: (margin-bottom: 1.2rem)
    ));
    animation: fadeIn 0.8s ease-out 0.3s backwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.cover-description {
    animation: fadeIn 0.8s ease-out 0.4s backwards;
}
</style>