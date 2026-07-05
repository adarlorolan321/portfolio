<template>
    <form id="contact-form" class="contact-form">
        <div v-if="alertStatus" class="contact-alert">
            <Alert :type="alertStatus.type" :message="alertStatus.message"/>
        </div>

        <div class="contact-fields">
            <div class="contact-field">
                <label class="contact-label" for="form-name">
                    <i class="fa-solid fa-signature" aria-hidden="true"/>
                    {{ data.getString('name') }}
                </label>
                <input id="form-name"
                       class="contact-input"
                       type="text"
                       :placeholder="data.getString('name')"
                       required>
            </div>

            <div class="contact-field">
                <label class="contact-label" for="form-email">
                    <i class="fa-solid fa-envelope" aria-hidden="true"/>
                    {{ data.getString('email') }}
                </label>
                <input id="form-email"
                       class="contact-input"
                       type="email"
                       :placeholder="data.getString('email')"
                       required>
            </div>

            <div class="contact-field">
                <label class="contact-label" for="form-subject">
                    <i class="fa-solid fa-pen-to-square" aria-hidden="true"/>
                    {{ data.getString('subject') }}
                </label>
                <input id="form-subject"
                       class="contact-input"
                       type="text"
                       :placeholder="data.getString('subject')"
                       required>
            </div>

            <div class="contact-field contact-field--full">
                <label class="contact-label" for="form-message">
                    <i class="fa-solid fa-message" aria-hidden="true"/>
                    {{ data.getString('message') }}
                </label>
                <textarea id="form-message"
                          class="contact-input contact-textarea"
                          :placeholder="data.getString('message')"
                          required/>
            </div>
        </div>

        <button class="contact-submit"
                type="submit"
                id="btn-submit-message"
                :disabled="submitStatus === SubmitStatus.SENDING">
            <i class="fa-solid fa-paper-plane" aria-hidden="true"/>
            <span>{{ submitStatus === SubmitStatus.SENDING ? data.getString('sendingMessage') + '...' : data.getString('sendMessage') }}</span>
        </button>
    </form>
</template>

<script setup>
import {useData} from "../../../composables/data.js"
import {useLayout} from "../../../composables/layout.js"
import {computed, onMounted, ref} from "vue"
import {useNavigation} from "../../../composables/navigation.js"
import Alert from "../../widgets/Alert.vue"
import emailjs from 'emailjs-com'

const SERVICE_ID = 'service_eiwzhyk'
const TEMPLATE_ID = 'template_7kihy99'
const USER_ID = 'g_hC3AOPmFdwXxEhA'

const data = useData()
const layout = useLayout()
const navigation = useNavigation()

/**
 * @enum
 */
const SubmitStatus = {
    ENABLED: "enabled",
    SENDING: "sending",
    SENT: "sent",
    ERROR: "error"
}

/**
 * @const
 * @type {string[]}
 */
const FORM_FIELDS = ['name', 'email', 'subject', 'message']

/**
 * @type {ref.<SubmitStatus>}
 */
const submitStatus = ref(null)

/**
 * @type {number}
 */
let submitAttempts = 0

/**
 * @private
 */
onMounted(() => {
    const form = document.getElementById('contact-form')
    if (form.attachEvent) {
        form.attachEvent("submit", _onSubmit)
    } else {
        form.addEventListener("submit", _onSubmit)
    }

    submitStatus.value = SubmitStatus.ENABLED
})

/**
 * @private
 */
const _clearAllFields = () => {
    FORM_FIELDS.forEach(field => {
        const elField = document.getElementById(`form-${field}`)
        elField.value = ''
    })
}

/**
 * @param e
 * @return {boolean}
 * @private
 */
const _onSubmit = (e) => {
    if (e.preventDefault) {
        e.preventDefault()
    }

    submitStatus.value = SubmitStatus.SENDING
    _sendMessage()
    return false
}

/**
 * @private
 */
const _sendMessage = () => {
    const feedbackView = layout.getFeedbackView()
    feedbackView.showActivitySpinner(data.getString("sendingMessage") + "...")
    submitAttempts++

    const templateParams = {
        name: document.getElementById('form-name').value,
        email: document.getElementById('form-email').value,
        subject: document.getElementById('form-subject').value,
        message: document.getElementById('form-message').value,
    }

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID)
        .then(() => {
            _onMessageSent()
        })
        .catch((error) => {
            console.error("EmailJS error:", error)
            _onMessageError()
        })
}

/**
 * @private
 */
const _onMessageSent = () => {
    const feedbackView = layout.getFeedbackView()
    feedbackView.hideActivitySpinner()

    _clearAllFields()
    submitStatus.value = SubmitStatus.SENT
    if(navigation.isOneAtOnceMode()) {
        layout.instantScrollTo(0, false)
    }
}

/**
 * @private
 */
const _onMessageError = () => {
    const feedbackView = layout.getFeedbackView()
    feedbackView.hideActivitySpinner()
    submitStatus.value = SubmitStatus.ERROR
}

/**
 * @return {{type: string, message: String}|null}
 * @private
 */
const alertStatus = computed(() => {
    switch (submitStatus.value) {
        case SubmitStatus.SENT:
            return {type: 'success', message: data.getString('messageSent')}
        case SubmitStatus.ERROR:
            return {type: 'danger', message: data.getString('messageError')}
        default:
            return null
    }
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-alert {
    :deep(.alert) {
        margin: 0;
        padding: 0.65rem 0.85rem;
        font-size: 0.82rem;
        border-radius: 8px;
        border: 1px solid var(--color-border);
        background: var(--color-bg-elevated);
        color: var(--color-text);
    }

    :deep(.alert-success) {
        border-color: rgba(var(--color-primary-rgb), 0.35);
        color: var(--color-primary);
    }

    :deep(.alert-danger) {
        border-color: rgba(239, 68, 68, 0.35);
        color: #f87171;
    }
}

.contact-fields {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.85rem;

    @include media-breakpoint-up(md) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

.contact-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    &--full {
        @include media-breakpoint-up(md) {
            grid-column: 1 / -1;
        }
    }
}

.contact-label {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    font-weight: 500;
    text-transform: lowercase;
    color: var(--color-text-muted);

    i {
        font-size: 0.68rem;
        color: var(--color-primary);
    }
}

.contact-input {
    width: 100%;
    padding: 0.7rem 0.85rem;
    font-size: 0.86rem;
    font-family: inherit;
    color: var(--color-heading);
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        background-color 0.2s ease;

    &::placeholder {
        color: var(--color-text-muted);
        opacity: 0.75;
    }

    &:focus {
        outline: none;
        border-color: rgba(var(--color-primary-rgb), 0.45);
        box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.12);
        background: var(--color-bg-card);
    }
}

.contact-textarea {
    min-height: 140px;
    resize: vertical;
    line-height: 1.55;
}

.contact-submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    margin-top: 0.25rem;
    padding: 0.7rem 1rem;
    font-size: 0.84rem;
    font-weight: 500;
    text-transform: lowercase;
    color: var(--color-heading);
    background: rgba(var(--color-primary-rgb), 0.12);
    border: 1px solid rgba(var(--color-primary-rgb), 0.35);
    border-radius: 8px;
    cursor: pointer;
    transition:
        background-color 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease,
        opacity 0.2s ease;

    &:hover:not(:disabled) {
        background: rgba(var(--color-primary-rgb), 0.18);
        border-color: rgba(var(--color-primary-rgb), 0.5);
        transform: translateY(-1px);
    }

    &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
    }

    i {
        font-size: 0.78rem;
        color: var(--color-primary);
    }
}
</style>
