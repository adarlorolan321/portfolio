<template>
    <div class="portfolio-bg" aria-hidden="true">
        <div class="portfolio-bg-grid"/>
        <div class="portfolio-bg-glow portfolio-bg-glow-1"/>
        <div class="portfolio-bg-glow portfolio-bg-glow-2"/>
        <div class="portfolio-bg-glow portfolio-bg-glow-3"/>
        <div class="portfolio-bg-noise"/>
    </div>
</template>

<style lang="scss" scoped>
.portfolio-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
}

.portfolio-bg-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(var(--color-grid-line) 1px, transparent 1px),
        linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 85% 70% at 50% 0%, black 20%, transparent 75%);
}

.portfolio-bg-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.9;
    animation: bgFloat 18s ease-in-out infinite;

    &-1 {
        top: -8%;
        left: -5%;
        width: 420px;
        height: 420px;
        background: var(--color-glow-1);
    }

    &-2 {
        top: 35%;
        right: -10%;
        width: 360px;
        height: 360px;
        background: var(--color-glow-2);
        animation-delay: -6s;
        animation-duration: 22s;
    }

    &-3 {
        bottom: -5%;
        left: 25%;
        width: 300px;
        height: 300px;
        background: var(--color-glow-3);
        animation-delay: -12s;
        animation-duration: 26s;
    }
}

.portfolio-bg-noise {
    position: absolute;
    inset: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

@keyframes bgFloat {
    0%, 100% {
        transform: translate(0, 0) scale(1);
    }
    33% {
        transform: translate(24px, -18px) scale(1.05);
    }
    66% {
        transform: translate(-16px, 12px) scale(0.96);
    }
}

@media (prefers-reduced-motion: reduce) {
    .portfolio-bg-glow {
        animation: none;
    }
}
</style>
