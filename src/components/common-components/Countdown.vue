<script setup>
    import {Countdown} from 'vue3-flip-countdown'
    import moment from "moment"

    const props = defineProps({
        coefficientSize: {
            type: Number,
            default: 1,
        },
        deadlineInMilis: {
            type: Number,
            default: new Date().getTime()
        }
    })

    let defaultCountdownSize = 3 //rem
    let defaultLabelSize = 1.2 //rem

</script>

<template>
    <Countdown
        :deadline="moment(props.deadlineInMilis).format('YYYY-MM-DD HH:mm:ss')"
        mainFlipBackgroundColor="#2D3339"
        secondFlipBackgroundColor="#2D3339"
        mainColor="#FFFFFF"
        secondColor="#FFFFFF"
        :countdownSize="`${defaultCountdownSize*props.coefficientSize}rem`"
        :labelSize="`${defaultLabelSize*props.coefficientSize}rem`"
    />
</template>